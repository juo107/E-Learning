using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Domain.Entities;

namespace Elearn.Application.Services.Interfaces
{
    public interface ICourseService
    {
        Task<BaseResponse<IEnumerable<CourseDto>>> GetAllCoursesAsync(QueryParameters? parameters = null);
        Task<BaseResponse<CourseDetailsDto>> GetCourseByIdAsync(Guid id);
        Task<BaseResponse<CourseDetailsDto>> GetCourseByCodeAsync(string courseCode);
        Task<BaseResponse<CourseDto>> CreateCourseAsync(CreateCourseDto dto);
        Task<BaseResponse<CourseDto>> UpdateCourseAsync(Guid id, UpdateCourseDto dto);
        Task<BaseResponse<bool>> DeleteCourseAsync(Guid id);
        Task<BaseResponse<bool>> RestoreCourseAsync(Guid id);
        Task<BaseResponse<IEnumerable<CourseDto>>> GetCoursesByCategoryAsync(Guid categoryId);
        Task<BaseResponse<IEnumerable<CourseDto>>> SearchCoursesAsync(string keyword);
        Task<BaseResponse<IEnumerable<string>>> AutocompleteCoursesAsync(string prefix, int size = 10);
        Task<BaseResponse<bool>> IndexAllCoursesAsync();
        Task<bool> CourseExistsAsync(Guid id);
        Task<bool> CourseCodeExistsAsync(string courseCode);
    }
}
