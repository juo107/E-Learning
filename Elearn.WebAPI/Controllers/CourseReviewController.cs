using Elearn.Application.Common;
using Elearn.Application.DTOs.CourseReview;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Elearn.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseReviewController : BaseApiController<CourseReviewController>
    {
        private readonly ICourseReviewService _courseReviewService;

        public CourseReviewController(ICourseReviewService courseReviewService, ILogger<CourseReviewController> logger)
            : base(logger)
        {
            _courseReviewService = courseReviewService;
        }

        #region GetReviewsByCourseId
        [HttpGet("course/{courseId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseReviewDto>>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 300, // 5 phút
            Location = ResponseCacheLocation.Any,
            VaryByQueryKeys = new[] { "courseId", "pageNumber", "pageSize" }
        )]
        public async Task<IActionResult> GetReviewsByCourseId(
            Guid courseId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _courseReviewService.GetReviewsByCourseIdAsync(courseId, query);
            return HandleResponse(result);
        }
        #endregion

        #region GetReviewSummary
        [HttpGet("course/{courseId}/summary")]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewSummaryDto>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 600, // 10 phút - summary ít thay đổi hơn
            Location = ResponseCacheLocation.Any
        )]
        public async Task<IActionResult> GetReviewSummary(Guid courseId)
        {
            var result = await _courseReviewService.GetReviewSummaryAsync(courseId);
            return HandleResponse(result);
        }
        #endregion

        #region GetReviewById
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status404NotFound)]
        [ResponseCache(
            Duration = 300, // 5 phút
            Location = ResponseCacheLocation.Any
        )]
        public async Task<IActionResult> GetReviewById(Guid id)
        {
            var result = await _courseReviewService.GetReviewByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region CreateReview (Student only)
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateReview([FromBody] CreateCourseReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<CourseReviewDto>.Fail("User not authenticated"));
            }

            // Check if user is Student
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            if (userRole != "Student" && userRole != "SystemSuperAdmin")
            {
                return Forbid("Only students can create reviews");
            }

            var result = await _courseReviewService.CreateReviewAsync(userId, dto);
            return HandleResponse(result);
        }
        #endregion

        #region UpdateReview (Student - own review only)
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<CourseReviewDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateCourseReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<CourseReviewDto>.Fail("User not authenticated"));
            }

            // Check if user is Student or SystemSuperAdmin
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            if (userRole != "Student" && userRole != "SystemSuperAdmin")
            {
                return Forbid("Only students can update their own reviews");
            }

            var result = await _courseReviewService.UpdateReviewAsync(userId, id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region DeleteReview (Student - own review only)
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(BaseResponse<bool>.Fail("User not authenticated"));
            }

            // Check if user is Student or SystemSuperAdmin
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            if (userRole != "Student" && userRole != "SystemSuperAdmin")
            {
                return Forbid("Only students can delete their own reviews");
            }

            var result = await _courseReviewService.DeleteReviewAsync(userId, id);
            return HandleResponse(result);
        }
        #endregion

        #region ApproveReview (ContentAdmin only)
        [HttpPost("{id}/approve")]
        [Authorize(Policy = "ContentAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ApproveReview(Guid id)
        {
            var result = await _courseReviewService.ApproveReviewAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region HideReview (ContentAdmin only)
        [HttpPost("{id}/hide")]
        [Authorize(Policy = "ContentAdminOnly")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> HideReview(Guid id)
        {
            var result = await _courseReviewService.HideReviewAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region DeleteReviewByModerator (Moderator only)
        [HttpDelete("{id}/moderator")]
        [Authorize(Roles = "Moderator,SystemSuperAdmin")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteReviewByModerator(Guid id)
        {
            var result = await _courseReviewService.DeleteReviewByModeratorAsync(id);
            return HandleResponse(result);
        }
        #endregion
    }
}

