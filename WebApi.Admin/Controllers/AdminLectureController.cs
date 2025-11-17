using Elearn.Application.Common;
using Elearn.Application.DTOs.Lecture;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class AdminLectureController : BaseAdminController<AdminLectureController>
    {
        private readonly ILectureService _lectureService;

        public AdminLectureController(ILectureService lectureService, ILogger<AdminLectureController> logger)
            : base(logger)
        {
            _lectureService = lectureService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<LectureDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortBy = "orderIndex",
            [FromQuery] bool isDescending = false)
        {
            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Keyword = keyword,
                SortBy = sortBy,
                IsDescending = isDescending
            };

            var result = await _lectureService.GetAllLecturesAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<LectureDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<LectureDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _lectureService.GetLectureByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetBySectionId
        [HttpGet("section/{sectionId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<LectureDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetBySectionId(Guid sectionId)
        {
            var result = await _lectureService.GetLecturesBySectionIdAsync(sectionId);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<LectureDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<LectureDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreateLectureDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<LectureDto>.Fail(GetModelErrors()));
            }

            var result = await _lectureService.CreateLectureAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseResponse<LectureDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<LectureDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<LectureDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLectureDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<LectureDto>.Fail(GetModelErrors()));
            }

            var result = await _lectureService.UpdateLectureAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _lectureService.DeleteLectureAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Restore
        [HttpPost("{id}/restore")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Restore(Guid id)
        {
            var result = await _lectureService.RestoreLectureAsync(id);
            return HandleResponse(result);
        }
        #endregion
    }
}

