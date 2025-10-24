using Microsoft.EntityFrameworkCore;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Infrastructure.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for CourseMedia entity operations
    /// </summary>
    public class CourseMediaRepository : GenericRepository<CourseMedia>, ICourseMediaRepository
    {
        /// <summary>
        /// Constructor for CourseMediaRepository
        /// </summary>
        /// <param name="context">Database context</param>
        public CourseMediaRepository(ElearnDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Lấy tất cả media của một khóa học theo CourseId, sắp xếp theo OrderIndex
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media của khóa học</returns>
        public async Task<IEnumerable<CourseMedia>> GetByCourseIdAsync(Guid courseId)
        {
            return await _dbSet
                .Where(cm => cm.CourseId == courseId)
                .OrderBy(cm => cm.OrderIndex)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy tất cả media theo loại (Image, Video, Promo, Document)
        /// </summary>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo loại</returns>
        public async Task<IEnumerable<CourseMedia>> GetByMediaTypeAsync(MediaType mediaType)
        {
            return await _dbSet
                .Where(cm => cm.MediaType == mediaType)
                .OrderBy(cm => cm.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy tất cả media theo trạng thái (Active, Deleted, Pending, Archived)
        /// </summary>
        /// <param name="status">Trạng thái media</param>
        /// <returns>Danh sách media theo trạng thái</returns>
        public async Task<IEnumerable<CourseMedia>> GetByStatusAsync(MediaStatus status)
        {
            return await _dbSet
                .Where(cm => cm.Status == status)
                .OrderBy(cm => cm.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Lấy media chính (IsPrimary = true) của một khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Media chính của khóa học, null nếu không có</returns>
        public async Task<CourseMedia?> GetPrimaryMediaByCourseIdAsync(Guid courseId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(cm => cm.CourseId == courseId && cm.IsPrimary);
        }

        /// <summary>
        /// Lấy tất cả media đang hoạt động (Status = Active) của một khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media đang hoạt động</returns>
        public async Task<IEnumerable<CourseMedia>> GetActiveMediaByCourseIdAsync(Guid courseId)
        {
            return await _dbSet
                .Where(cm => cm.CourseId == courseId && cm.Status == MediaStatus.Active)
                .OrderBy(cm => cm.OrderIndex)
                .ToListAsync();
        }

        /// <summary>
        /// Đặt một media làm media chính của khóa học (chỉ có thể có 1 media chính)
        /// Sử dụng transaction để đảm bảo tính nhất quán dữ liệu
        /// </summary>
        /// <param name="mediaId">ID của media cần đặt làm chính</param>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>True nếu thành công, False nếu thất bại</returns>
        public async Task<bool> SetPrimaryMediaAsync(Guid mediaId, Guid courseId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Remove primary status from all media in this course
                var existingPrimary = await _dbSet
                    .Where(cm => cm.CourseId == courseId && cm.IsPrimary)
                    .ToListAsync();

                foreach (var media in existingPrimary)
                {
                    media.IsPrimary = false;
                }

                // Set the specified media as primary
                var targetMedia = await _dbSet
                    .FirstOrDefaultAsync(cm => cm.Id == mediaId && cm.CourseId == courseId);

                if (targetMedia != null)
                {
                    targetMedia.IsPrimary = true;
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }

                await transaction.RollbackAsync();
                return false;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        /// <summary>
        /// Lấy media của một khóa học theo loại cụ thể
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo khóa học và loại</returns>
        public async Task<IEnumerable<CourseMedia>> GetMediaByCourseIdAndTypeAsync(Guid courseId, MediaType mediaType)
        {
            return await _dbSet
                .Where(cm => cm.CourseId == courseId && cm.MediaType == mediaType)
                .OrderBy(cm => cm.OrderIndex)
                .ToListAsync();
        }

        /// <summary>
        /// Khôi phục một media đã bị xóa mềm (soft delete)
        /// </summary>
        /// <param name="entity">Entity cần khôi phục</param>
        public void Restore(CourseMedia entity)
        {
            entity.IsDeleted = false;
            entity.DeletedAt = null;
            entity.DeletedBy = null;
        }
    }
}
