using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        ICourseRepository Courses { get; }
        ICategoryRepository Categories { get; }
        ICourseMediaRepository CourseMedias { get; }
        IPromotionRepository Promotions { get; }
        IOrderRepository Orders { get; }
        IPaymentRepository Payments { get; }
        IUserCourseRepository UserCourses { get; }
        ICartItemRepository CartItems { get; }
        IBlacklistedTokenRepository BlacklistedTokens { get; }
        IInstructorProfileRepository InstructorProfiles { get; }
        ISectionRepository Sections { get; }
        ILectureRepository Lectures { get; }
        IResourceRepository Resources { get; }
        ILectureContentRepository LectureContents { get; }
        ICourseReviewRepository CourseReviews { get; }
        Task<int> CompleteAsync();
    }
}
