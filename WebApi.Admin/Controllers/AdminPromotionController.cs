using Elearn.Application.Common;
using Elearn.Application.DTOs.Promotion;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class AdminPromotionController : BaseAdminController<AdminPromotionController>
    {
        private readonly IPromotionService _promotionService;

        public AdminPromotionController(IPromotionService promotionService, ILogger<AdminPromotionController> logger)
            : base(logger)
        {
            _promotionService = promotionService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<PromotionDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] bool isDescending = true,
            [FromQuery] bool includeDeleted = false)
        {
            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Keyword = keyword,
                SortBy = sortBy,
                IsDescending = isDescending,
                IncludeDeleted = includeDeleted
            };

            var result = await _promotionService.GetAllPromotionsAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _promotionService.GetPromotionByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreatePromotionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<PromotionDto>.Fail(GetModelErrors()));
            }

            var result = await _promotionService.CreatePromotionAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<PromotionDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePromotionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<PromotionDto>.Fail(GetModelErrors()));
            }

            var result = await _promotionService.UpdatePromotionAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _promotionService.DeletePromotionAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Restore
        [HttpPost("{id:guid}/restore")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Restore(Guid id)
        {
            var result = await _promotionService.RestorePromotionAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Activate
        [HttpPost("{id:guid}/activate")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Activate(Guid id)
        {
            var result = await _promotionService.ActivatePromotionAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Deactivate
        [HttpPost("{id:guid}/deactivate")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Deactivate(Guid id)
        {
            var result = await _promotionService.DeactivatePromotionAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetActive
        [HttpGet("active")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<PromotionDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetActive()
        {
            var result = await _promotionService.GetActivePromotionsAsync();
            return HandleResponse(result);
        }
        #endregion

        #region GetByCategory
        [HttpGet("category/{categoryId:guid}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<PromotionDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetByCategory(Guid categoryId)
        {
            var result = await _promotionService.GetPromotionsByCategoryAsync(categoryId);
            return HandleResponse(result);
        }
        #endregion
    }
}

