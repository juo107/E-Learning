using Elearn.Domain.Entities;

namespace Elearn.Infrastructure.Repository.Interfaces
{
    public interface ICourseReviewRepository : IGenericRepository<CourseReview>
    {
        Task<IEnumerable<CourseReview>> GetByCourseIdAsync(Guid courseId, bool includeHidden = false);
        Task<CourseReview?> GetByUserAndCourseIdAsync(string userId, Guid courseId);
        Task<ReviewSummary> GetReviewSummaryAsync(Guid courseId);
        Task<IEnumerable<CourseReview>> GetApprovedReviewsByCourseIdAsync(Guid courseId, int pageNumber, int pageSize);
        Task<int> GetApprovedReviewCountAsync(Guid courseId);
    }

    public class ReviewSummary
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public int Rating5Count { get; set; }
        public int Rating4Count { get; set; }
        public int Rating3Count { get; set; }
        public int Rating2Count { get; set; }
        public int Rating1Count { get; set; }
    }
}

