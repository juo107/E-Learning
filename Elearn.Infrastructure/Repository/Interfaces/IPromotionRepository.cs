using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IPromotionRepository : IGenericRepository<Promotion>
    {
        Task<IEnumerable<Promotion>> GetActivePromotionsAsync();
        Task<IEnumerable<Promotion>> GetPromotionsByCategoryAsync(Guid categoryId);
    }
}

