using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.DTOs.Instructor;
using Elearn.Application.Services.Interfaces;
using Elearn.Infrastructure.Repository;
using Microsoft.Extensions.Logging;

namespace Elearn.Application.Services.Implementations.Instructor
{
    public class InstructorService : IInstructorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<InstructorService> _logger;

        public InstructorService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<InstructorService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<BaseResponse<InstructorDto>> GetInstructorByIdAsync(int instructorProfileId)
        {
            try
            {
                var instructorProfile = await _unitOfWork.InstructorProfiles.GetByIdWithUserAsync(instructorProfileId);

                if (instructorProfile == null || instructorProfile.ApplicationUser == null)
                {
                    return BaseResponse<InstructorDto>.Fail("Instructor not found");
                }

                var user = instructorProfile.ApplicationUser;
                
                // Get courses by this instructor
                var courses = await _unitOfWork.Courses.GetCoursesByInstructorIdAsync(instructorProfileId);
                var coursesList = courses.ToList();
                
                // TODO: Calculate total students from UserCourses
                // TODO: Calculate total reviews from reviews table
                
                var instructorDto = new InstructorDto
                {
                    Id = instructorProfile.Id,
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    AvatarUrl = user.AvatarUrl,
                    Bio = instructorProfile.Bio,
                    Profession = instructorProfile.Profession,
                    Rating = (double)instructorProfile.Rating,
                    TotalCourses = coursesList.Count,
                    TotalStudents = 0, // TODO: Calculate from UserCourses
                    TotalReviews = 0 // TODO: Calculate from reviews
                };

                return BaseResponse<InstructorDto>.Ok(instructorDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting instructor by ID: {InstructorProfileId}", instructorProfileId);
                return BaseResponse<InstructorDto>.Fail($"Error retrieving instructor: {ex.Message}");
            }
        }

        public async Task<BaseResponse<InstructorDto>> GetInstructorByUserIdAsync(string userId)
        {
            try
            {
                var instructorProfile = await _unitOfWork.InstructorProfiles.GetByUserIdAsync(userId);
                
                if (instructorProfile == null)
                {
                    return BaseResponse<InstructorDto>.Fail("Instructor not found");
                }

                return await GetInstructorByIdAsync(instructorProfile.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting instructor by UserId: {UserId}", userId);
                return BaseResponse<InstructorDto>.Fail($"Error retrieving instructor: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseDto>>> GetInstructorCoursesAsync(int instructorProfileId)
        {
            try
            {
                var courses = await _unitOfWork.Courses.GetCoursesByInstructorIdAsync(instructorProfileId);
                var courseDtos = _mapper.Map<IEnumerable<CourseDto>>(courses);
                
                return BaseResponse<IEnumerable<CourseDto>>.Ok(courseDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting instructor courses: {InstructorProfileId}", instructorProfileId);
                return BaseResponse<IEnumerable<CourseDto>>.Fail($"Error retrieving courses: {ex.Message}");
            }
        }
    }
}

