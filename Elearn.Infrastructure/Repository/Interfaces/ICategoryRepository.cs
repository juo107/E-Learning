using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        /// <summary>
        /// Tìm category theo tên (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<Category?> GetByNameAsync(string name);
        
        /// <summary>
        /// Kiểm tra category có tồn tại theo tên (case-insensitive) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<bool> ExistsByNameAsync(string name);
        
        /// <summary>
        /// Lấy categories kèm courses (Include relationship) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Category>> GetCategoriesWithCoursesAsync();
        
        /// <summary>
        /// Lấy categories có courses (chỉ categories không rỗng) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Category>> GetCategoriesWithActiveCoursesAsync();
        
        /// <summary>
        /// Tìm kiếm categories theo keyword (tên hoặc mô tả) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Category>> SearchCategoriesAsync(string keyword);
        
        /// <summary>
        /// Lấy categories đã bị xóa (soft deleted) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Category>> GetDeletedCategoriesAsync();
        
        /// <summary>
        /// Khôi phục category đã bị xóa - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<bool> RestoreCategoryAsync(Guid id);
    }
}
