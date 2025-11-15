using Elearn.Application.Common;
using Elearn.Application.DTOs.Section;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class AdminSectionController : BaseAdminController<AdminSectionController>
    {
        private readonly ISectionService _sectionService;

        public AdminSectionController(ISectionService sectionService, ILogger<AdminSectionController> logger)
            : base(logger)
        {
            _sectionService = sectionService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<SectionDto>>), StatusCodes.Status200OK)]
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

            var result = await _sectionService.GetAllSectionsAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<SectionDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<SectionDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _sectionService.GetSectionByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetByCourseId
        [HttpGet("course/{courseId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<SectionDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetByCourseId(Guid courseId)
        {
            var result = await _sectionService.GetSectionsByCourseIdAsync(courseId);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<SectionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<SectionDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreateSectionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<SectionDto>.Fail(GetModelErrors()));
            }

            var result = await _sectionService.CreateSectionAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseResponse<SectionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<SectionDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<SectionDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSectionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<SectionDto>.Fail(GetModelErrors()));
            }

            var result = await _sectionService.UpdateSectionAsync(id, dto);
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
            var result = await _sectionService.DeleteSectionAsync(id);
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
            var result = await _sectionService.RestoreSectionAsync(id);
            return HandleResponse(result);
        }
        #endregion
    }
}

