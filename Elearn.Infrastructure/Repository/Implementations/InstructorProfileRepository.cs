using Elearn.Domain.Entities.Identity;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class InstructorProfileRepository : GenericRepository<InstructorProfile>, IInstructorProfileRepository
    {
        private readonly ElearnDbContext _context;

        public InstructorProfileRepository(ElearnDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<InstructorProfile?> GetByUserIdAsync(string userId)
        {
            return await _context.InstructorProfiles
                .Include(ip => ip.ApplicationUser)
                .FirstOrDefaultAsync(ip => ip.ApplicationUserId == userId);
        }

        public async Task<InstructorProfile?> GetByIdWithUserAsync(int id)
        {
            return await _context.InstructorProfiles
                .Include(ip => ip.ApplicationUser)
                .FirstOrDefaultAsync(ip => ip.Id == id);
        }
        
        /// <summary>
        /// Override GetByIdAsync để hỗ trợ int Id
        /// </summary>
        public new async Task<InstructorProfile?> GetByIdAsync(int id)
        {
            return await _context.InstructorProfiles
                .Include(ip => ip.ApplicationUser)
                .FirstOrDefaultAsync(ip => ip.Id == id);
        }
    }
}

