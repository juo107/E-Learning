using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;

namespace Elearn.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ElearnDbContext _context;
        public IGenericRepository<Course> Courses { get; }

        public UnitOfWork(ElearnDbContext context)
        {
            _context = context;
            Courses = new GenericRepository<Course>(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
