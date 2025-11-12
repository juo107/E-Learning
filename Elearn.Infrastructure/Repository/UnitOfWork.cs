using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Implementations;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ElearnDbContext _context;
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

        public UnitOfWork(ElearnDbContext context)
        {
            _context = context;
            Courses = new CourseRepository(_context);
            Categories = new CategoryRepository(_context);
            CourseMedias = new CourseMediaRepository(_context);
            Promotions = new PromotionRepository(_context);
            Orders = new OrderRepository(_context);
            Payments = new PaymentRepository(_context);
            UserCourses = new UserCourseRepository(_context);
            CartItems = new CartItemRepository(_context);
            BlacklistedTokens = new BlacklistedTokenRepository(_context);
            InstructorProfiles = new InstructorProfileRepository(_context);
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
