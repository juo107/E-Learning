using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IUserCourseRepository : IGenericRepository<UserCourse>
    {
        /// <summary>
        /// Lấy UserCourse theo UserId và CourseId
        /// </summary>
        Task<UserCourse?> GetByUserIdAndCourseIdAsync(string userId, Guid courseId);

        /// <summary>
        /// Lấy UserCourses theo UserId
        /// </summary>
        Task<IEnumerable<UserCourse>> GetUserCoursesByUserIdAsync(string userId);

        /// <summary>
        /// Lấy UserCourses theo CourseId
        /// </summary>
        Task<IEnumerable<UserCourse>> GetUserCoursesByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Lấy UserCourses theo Status
        /// </summary>
        Task<IEnumerable<UserCourse>> GetUserCoursesByStatusAsync(UserCourseStatus status);

        /// <summary>
        /// Kiểm tra user đã có course với status Active chưa
        /// </summary>
        Task<bool> UserHasActiveCourseAsync(string userId, Guid courseId);
    }
}

