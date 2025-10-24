using Elearn.Application.Common;
using Elearn.Application.DTOs.CourseMedia;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.Services.Interfaces
{
    /// <summary>
    /// Service interface for CourseMedia business operations
    /// </summary>
    public interface ICourseMediaService
    {
        /// <summary>
        /// Lấy tất cả course media với phân trang và tìm kiếm
        /// </summary>
        /// <param name="parameters">Tham số phân trang và tìm kiếm</param>
        /// <returns>Danh sách course media</returns>
        Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetAllCourseMediasAsync(QueryParameters? parameters = null);

        /// <summary>
        /// Lấy course media theo ID
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>Course media detail</returns>
        Task<BaseResponse<CourseMediaDto>> GetCourseMediaByIdAsync(Guid id);

        /// <summary>
        /// Tạo mới course media
        /// </summary>
        /// <param name="dto">Dữ liệu tạo mới</param>
        /// <returns>Course media đã tạo</returns>
        Task<BaseResponse<CourseMediaDto>> CreateCourseMediaAsync(CreateCourseMediaDto dto);

        /// <summary>
        /// Cập nhật course media
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <param name="dto">Dữ liệu cập nhật</param>
        /// <returns>Course media đã cập nhật</returns>
        Task<BaseResponse<CourseMediaDto>> UpdateCourseMediaAsync(Guid id, UpdateCourseMediaDto dto);

        /// <summary>
        /// Xóa course media (soft delete)
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>Kết quả xóa</returns>
        Task<BaseResponse<bool>> DeleteCourseMediaAsync(Guid id);

        /// <summary>
        /// Khôi phục course media đã bị xóa
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>Kết quả khôi phục</returns>
        Task<BaseResponse<bool>> RestoreCourseMediaAsync(Guid id);

        /// <summary>
        /// Lấy tất cả media của một khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media của khóa học</returns>
        Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetCourseMediasByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Lấy media theo loại
        /// </summary>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo loại</returns>
        Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetCourseMediasByMediaTypeAsync(MediaType mediaType);

        /// <summary>
        /// Lấy media theo trạng thái
        /// </summary>
        /// <param name="status">Trạng thái media</param>
        /// <returns>Danh sách media theo trạng thái</returns>
        Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetCourseMediasByStatusAsync(MediaStatus status);

        /// <summary>
        /// Lấy media chính của khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Media chính của khóa học</returns>
        Task<BaseResponse<CourseMediaDto>> GetPrimaryMediaByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Đặt media làm media chính của khóa học
        /// </summary>
        /// <param name="mediaId">ID của media</param>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Kết quả đặt media chính</returns>
        Task<BaseResponse<bool>> SetPrimaryMediaAsync(Guid mediaId, Guid courseId);

        /// <summary>
        /// Lấy media đang hoạt động của khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media đang hoạt động</returns>
        Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetActiveMediaByCourseIdAsync(Guid courseId);

        /// <summary>
        /// Lấy media của khóa học theo loại
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo khóa học và loại</returns>
        Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetMediaByCourseIdAndTypeAsync(Guid courseId, MediaType mediaType);

        /// <summary>
        /// Kiểm tra course media có tồn tại không
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>True nếu tồn tại, False nếu không</returns>
        Task<bool> CourseMediaExistsAsync(Guid id);
    }
}
