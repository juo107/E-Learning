using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class CourseRepository : GenericRepository<Course>, ICourseRepository
    {
        private readonly ElearnDbContext _write;
        private readonly ReadDbContext _read;

        public CourseRepository(ElearnDbContext write, ReadDbContext read)
            : base(write)
        {
            _write = write;
            _read = read;
        }

        /// <summary>
        /// Tìm course theo course code (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<Course?> GetByCourseCodeAsync(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                return null;

            return await _read.Courses
                .Include(c => c.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => !c.IsDeleted &&
                    c.CourseCode.ToLower() == courseCode.ToLower().Trim());
        }

        /// <summary>
        /// Lấy danh sách course theo tiêu đề (so khớp chính xác, không phân biệt hoa thường).
        /// </summary>
        public async Task<IEnumerable<Course>> GetByTitleAsync(string title)
        {
            if (string.IsNullOrWhiteSpace(title)) return Enumerable.Empty<Course>();
            var t = title.ToLower().Trim();
            return await _read.Courses
                .Include(c => c.Category)
                .AsNoTracking()
                .Where(c => !c.IsDeleted && c.Title.ToLower() == t)
                .ToListAsync();
        }

        /// <summary>
        /// Kiểm tra course code có tồn tại (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<bool> ExistsByCourseCodeAsync(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                return false;

            return await _read.Courses
                .AsNoTracking()
                .AnyAsync(c => !c.IsDeleted &&
                    c.CourseCode.ToLower() == courseCode.ToLower().Trim());
        }

        /// <summary>
        /// Lấy courses theo category - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByCategoryAsync(Guid categoryId)
        {
            return await _read.Courses
                .AsNoTracking()
                .Where(c => !c.IsDeleted && c.CategoryId == categoryId)
                .OrderBy(c => c.Title)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy courses với category information - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesWithCategoryAsync()
        {
            return await _read.Courses
                .Include(c => c.Category)
                .AsNoTracking()
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
                return await _read.Courses.AsNoTracking().ToListAsync();

            var searchTerm = keyword.ToLower().Trim();
            return await _read.Courses
                .AsNoTracking()
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
            return await _read.Courses
                .AsNoTracking()
                .Where(c => c.IsDeleted)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Khôi phục course đã bị xóa - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<bool> RestoreCourseAsync(Guid id)
        {
            var course = await _write.Courses.FindAsync(id);
            if (course == null || !course.IsDeleted)
                return false;

            course.IsDeleted = false;
            course.UpdatedAt = DateTime.UtcNow;
            course.UpdatedBy = "System";

            _write.Courses.Update(course);
            await _write.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Lấy courses theo price range - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _read.Courses
                .AsNoTracking()
                .Where(c => !c.IsDeleted && c.Price >= minPrice && c.Price <= maxPrice)
                .OrderBy(c => c.Price)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy courses theo duration range - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByDurationRangeAsync(int minDuration, int maxDuration)
        {
            return await _read.Courses
                .AsNoTracking()
                .Where(c => !c.IsDeleted &&
                    c.DurationInMinutes >= minDuration && c.DurationInMinutes <= maxDuration)
                .OrderBy(c => c.DurationInMinutes)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Course> Items, int TotalCount)> GetFilteredPagedAsync(
            int pageNumber,
            int pageSize,
            string? keyword = null,
            Guid? categoryId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            int? minDuration = null,
            int? maxDuration = null,
            DateTime? createdFrom = null,
            DateTime? createdTo = null,
            string? sortBy = null,
            bool isDescending = true,
            bool onlyPublished = false,
            bool includeDeleted = false)
        {
            var query = _read.Courses
                .Include(c => c.Category)
                .Include(c => c.CourseMedias)
                .AsNoTracking()
                .AsQueryable();

            if (includeDeleted)
            {
                query = query.Where(c => c.IsDeleted);
            }
            else
            {
                query = query.Where(c => !c.IsDeleted);
            }

            if (onlyPublished)
            {
                query = query.Where(c => c.IsPublished);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var k = keyword.ToLower().Trim();
                query = query.Where(c =>
                    c.Title.ToLower().Contains(k) ||
                    c.Description.ToLower().Contains(k) ||
                    c.CourseCode.ToLower().Contains(k));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(c => c.CategoryId == categoryId);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(c => c.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(c => c.Price <= maxPrice.Value);
            }

            if (minDuration.HasValue)
            {
                query = query.Where(c => c.DurationInMinutes >= minDuration.Value);
            }

            if (maxDuration.HasValue)
            {
                query = query.Where(c => c.DurationInMinutes <= maxDuration.Value);
            }

            if (createdFrom.HasValue)
            {
                query = query.Where(c => c.CreatedAt >= createdFrom.Value);
            }

            if (createdTo.HasValue)
            {
                query = query.Where(c => c.CreatedAt <= createdTo.Value);
            }

            query = (sortBy?.ToLower()) switch
            {
                "title" => isDescending ? query.OrderByDescending(c => c.Title) : query.OrderBy(c => c.Title),
                "price" => isDescending ? query.OrderByDescending(c => c.Price) : query.OrderBy(c => c.Price),
                "duration" => isDescending ? query.OrderByDescending(c => c.DurationInMinutes) : query.OrderBy(c => c.DurationInMinutes),
                "createdat" => isDescending ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt),
                _ => isDescending ? query.OrderByDescending(c => c.CreatedAt) : query.OrderBy(c => c.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        /// <summary>
        /// Lấy courses theo instructor profile ID
        /// </summary>
        public async Task<IEnumerable<Course>> GetCoursesByInstructorIdAsync(int instructorProfileId)
        {
            return await _read.Courses
                .AsNoTracking()
                .Where(c => !c.IsDeleted && c.InstructorProfileId == instructorProfileId)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }
    }
}
