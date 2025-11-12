using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;
using Elearn.Search.Models;
using Elearn.Search.Services;
using Microsoft.Extensions.Logging;

namespace Elearn.Application.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICourseSearchRepository _courseSearchRepository;
        private readonly IRedisCacheService _cache;
        private readonly IInMemoryIndexService _memoryIndex;
        private readonly ILogger<CourseService> _logger;

        public CourseService(
            IUnitOfWork unitOfWork, 
            IMapper mapper, 
            ICourseSearchRepository courseSearchRepository, 
            IRedisCacheService cache, 
            IInMemoryIndexService memoryIndex,
            ILogger<CourseService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _courseSearchRepository = courseSearchRepository;
            _cache = cache;
            _memoryIndex = memoryIndex;
            _logger = logger;
        }

        public async Task<BaseResponse<IEnumerable<CourseDto>>> GetAllCoursesAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                // Create cache key based on parameters (including OnlyPublished and IncludeDeleted to separate cache)
                var cacheKey = $"courses:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.CategoryId}:{parameters.MinPrice}:{parameters.MaxPrice}:{parameters.SortBy}:{parameters.IsDescending}:published:{parameters.OnlyPublished}:deleted:{parameters.IncludeDeleted}";
                
                // Try to get from cache first
                var cachedCourses = await _cache.GetAsync<IEnumerable<CourseDto>>(cacheKey);
                if (cachedCourses != null)
                {
                    return BaseResponse<IEnumerable<CourseDto>>.Ok(cachedCourses, "Courses retrieved from cache");
                }

                // If not in cache, get from database
                var (items, totalCount) = await _unitOfWork.Courses.GetFilteredPagedAsync(
                    parameters.PageNumber,
                    parameters.PageSize,
                    parameters.Keyword,
                    parameters.CategoryId,
                    parameters.MinPrice,
                    parameters.MaxPrice,
                    parameters.MinDurationInMinutes,
                    parameters.MaxDurationInMinutes,
                    parameters.CreatedFrom,
                    parameters.CreatedTo,
                    parameters.SortBy,
                    parameters.IsDescending,
                    parameters.OnlyPublished,
                    parameters.IncludeDeleted);

                var courseDtos = _mapper.Map<IEnumerable<CourseDto>>(items);
                
                // Cache for 15 minutes
                await _cache.SetAsync(cacheKey, courseDtos, TimeSpan.FromMinutes(15));
                
                return BaseResponse<IEnumerable<CourseDto>>.Ok(courseDtos, $"Courses retrieved successfully. Total: {totalCount}.");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error retrieving courses: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseDetailsDto>> GetCourseByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"course:{id}";
                // Temporarily bypass cache to ensure fresh data
                // var cachedCourse = await _cache.GetAsync<CourseDetailsDto>(cacheKey);
                // if (cachedCourse != null)
                // {
                //     return BaseResponse<CourseDetailsDto>.Ok(cachedCourse, "Course retrieved from cache");
                // }

                var course = await _unitOfWork.Courses.GetByIdWithIncludesAsync(id, 
                    c => c.Category, 
                    c => c.CourseMedias,
                    c => c.InstructorProfile!,
                    c => c.InstructorProfile!.ApplicationUser);
                if (course == null)
                    return BaseResponse<CourseDetailsDto>.Fail("Course not found");

                _logger.LogInformation("Course {CourseId} loaded. InstructorProfileId: {InstructorProfileId}", 
                    course.Id, course.InstructorProfileId);

                var courseDto = _mapper.Map<CourseDetailsDto>(course);
                
                // Map instructor information if available
                if (course.InstructorProfile != null && course.InstructorProfile.ApplicationUser != null)
                {
                    var instructor = course.InstructorProfile;
                    var user = instructor.ApplicationUser;
                    
                    // Debug logging
                    _logger.LogInformation("Mapping instructor for course {CourseId}. InstructorId: {InstructorId}, UserId: {UserId}, FullName: {FullName}, Email: {Email}",
                        course.Id, instructor.Id, user.Id, user.FullName, user.Email);
                    
                    // Count total courses by this instructor
                    var totalCourses = await _unitOfWork.Courses.GetCoursesByInstructorIdAsync(instructor.Id);
                    var coursesList = totalCourses.ToList();
                    
                    // Determine FullName with fallback
                    var fullName = !string.IsNullOrWhiteSpace(user.FullName) 
                        ? user.FullName 
                        : (!string.IsNullOrWhiteSpace(user.Email) 
                            ? user.Email.Split('@')[0] 
                            : "Giảng viên");
                    
                    _logger.LogInformation("Final FullName for instructor: {FullName}", fullName);
                    
                    courseDto.Instructor = new DTOs.Instructor.InstructorDto
                    {
                        Id = instructor.Id,
                        UserId = user.Id,
                        FullName = fullName,
                        Email = user.Email ?? string.Empty,
                        AvatarUrl = user.AvatarUrl,
                        Bio = instructor.Bio ?? string.Empty,
                        Profession = instructor.Profession ?? string.Empty,
                        Rating = (double)instructor.Rating,
                        TotalCourses = coursesList.Count,
                        TotalStudents = 0, // TODO: Calculate from UserCourses
                        TotalReviews = 0 // TODO: Calculate from reviews
                    };
                }
                else
                {
                    _logger.LogWarning("Course {CourseId} does not have InstructorProfile or ApplicationUser", course.Id);
                }
                
                // Cache for 30 minutes
                await _cache.SetAsync(cacheKey, courseDto, TimeSpan.FromMinutes(30));
                
                // Log the instructor data for debugging
                if (courseDto.Instructor != null)
                {
                    _logger.LogInformation("Course {CourseId} instructor mapped: Id={Id}, FullName={FullName}, Email={Email}",
                        course.Id, courseDto.Instructor.Id, courseDto.Instructor.FullName, courseDto.Instructor.Email);
                }
                else
                {
                    _logger.LogWarning("Course {CourseId} has no instructor mapped", course.Id);
                }
                
                return BaseResponse<CourseDetailsDto>.Ok(courseDto, "Course retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseDetailsDto>.Fail($"Error retrieving course: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseDto>> CreateCourseAsync(CreateCourseDto dto)
        {
            try
            {
                // Validate input
                if (dto == null)
                    return BaseResponse<CourseDto>.Fail("Course data is required");

                if (string.IsNullOrWhiteSpace(dto.Title))
                    return BaseResponse<CourseDto>.Fail("Course title is required");

                if (dto.Price < 0)
                    return BaseResponse<CourseDto>.Fail("Course price cannot be negative");

                if (dto.DurationInMinutes <= 0)
                    return BaseResponse<CourseDto>.Fail("Course duration must be greater than 0");

                // Generate unique course code
                var courseCode = await GenerateUniqueCourseCodeAsync();

                var course = _mapper.Map<Course>(dto);
                course.CourseCode = courseCode;
                course.CreatedAt = DateTime.UtcNow;
                course.CreatedBy = "System"; // TODO: Get from current user context
                // Level, Language đã được map từ dto
                // Publication
                if (dto.IsPublished)
                {
                    course.IsPublished = true;
                    course.PublishedAt = dto.PublishedAt ?? DateTime.UtcNow;
                }

                await _unitOfWork.Courses.AddAsync(course);
                await _unitOfWork.CompleteAsync();

                // Index to Elasticsearch
                var searchDoc = new CourseSearchDocument
                {
                    Id = course.Id.ToString(),
                    CourseCode = course.CourseCode,
                    Title = course.Title,
                    Description = course.Description,
                    Price = course.Price,
                    DurationInMinutes = course.DurationInMinutes,
                    CategoryId = course.CategoryId?.ToString()
                };
                await _courseSearchRepository.IndexAsync(searchDoc);

                // Invalidate cache
                await _cache.RemoveByPatternAsync("course:*");
                await _cache.RemoveByPatternAsync("courses:*");

                // Cập nhật index in-memory theo title & code
                await _memoryIndex.SetCourseCodeIndexAsync(course.CourseCode, course.Id);
                await _memoryIndex.AddCourseToTitleIndexAsync(course.Title, course.Id);

                var courseDto = _mapper.Map<CourseDto>(course);
                return BaseResponse<CourseDto>.Ok(courseDto, "Course created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseDto>.Fail($"Error creating course: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseDto>> UpdateCourseAsync(Guid id, UpdateCourseDto dto)
        {
            try
            {
                // Validate input
                if (dto == null)
                    return BaseResponse<CourseDto>.Fail("Course data is required");

                if (string.IsNullOrWhiteSpace(dto.Title))
                    return BaseResponse<CourseDto>.Fail("Course title is required");

                if (dto.Price < 0)
                    return BaseResponse<CourseDto>.Fail("Course price cannot be negative");

                var existing = await _unitOfWork.Courses.GetByIdAsync(id);
                if (existing == null)
                    return BaseResponse<CourseDto>.Fail("Course not found");

                // Track title cũ để cập nhật index in-memory
                var oldTitle = existing.Title;
                // Update properties
                existing.Title = dto.Title;
                existing.Description = dto.Description;
                existing.Price = dto.Price;
                if (dto.Level.HasValue)
                {
                    existing.Level = dto.Level.Value;
                }
                if (dto.Language.HasValue)
                {
                    existing.Language = dto.Language.Value;
                }
                if (dto.IsPublished.HasValue)
                {
                    existing.IsPublished = dto.IsPublished.Value;
                    if (existing.IsPublished)
                    {
                        existing.PublishedAt = dto.PublishedAt ?? existing.PublishedAt ?? DateTime.UtcNow;
                    }
                    else
                    {
                        // unpublish -> remove published date (optional policy)
                        existing.PublishedAt = null;
                    }
                }
                else if (dto.PublishedAt.HasValue)
                {
                    // allow updating PublishedAt explicitly
                    existing.PublishedAt = dto.PublishedAt.Value;
                }
                existing.UpdatedAt = DateTime.UtcNow;
                existing.UpdatedBy = "System"; // TODO: Get from current user context

                _unitOfWork.Courses.Update(existing);
                await _unitOfWork.CompleteAsync();

                // Re-index updated document
                var searchDoc = new CourseSearchDocument
                {
                    Id = existing.Id.ToString(),
                    CourseCode = existing.CourseCode,
                    Title = existing.Title,
                    Description = existing.Description,
                    Price = existing.Price,
                    DurationInMinutes = existing.DurationInMinutes,
                    CategoryId = existing.CategoryId?.ToString()
                };
                await _courseSearchRepository.IndexAsync(searchDoc);

                // Invalidate cache
                await _cache.RemoveAsync($"course:{existing.Id}");
                await _cache.RemoveByPatternAsync("courses:*");

                // Cập nhật index in-memory theo title nếu đổi tên
                if (!string.Equals(oldTitle, existing.Title, StringComparison.OrdinalIgnoreCase))
                {
                    await _memoryIndex.RemoveCourseFromTitleIndexAsync(oldTitle, existing.Id);
                    await _memoryIndex.AddCourseToTitleIndexAsync(existing.Title, existing.Id);
                }

                var courseDto = _mapper.Map<CourseDto>(existing);
                return BaseResponse<CourseDto>.Ok(courseDto, "Course updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseDto>.Fail($"Error updating course: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteCourseAsync(Guid id)
        {
            try
            {
                var existing = await _unitOfWork.Courses.GetByIdAsync(id);
                if (existing == null)
                    return BaseResponse<bool>.Fail("Course not found");
                existing.IsDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.UpdatedBy = "System"; // TODO: Get from current user context
                
                _unitOfWork.Courses.Update(existing);
                await _unitOfWork.CompleteAsync();

                // Remove from search index
                await _courseSearchRepository.DeleteAsync(existing.Id.ToString());

                // Invalidate cache
                await _cache.RemoveAsync($"course:{existing.Id}");
                await _cache.RemoveByPatternAsync("courses:*");

                return BaseResponse<bool>.Ok(true, "Course deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting course: {ex.Message}");
            }
        }

        public async Task<bool> CourseExistsAsync(Guid id)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(id);
            return course != null;
        }

        public async Task<bool> CourseCodeExistsAsync(string courseCode)
        {
            return await _unitOfWork.Courses.ExistsByCourseCodeAsync(courseCode);
        }

        private async Task<string> GenerateUniqueCourseCodeAsync()
        {
            string courseCode;
            do
            {
                courseCode = $"WEBDEV_{DateTime.UtcNow:yyyyMMddHHmmss}";
            } while (await CourseCodeExistsAsync(courseCode));

            return courseCode;
        }

        // Additional methods using CourseRepository specific functionality
        public async Task<BaseResponse<CourseDetailsDto>> GetCourseByCodeAsync(string courseCode)
        {
            try
            {
                // 1) Tra cứu nhanh courseId từ index trong bộ nhớ (nếu có)
                var indexedId = await _memoryIndex.GetCourseIdByCodeAsync(courseCode);
                Course? course = null;
                if (indexedId.HasValue)
                {
                    course = await _unitOfWork.Courses.GetByIdWithIncludesAsync(indexedId.Value, c => c.Category, c => c.CourseMedias);
                }

                // 2) Nếu miss index, truy vấn theo courseCode và set index lại
                if (course == null)
                {
                    course = await _unitOfWork.Courses.GetByCourseCodeAsync(courseCode);
                    if (course != null)
                    {
                        await _memoryIndex.SetCourseCodeIndexAsync(courseCode, course.Id);
                    }
                }
                if (course == null)
                    return BaseResponse<CourseDetailsDto>.Fail("Course not found");

                var courseDto = _mapper.Map<CourseDetailsDto>(course);
                return BaseResponse<CourseDetailsDto>.Ok(courseDto, "Course retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseDetailsDto>.Fail($"Error retrieving course: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy danh sách khóa học theo tiêu đề (exact match, không phân biệt hoa thường) với index in-memory.
        /// Luồng: thử lấy id list từ in-memory -> nếu miss thì DB -> lưu index.
        /// </summary>
        public async Task<BaseResponse<IEnumerable<CourseDto>>> GetCoursesByTitleAsync(string title)
        {
            try
            {
                List<Course> courses = new();
                var indexedIds = await _memoryIndex.GetCourseIdsByTitleAsync(title);
                if (indexedIds != null && indexedIds.Count > 0)
                {
                    // Lấy theo danh sách id (nên có phương thức repo batch-by-ids, tạm dùng từng cái)
                    foreach (var id in indexedIds)
                    {
                        var c = await _unitOfWork.Courses.GetByIdWithIncludesAsync(id, x => x.Category, x => x.CourseMedias);
                        if (c != null) courses.Add(c);
                    }
                }

                if (courses.Count == 0)
                {
                    // Miss index -> DB
                    var dbCourses = await _unitOfWork.Courses.GetByTitleAsync(title);
                    courses = dbCourses.ToList();
                    // Lưu index để lần sau truy vấn nhanh
                    foreach (var c in courses)
                    {
                        await _memoryIndex.AddCourseToTitleIndexAsync(title, c.Id);
                    }
                }

                var dtos = _mapper.Map<IEnumerable<CourseDto>>(courses);
                return BaseResponse<IEnumerable<CourseDto>>.Ok(dtos, "Courses retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error retrieving courses by title: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseDto>>> GetCoursesByCategoryAsync(Guid categoryId)
        {
            try
            {
                var courses = await _unitOfWork.Courses.GetCoursesByCategoryAsync(categoryId);
                var courseDtos = _mapper.Map<IEnumerable<CourseDto>>(courses);
                return BaseResponse<IEnumerable<CourseDto>>.Ok(courseDtos, "Courses retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error retrieving courses: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseDto>>> SearchCoursesAsync(string keyword)
        {
            try
            {
                // Prefer Elasticsearch search
                var results = await _courseSearchRepository.SearchAsync(keyword);
                var dtos = results.Select(r => new CourseDto
                {
                    Id = Guid.Parse(r.Id),
                    CourseCode = r.CourseCode,
                    Title = r.Title,
                    Description = r.Description,
                    Price = r.Price,
                    DurationInMinutes = r.DurationInMinutes,
                    CategoryId = string.IsNullOrEmpty(r.CategoryId) ? null : Guid.Parse(r.CategoryId)
                });
                return BaseResponse<IEnumerable<CourseDto>>.Ok(dtos, "Courses retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error searching courses: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<string>>> AutocompleteCoursesAsync(string prefix, int size = 10)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(prefix))
                    return BaseResponse<IEnumerable<string>>.Ok(Enumerable.Empty<string>(), "No prefix provided");

                var suggestions = await _courseSearchRepository.AutocompleteAsync(prefix, size);
                return BaseResponse<IEnumerable<string>>.Ok(suggestions, "Autocomplete suggestions retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<string>>.Fail($"Error getting suggestions: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreCourseAsync(Guid id)
        {
            try
            {
                var restored = await _unitOfWork.Courses.RestoreCourseAsync(id);
                if (!restored)
                    return BaseResponse<bool>.Fail("Course not found or not deleted");

                return BaseResponse<bool>.Ok(true, "Course restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring course: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> IndexAllCoursesAsync()
        {
            try
            {
                var courses = await _unitOfWork.Courses.GetAllAsync();
                var courseDtos = _mapper.Map<IEnumerable<CourseDto>>(courses);

                foreach (var course in courseDtos)
                {
                    var searchDocument = new Elearn.Search.Models.CourseSearchDocument
                    {
                        Id = course.Id.ToString(),
                        Title = course.Title,
                        Description = course.Description,
                        CourseCode = course.CourseCode
                    };

                    await _courseSearchRepository.IndexAsync(searchDocument);
                }

                return BaseResponse<bool>.Ok(true, $"Successfully indexed {courseDtos.Count()} courses");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error indexing courses: {ex.Message}");
            }
        }

        public async Task<BaseResponse<string>> AssignInstructorsToCoursesAsync()
        {
            try
            {
                // Lấy tất cả instructor profiles
                var instructors = await _unitOfWork.InstructorProfiles.GetAllAsync();
                var instructorList = instructors.ToList();

                if (instructorList.Count == 0)
                {
                    return BaseResponse<string>.Fail("No instructors found in database");
                }

                // Lấy tất cả courses chưa có instructor
                var allCourses = await _unitOfWork.Courses.GetAllAsync();
                var coursesWithoutInstructor = allCourses
                    .Where(c => c.InstructorProfileId == null || c.InstructorProfileId == 0)
                    .ToList();

                if (coursesWithoutInstructor.Count == 0)
                {
                    return BaseResponse<string>.Ok("All courses already have instructors assigned");
                }

                // Gán instructor cho courses (round-robin)
                int assignedCount = 0;
                for (int i = 0; i < coursesWithoutInstructor.Count; i++)
                {
                    var course = coursesWithoutInstructor[i];
                    var instructor = instructorList[i % instructorList.Count];
                    
                    course.InstructorProfileId = instructor.Id;
                    course.UpdatedAt = DateTime.UtcNow;
                    course.UpdatedBy = "System";
                    
                    _unitOfWork.Courses.Update(course);
                    assignedCount++;
                }

                await _unitOfWork.CompleteAsync();

                // Clear cache for all affected courses
                foreach (var course in coursesWithoutInstructor)
                {
                    await _cache.RemoveAsync($"course:{course.Id}");
                }
                await _cache.RemoveByPatternAsync("courses:*");

                var message = $"Successfully assigned instructors to {assignedCount} courses. " +
                             $"Total instructors: {instructorList.Count}, " +
                             $"Total courses assigned: {assignedCount}";

                _logger.LogInformation(message);
                return BaseResponse<string>.Ok(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning instructors to courses");
                return BaseResponse<string>.Fail($"Error assigning instructors: {ex.Message}");
            }
        }
    }
}
