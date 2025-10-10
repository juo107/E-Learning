using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;

namespace Elearn.Application.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Course>> GetAllCoursesAsync()
        {
            return await _unitOfWork.Courses.GetAllAsync();
        }

        public async Task<Course?> GetCourseByIdAsync(Guid id)
        {
            return await _unitOfWork.Courses.GetByIdAsync(id);
        }

        public async Task<Course> CreateCourseAsync(Course course)
        {
            course.CourseCode = $"WEBDEV_{DateTime.UtcNow:yyyyMMddHHmmss}";
            await _unitOfWork.Courses.AddAsync(course);
            await _unitOfWork.CompleteAsync();
            return course;
        }

        public async Task<bool> UpdateCourseAsync(Guid id, Course updatedCourse)
        {
            var existing = await _unitOfWork.Courses.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Title = updatedCourse.Title;
            existing.Description = updatedCourse.Description;
            existing.Price = updatedCourse.Price;
            existing.DurationInMinutes = updatedCourse.DurationInMinutes;

            _unitOfWork.Courses.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> DeleteCourseAsync(Guid id)
        {
            var existing = await _unitOfWork.Courses.GetByIdAsync(id);
            if (existing == null) return false;

            _unitOfWork.Courses.Delete(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
