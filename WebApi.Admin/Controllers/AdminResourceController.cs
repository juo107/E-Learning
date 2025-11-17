using Elearn.Application.Common;
using Elearn.Application.DTOs.Resource;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class AdminResourceController : BaseAdminController<AdminResourceController>
    {
        private readonly IResourceService _resourceService;

        public AdminResourceController(IResourceService resourceService, ILogger<AdminResourceController> logger)
            : base(logger)
        {
            _resourceService = resourceService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<ResourceDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] bool isDescending = true)
        {
            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Keyword = keyword,
                SortBy = sortBy,
                IsDescending = isDescending
            };

            var result = await _resourceService.GetAllResourcesAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BaseResponse<ResourceDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<ResourceDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _resourceService.GetResourceByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetByLectureId
        [HttpGet("lecture/{lectureId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<ResourceDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetByLectureId(Guid lectureId)
        {
            var result = await _resourceService.GetResourcesByLectureIdAsync(lectureId);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<ResourceDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<ResourceDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreateResourceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<ResourceDto>.Fail(GetModelErrors()));
            }

            var result = await _resourceService.CreateResourceAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BaseResponse<ResourceDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<ResourceDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<ResourceDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateResourceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<ResourceDto>.Fail(GetModelErrors()));
            }

            var result = await _resourceService.UpdateResourceAsync(id, dto);
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
            var result = await _resourceService.DeleteResourceAsync(id);
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
            var result = await _resourceService.RestoreResourceAsync(id);
            return HandleResponse(result);
        }
        #endregion
    }
}

