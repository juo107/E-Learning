using Elearn.Domain.Entities;

namespace Elearn.Application.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<Course>> GetAllCoursesAsync();
        Task<Course?> GetCourseByIdAsync(Guid id);
        Task<Course> CreateCourseAsync(Course course);
        Task<bool> UpdateCourseAsync(Guid id, Course updatedCourse);
        Task<bool> DeleteCourseAsync(Guid id);
    }
}
