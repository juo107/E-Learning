using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Implementations;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository
{
    public class ReadUnitOfWork : IReadUnitOfWork
    {
        private readonly ReadDbContext _readContext;
        private readonly ElearnDbContext _writeContext;
        public ICourseRepository Courses { get; }
        public ICategoryRepository Categories { get; }
        public ICourseMediaRepository CourseMedias { get; }
        public IPromotionRepository Promotions { get; }
        public IUserCourseRepository UserCourses { get; }

        public ReadUnitOfWork(ReadDbContext readContext, ElearnDbContext writeContext)
        {
            _readContext = readContext;
            _writeContext = writeContext;
            
            // CourseRepository cần cả write và read context
            // Tham số đầu tiên là ElearnDbContext (write), tham số thứ hai là ReadDbContext (read)
            // Vì đây là read-only unit of work, truyền _writeContext cho write và _readContext cho read
            // (các read operations đều dùng _read context)
            Courses = new CourseRepository(_writeContext, _readContext);
            
            // Các repository khác cần ElearnDbContext
            // Vì đây là read-only, có thể dùng writeContext (nhưng chỉ cho read operations)
            Categories = new CategoryRepository(_writeContext);
            CourseMedias = new CourseMediaRepository(_writeContext);
            Promotions = new PromotionRepository(_writeContext);
            UserCourses = new UserCourseRepository(_writeContext);
        }

        public void Dispose()
        {
            _readContext?.Dispose();
            // Không dispose _writeContext vì nó được quản lý bởi UnitOfWork chính
        }
    }
}
