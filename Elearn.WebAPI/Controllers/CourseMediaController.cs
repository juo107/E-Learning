using Microsoft.AspNetCore.Mvc;
using Elearn.Application.Common;
using Elearn.Application.DTOs.CourseMedia;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities.Enums;

namespace Elearn.WebAPI.Controllers
{
    /// <summary>
    /// Controller for CourseMedia API endpoints
    /// </summary>
    public class CourseMediaController : BaseApiController<CourseMediaController>
    {
        private readonly ICourseMediaService _courseMediaService;

        /// <summary>
        /// Constructor for CourseMediaController
        /// </summary>
        /// <param name="courseMediaService">CourseMedia service for business operations</param>
        /// <param name="logger">Logger for logging operations</param>
        public CourseMediaController(ICourseMediaService courseMediaService, ILogger<CourseMediaController> logger) 
            : base(logger)
        {
            _courseMediaService = courseMediaService;
        }

        #region GetAll
        /// <summary>
        /// Lấy tất cả course media với phân trang và tìm kiếm
        /// </summary>
        /// <param name="parameters">Tham số phân trang và tìm kiếm</param>
        /// <returns>Danh sách course media</returns>
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseMediaDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] QueryParameters? parameters = null)
        {
            var result = await _courseMediaService.GetAllCourseMediasAsync(parameters);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        /// <summary>
        /// Lấy course media theo ID
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>Course media detail</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<CourseMediaDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _courseMediaService.GetCourseMediaByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        /// <summary>
        /// Tạo mới course media
        /// </summary>
        /// <param name="dto">Dữ liệu tạo mới</param>
        /// <returns>Course media đã tạo</returns>
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<CourseMediaDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateCourseMediaDto dto)
        {
            var result = await _courseMediaService.CreateCourseMediaAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        /// <summary>
        /// Cập nhật course media
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <param name="dto">Dữ liệu cập nhật</param>
        /// <returns>Course media đã cập nhật</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseResponse<CourseMediaDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCourseMediaDto dto)
        {
            var result = await _courseMediaService.UpdateCourseMediaAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        /// <summary>
        /// Xóa course media (soft delete)
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>Kết quả xóa</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _courseMediaService.DeleteCourseMediaAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Restore
        /// <summary>
        /// Khôi phục course media đã bị xóa
        /// </summary>
        /// <param name="id">ID của course media</param>
        /// <returns>Kết quả khôi phục</returns>
        [HttpPost("{id}/restore")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Restore(Guid id)
        {
            var result = await _courseMediaService.RestoreCourseMediaAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetByCourseId
        /// <summary>
        /// Lấy tất cả media của một khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media của khóa học</returns>
        [HttpGet("course/{courseId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseMediaDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByCourseId(Guid courseId)
        {
            var result = await _courseMediaService.GetCourseMediasByCourseIdAsync(courseId);
            return HandleResponse(result);
        }
        #endregion

        #region GetByMediaType
        /// <summary>
        /// Lấy media theo loại
        /// </summary>
        /// <param name="mediaType">Loại media (Image, Video, Promo, Document)</param>
        /// <returns>Danh sách media theo loại</returns>
        [HttpGet("type/{mediaType}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseMediaDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByMediaType(MediaType mediaType)
        {
            var result = await _courseMediaService.GetCourseMediasByMediaTypeAsync(mediaType);
            return HandleResponse(result);
        }
        #endregion

        #region GetByStatus
        /// <summary>
        /// Lấy media theo trạng thái
        /// </summary>
        /// <param name="status">Trạng thái media (Active, Deleted, Pending, Archived)</param>
        /// <returns>Danh sách media theo trạng thái</returns>
        [HttpGet("status/{status}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseMediaDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByStatus(MediaStatus status)
        {
            var result = await _courseMediaService.GetCourseMediasByStatusAsync(status);
            return HandleResponse(result);
        }
        #endregion

        #region GetPrimaryMedia
        /// <summary>
        /// Lấy media chính của khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Media chính của khóa học</returns>
        [HttpGet("course/{courseId}/primary")]
        [ProducesResponseType(typeof(BaseResponse<CourseMediaDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPrimaryMedia(Guid courseId)
        {
            var result = await _courseMediaService.GetPrimaryMediaByCourseIdAsync(courseId);
            return HandleResponse(result);
        }
        #endregion

        #region SetPrimaryMedia
        /// <summary>
        /// Đặt media làm media chính của khóa học
        /// </summary>
        /// <param name="mediaId">ID của media</param>
        /// <param name="request">Request body chứa CourseId</param>
        /// <returns>Kết quả đặt media chính</returns>
        [HttpPost("{mediaId}/set-primary")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SetPrimaryMedia(Guid mediaId, [FromBody] SetPrimaryMediaRequest request)
        {
            var result = await _courseMediaService.SetPrimaryMediaAsync(mediaId, request.CourseId);
            return HandleResponse(result);
        }
        #endregion

        #region GetActiveMedia
        /// <summary>
        /// Lấy media đang hoạt động của khóa học
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <returns>Danh sách media đang hoạt động</returns>
        [HttpGet("course/{courseId}/active")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseMediaDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetActiveMedia(Guid courseId)
        {
            var result = await _courseMediaService.GetActiveMediaByCourseIdAsync(courseId);
            return HandleResponse(result);
        }
        #endregion

        #region GetMediaByCourseAndType
        /// <summary>
        /// Lấy media của khóa học theo loại
        /// </summary>
        /// <param name="courseId">ID của khóa học</param>
        /// <param name="mediaType">Loại media</param>
        /// <returns>Danh sách media theo khóa học và loại</returns>
        [HttpGet("course/{courseId}/type/{mediaType}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseMediaDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMediaByCourseAndType(Guid courseId, MediaType mediaType)
        {
            var result = await _courseMediaService.GetMediaByCourseIdAndTypeAsync(courseId, mediaType);
            return HandleResponse(result);
        }
        #endregion
    }

    /// <summary>
    /// Request model for setting primary media
    /// </summary>
    public class SetPrimaryMediaRequest
    {
        /// <summary>
        /// ID của khóa học
        /// </summary>
        public Guid CourseId { get; set; }
    }
}
