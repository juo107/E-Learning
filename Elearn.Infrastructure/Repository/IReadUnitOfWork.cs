using Elearn.Infrastructure.Repository.Interfaces;

namespace Elearn.Infrastructure.Repository
{
    public interface IReadUnitOfWork : IDisposable
    {
        ICourseRepository Courses { get; }
        ICategoryRepository Categories { get; }
        ICourseMediaRepository CourseMedias { get; }
        IPromotionRepository Promotions { get; }
        IUserCourseRepository UserCourses { get; }
    }
}
