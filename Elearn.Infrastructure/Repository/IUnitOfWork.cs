using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Course> Courses { get; }
        Task<int> CompleteAsync();
    }
}
