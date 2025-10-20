using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;
using Elearn.Search.Models;
using Elearn.Search.Services;

namespace Elearn.Application.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICourseSearchRepository _courseSearchRepository;
        private readonly IRedisCacheService _cache;

        public CourseService(IUnitOfWork unitOfWork, IMapper mapper, ICourseSearchRepository courseSearchRepository, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _courseSearchRepository = courseSearchRepository;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<CourseDto>>> GetAllCoursesAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                // Create cache key based on parameters
                var cacheKey = $"courses:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.CategoryId}:{parameters.MinPrice}:{parameters.MaxPrice}:{parameters.SortBy}:{parameters.IsDescending}";
                
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
                    parameters.IsDescending);

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
                var cachedCourse = await _cache.GetAsync<CourseDetailsDto>(cacheKey);
                if (cachedCourse != null)
                {
                    return BaseResponse<CourseDetailsDto>.Ok(cachedCourse, "Course retrieved from cache");
                }

                var course = await _unitOfWork.Courses.GetByIdWithIncludesAsync(id, c => c.Category);
                if (course == null)
                    return BaseResponse<CourseDetailsDto>.Fail("Course not found");

                var courseDto = _mapper.Map<CourseDetailsDto>(course);
                
                // Cache for 30 minutes
                await _cache.SetAsync(cacheKey, courseDto, TimeSpan.FromMinutes(30));
                
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

                // Update properties
                existing.Title = dto.Title;
                existing.Description = dto.Description;
                existing.Price = dto.Price;
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
                var course = await _unitOfWork.Courses.GetByCourseCodeAsync(courseCode);
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
    }
}
