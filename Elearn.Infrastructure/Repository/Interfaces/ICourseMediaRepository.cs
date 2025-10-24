using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for CourseMedia entity operations
    /// </summary>
    public interface ICourseMediaRepository : IGenericRepository<CourseMedia>
    {
        /// <summary>
        /// Lấy tất cả media của một khóa học theo CourseId, sắp xếp theo OrderIndex
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media của khóa học</returns>
        Task<IEnumerable<CourseMedia>> GetByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Lấy tất cả media theo loại (Image, Video, Promo, Document)
        /// </summary>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo loại</returns>
        Task<IEnumerable<CourseMedia>> GetByMediaTypeAsync(MediaType mediaType);

        /// <summary>
        /// Lấy tất cả media theo trạng thái (Active, Deleted, Pending, Archived)
        /// </summary>
        /// <param name="status">Trạng thái media</param>
        /// <returns>Danh sách media theo trạng thái</returns>
        Task<IEnumerable<CourseMedia>> GetByStatusAsync(MediaStatus status);

        /// <summary>
        /// Lấy media chính (IsPrimary = true) của một khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Media chính của khóa học, null nếu không có</returns>
        Task<CourseMedia?> GetPrimaryMediaByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Lấy tất cả media đang hoạt động (Status = Active) của một khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media đang hoạt động</returns>
        Task<IEnumerable<CourseMedia>> GetActiveMediaByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Đặt một media làm media chính của khóa học (chỉ có thể có 1 media chính)
        /// </summary>
        /// <param name="mediaId">ID của media cần đặt làm chính</param>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>True nếu thành công, False nếu thất bại</returns>
        Task<bool> SetPrimaryMediaAsync(Guid mediaId, Guid courseId);

        /// <summary>
        /// Lấy media của một khóa học theo loại cụ thể
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo khóa học và loại</returns>
        Task<IEnumerable<CourseMedia>> GetMediaByCourseIdAndTypeAsync(Guid courseId, MediaType mediaType);

        /// <summary>
        /// Khôi phục một media đã bị xóa mềm (soft delete)
        /// </summary>
        /// <param name="entity">Entity cần khôi phục</param>
        void Restore(CourseMedia entity);
    }
}
