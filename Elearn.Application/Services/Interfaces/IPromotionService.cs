using Elearn.Application.Common;
using Elearn.Application.DTOs.Promotion;

namespace Elearn.Application.Services.Interfaces
{
    public interface IPromotionService
    {
        Task<BaseResponse<IEnumerable<PromotionDto>>> GetAllPromotionsAsync(QueryParameters? parameters = null);
        Task<BaseResponse<PromotionDto>> GetPromotionByIdAsync(Guid id);
        Task<BaseResponse<PromotionDto>> CreatePromotionAsync(CreatePromotionDto dto);
        Task<BaseResponse<PromotionDto>> UpdatePromotionAsync(Guid id, UpdatePromotionDto dto);
        Task<BaseResponse<bool>> DeletePromotionAsync(Guid id);
        Task<BaseResponse<bool>> RestorePromotionAsync(Guid id);
        Task<BaseResponse<bool>> ActivatePromotionAsync(Guid id);
        Task<BaseResponse<bool>> DeactivatePromotionAsync(Guid id);
        Task<BaseResponse<IEnumerable<PromotionDto>>> GetActivePromotionsAsync();
        Task<BaseResponse<IEnumerable<PromotionDto>>> GetPromotionsByCategoryAsync(Guid categoryId);
        Task<bool> PromotionExistsAsync(Guid id);
    }
}

