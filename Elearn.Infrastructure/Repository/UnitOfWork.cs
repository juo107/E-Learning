using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Implementations;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ElearnDbContext _context;
        private readonly ReadDbContext _readContext;
        public ICourseRepository Courses { get; }
        public ICategoryRepository Categories { get; }
        public ICourseMediaRepository CourseMedias { get; }
        public IPromotionRepository Promotions { get; }
        public IOrderRepository Orders { get; }
        public IPaymentRepository Payments { get; }
        public IUserCourseRepository UserCourses { get; }
        public ICartItemRepository CartItems { get; }
        public IBlacklistedTokenRepository BlacklistedTokens { get; }
        public IInstructorProfileRepository InstructorProfiles { get; }
        public ISectionRepository Sections { get; }
        public ILectureRepository Lectures { get; }
        public IResourceRepository Resources { get; }
        public ILectureContentRepository LectureContents { get; }

        public UnitOfWork(ElearnDbContext context, ReadDbContext readContext)
        {
            _context = context;
            _readContext = readContext;
            Courses = new CourseRepository(_context, _readContext);
            Categories = new CategoryRepository(_context);
            CourseMedias = new CourseMediaRepository(_context);
            Promotions = new PromotionRepository(_context);
            Orders = new OrderRepository(_context);
            Payments = new PaymentRepository(_context);
            UserCourses = new UserCourseRepository(_context);
            CartItems = new CartItemRepository(_context);
            BlacklistedTokens = new BlacklistedTokenRepository(_context);
            InstructorProfiles = new InstructorProfileRepository(_context);
            Sections = new SectionRepository(_context);
            Lectures = new LectureRepository(_context);
            Resources = new ResourceRepository(_context);
            LectureContents = new LectureContentRepository(_context);
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
