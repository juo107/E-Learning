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
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> GetActivePromotions()
        {
            // Thêm cache-control headers để client không cache response
            Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
            Response.Headers.Append("Pragma", "no-cache");
            Response.Headers.Append("Expires", "0");
            
            var result = await _promotionService.GetActivePromotionsAsync();
            return HandleResponse(result);
        }

        /// <summary>
        /// Lấy promotion theo category ID
        /// </summary>
        [HttpGet("category/{categoryId}")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<PromotionDto>>), StatusCodes.Status200OK)]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> GetPromotionsByCategory(Guid categoryId)
        {
            // Thêm cache-control headers để client không cache response
            Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
            Response.Headers.Append("Pragma", "no-cache");
            Response.Headers.Append("Expires", "0");
            
            var result = await _promotionService.GetPromotionsByCategoryAsync(categoryId);
            return HandleResponse(result);
        }
    }
}

