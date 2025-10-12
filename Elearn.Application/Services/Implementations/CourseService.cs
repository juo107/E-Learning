using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;

namespace Elearn.Application.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CourseService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponse<IEnumerable<CourseDto>>> GetAllCoursesAsync(QueryParameters? parameters = null)
        {
            try
            {
                var courses = await _unitOfWork.Courses.GetAllAsync();
                
                // Apply filtering by keyword if provided
                if (parameters != null && !string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    courses = courses.Where(c => 
                        c.Title.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        c.Description.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        c.CourseCode.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase));
                }

                // Apply sorting
                if (parameters != null)
                {
                    courses = parameters.SortBy?.ToLower() switch
                    {
                        "title" => parameters.IsDescending ? courses.OrderByDescending(c => c.Title) : courses.OrderBy(c => c.Title),
                        "price" => parameters.IsDescending ? courses.OrderByDescending(c => c.Price) : courses.OrderBy(c => c.Price),
                        "duration" => parameters.IsDescending ? courses.OrderByDescending(c => c.DurationInMinutes) : courses.OrderBy(c => c.DurationInMinutes),
                        "createdat" => parameters.IsDescending ? courses.OrderByDescending(c => c.CreatedAt) : courses.OrderBy(c => c.CreatedAt),
                        _ => parameters.IsDescending ? courses.OrderByDescending(c => c.CreatedAt) : courses.OrderBy(c => c.CreatedAt)
                    };

                    // Apply pagination
                    courses = courses
                        .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                        .Take(parameters.PageSize);
                }

                var courseDtos = _mapper.Map<IEnumerable<CourseDto>>(courses);
                return BaseResponse<IEnumerable<CourseDto>>.Ok(courseDtos, "Courses retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error retrieving courses: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseDto>> GetCourseByIdAsync(Guid id)
        {
            try
            {
                var course = await _unitOfWork.Courses.GetByIdAsync(id);
                if (course == null)
                    return BaseResponse<CourseDto>.Fail("Course not found");

                var courseDto = _mapper.Map<CourseDto>(course);
                return BaseResponse<CourseDto>.Ok(courseDto, "Course retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseDto>.Fail($"Error retrieving course: {ex.Message}");
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
        public async Task<BaseResponse<CourseDto>> GetCourseByCodeAsync(string courseCode)
        {
            try
            {
                var course = await _unitOfWork.Courses.GetByCourseCodeAsync(courseCode);
                if (course == null)
                    return BaseResponse<CourseDto>.Fail("Course not found");

                var courseDto = _mapper.Map<CourseDto>(course);
                return BaseResponse<CourseDto>.Ok(courseDto, "Course retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseDto>.Fail($"Error retrieving course: {ex.Message}");
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
                var courses = await _unitOfWork.Courses.SearchCoursesAsync(keyword);
                var courseDtos = _mapper.Map<IEnumerable<CourseDto>>(courses);
                return BaseResponse<IEnumerable<CourseDto>>.Ok(courseDtos, "Courses retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error searching courses: {ex.Message}");
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
