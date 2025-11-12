using Elearn.Domain.Entities.Identity;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface IInstructorProfileRepository : IGenericRepository<InstructorProfile>
    {
        /// <summary>
        /// Lấy instructor profile theo ApplicationUserId
        /// </summary>
        Task<InstructorProfile?> GetByUserIdAsync(string userId);
        
        /// <summary>
        /// Lấy instructor profile với ApplicationUser included
        /// </summary>
        Task<InstructorProfile?> GetByIdWithUserAsync(int id);
    }
}

