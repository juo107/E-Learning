using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class UserCourseRepository : GenericRepository<UserCourse>, IUserCourseRepository
    {
        private readonly ElearnDbContext _context;

        public UserCourseRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<UserCourse?> GetByUserIdAndCourseIdAsync(string userId, Guid courseId)
        {
            return await _context.UserCourses
                .Where(uc => !uc.IsDeleted && uc.UserId == userId && uc.CourseId == courseId)
                .Include(uc => uc.Course)
                .Include(uc => uc.User)
                .OrderByDescending(uc => uc.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<UserCourse>> GetUserCoursesByUserIdAsync(string userId)
        {
            return await _context.UserCourses
                .Where(uc => !uc.IsDeleted && uc.UserId == userId)
                .Include(uc => uc.Course)
                .OrderByDescending(uc => uc.EnrolledAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserCourse>> GetUserCoursesByCourseIdAsync(Guid courseId)
        {
            return await _context.UserCourses
                .Where(uc => !uc.IsDeleted && uc.CourseId == courseId)
                .Include(uc => uc.User)
                .OrderByDescending(uc => uc.EnrolledAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserCourse>> GetUserCoursesByStatusAsync(UserCourseStatus status)
        {
            return await _context.UserCourses
                .Where(uc => !uc.IsDeleted && uc.Status == status)
                .Include(uc => uc.Course)
                .Include(uc => uc.User)
                .OrderByDescending(uc => uc.EnrolledAt)
                .ToListAsync();
        }

        public async Task<bool> UserHasActiveCourseAsync(string userId, Guid courseId)
        {
            return await _context.UserCourses
                .AnyAsync(uc => !uc.IsDeleted &&
                    uc.UserId == userId &&
                    uc.CourseId == courseId &&
                    uc.Status == UserCourseStatus.Active);
        }
    }
}

