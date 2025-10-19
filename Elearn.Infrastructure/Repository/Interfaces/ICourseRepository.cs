using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ICourseRepository : IGenericRepository<Course>
    {
        /// <summary>
        /// Tìm course theo course code - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<Course?> GetByCourseCodeAsync(string courseCode);
        
        /// <summary>
        /// Kiểm tra course code có tồn tại - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<bool> ExistsByCourseCodeAsync(string courseCode);
        
        /// <summary>
        /// Lấy courses theo category - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Course>> GetCoursesByCategoryAsync(Guid categoryId);
        
        /// <summary>
        /// Lấy courses với category information - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Course>> GetCoursesWithCategoryAsync();
        
        /// <summary>
        /// Tìm kiếm courses theo keyword (title, description, courseCode) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Course>> SearchCoursesAsync(string keyword);
        
        /// <summary>
        /// Lấy courses đã bị xóa (soft deleted) - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Course>> GetDeletedCoursesAsync();
        
        /// <summary>
        /// Khôi phục course đã bị xóa - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<bool> RestoreCourseAsync(Guid id);
        
        /// <summary>
        /// Lấy courses theo price range - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Course>> GetCoursesByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        
        /// <summary>
        /// Lấy courses theo duration range - Logic nghiệp vụ đặc thù
        /// </summary>
        Task<IEnumerable<Course>> GetCoursesByDurationRangeAsync(int minDuration, int maxDuration);

        /// <summary>
        /// Lọc nâng cao kèm phân trang, trả về danh sách và tổng số bản ghi
        /// </summary>
        Task<(IEnumerable<Course> Items, int TotalCount)> GetFilteredPagedAsync(
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
            bool isDescending = true);
    }
}
