using Elearn.Application.Common;
using Elearn.Application.DTOs.Instructor;
using Elearn.Application.DTOs.Course;

namespace Elearn.Application.Services.Interfaces
{
    public interface IInstructorService
    {
        Task<BaseResponse<InstructorDto>> GetInstructorByIdAsync(int instructorProfileId);
        Task<BaseResponse<InstructorDto>> GetInstructorByUserIdAsync(string userId);
        Task<BaseResponse<IEnumerable<CourseDto>>> GetInstructorCoursesAsync(int instructorProfileId);
    }
}

