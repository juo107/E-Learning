using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        private readonly ElearnDbContext _context;

        public CategoryRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Tìm category theo tên (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<Category?> GetByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            return await _context.Categories
                .FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower().Trim());
        }

        /// <summary>
        /// Kiểm tra category có tồn tại theo tên (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<bool> ExistsByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return await _context.Categories
                .AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim());
        }

        /// <summary>
        /// Lấy categories kèm courses (Include relationship) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Category>> GetCategoriesWithCoursesAsync()
        {
            return await _context.Categories
                .Include(c => c.Courses)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy categories có courses (chỉ categories không rỗng) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Category>> GetCategoriesWithActiveCoursesAsync()
        {
            return await _context.Categories
                .Include(c => c.Courses)
                .Where(c => c.Courses != null && c.Courses.Any())
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Tìm kiếm categories theo keyword (tên hoặc mô tả) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Category>> SearchCategoriesAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAllAsync();

            var searchTerm = keyword.ToLower().Trim();
            return await _context.Categories
                .Where(c => !c.IsDeleted && 
                           (c.Name.ToLower().Contains(searchTerm) || 
                           (c.Description != null && c.Description.ToLower().Contains(searchTerm))))
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy categories đã bị xóa (soft deleted) - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<IEnumerable<Category>> GetDeletedCategoriesAsync()
        {
            return await _context.Categories
                .Where(c => c.IsDeleted)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Khôi phục category đã bị xóa - Logic nghiệp vụ đặc thù
        /// </summary>
        public async Task<bool> RestoreCategoryAsync(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null || !category.IsDeleted)
                return false;

            category.IsDeleted = false;
            category.UpdatedAt = DateTime.UtcNow;
            category.UpdatedBy = "System"; // TODO: Get from current user context
            
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
