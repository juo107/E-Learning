using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        private readonly ElearnDbContext _context;

        public CourseRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Tìm course theo course code (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<Course?> GetByCourseCodeAsync(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                return null;

            return await _context.Courses
                .Include(c => c.Category)
                .FirstOrDefaultAsync(c => !c.IsDeleted && 
                    c.CourseCode.ToLower() == courseCode.ToLower().Trim());
        }

        /// <summary>
        /// Kiểm tra course code có tồn tại (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<bool> ExistsByCourseCodeAsync(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                return false;

            return await _context.Courses
                .AnyAsync(c => !c.IsDeleted && 
                    c.CourseCode.ToLower() == courseCode.ToLower().Trim());
        }

        /// <summary>
        /// Lấy courses theo category - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByCategoryAsync(Guid categoryId)
        {
            return await _context.Courses
                .Where(c => !c.IsDeleted && c.CategoryId == categoryId)
                .OrderBy(c => c.Title)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy courses với category information - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesWithCategoryAsync()
        {
            return await _context.Courses
                .Include(c => c.Category)
                .Where(c => !c.IsDeleted)
                .OrderBy(c => c.Title)
                .ToListAsync();
        }

        /// <summary>
        /// Tìm kiếm courses theo keyword (title, description, courseCode) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> SearchCoursesAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAllAsync();

            var searchTerm = keyword.ToLower().Trim();
            return await _context.Courses
                .Where(c => !c.IsDeleted && 
                    (c.Title.ToLower().Contains(searchTerm) || 
                     c.Description.ToLower().Contains(searchTerm) ||
                     c.CourseCode.ToLower().Contains(searchTerm)))
                .OrderBy(c => c.Title)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy courses đã bị xóa (soft deleted) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetDeletedCoursesAsync()
        {
            return await _context.Courses
                .Where(c => c.IsDeleted)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Khôi phục course đã bị xóa - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<bool> RestoreCourseAsync(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null || !course.IsDeleted)
                return false;

            course.IsDeleted = false;
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = "System"; // TODO: Get from current user context
            
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Lấy courses theo price range - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _context.Courses
                .Where(c => !c.IsDeleted && c.Price >= minPrice && c.Price <= maxPrice)
                .OrderBy(c => c.Price)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy courses theo duration range - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByDurationRangeAsync(int minDuration, int maxDuration)
        {
            return await _context.Courses
                .Where(c => !c.IsDeleted && 
                    c.DurationInMinutes >= minDuration && c.DurationInMinutes <= maxDuration)
                .OrderBy(c => c.DurationInMinutes)
                .ToListAsync();
        }
    }
}
