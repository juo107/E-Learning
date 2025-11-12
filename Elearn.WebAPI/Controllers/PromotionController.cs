using Elearn.Application.Common;
using Elearn.Application.DTOs.Promotion;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    public class PromotionController : BaseApiController<PromotionController>
    {
        private readonly IPromotionService _promotionService;

        public PromotionController(IPromotionService promotionService, ILogger<PromotionController> logger)
            : base(logger)
        {
            _promotionService = promotionService;
        }

        /// <summary>
        /// Lấy danh sách active promotions cho client
        /// </summary>
        [HttpGet("active")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<PromotionDto>>), StatusCodes.Status200OK)]
        [ResponseCache(Duration = 30, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetActivePromotions()
        {
            // Cache 30 giây - client có thể cache response
            Response.Headers.Append("Cache-Control", "public, max-age=30");
            
            var result = await _promotionService.GetActivePromotionsAsync();
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy promotion theo category ID
        /// </summary>
        [HttpGet("category/{categoryId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<PromotionDto>>), StatusCodes.Status200OK)]
        [ResponseCache(Duration = 30, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetPromotionsByCategory(Guid categoryId)
        {
            // Cache 30 giây - client có thể cache response
            Response.Headers.Append("Cache-Control", "public, max-age=30");
            
            var result = await _promotionService.GetPromotionsByCategoryAsync(categoryId);
            return HandleResponse(result);
        }
    }
}

