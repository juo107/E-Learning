using Elearn.Domain.Entities;
using Elearn.Infrastructure.Data;
using Elearn.Infrastructure.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Infrastructure.Repository.Implementations
{
    public class CourseReviewRepository : GenericRepository<CourseReview>, ICourseReviewRepository
    {
        public CourseReviewRepository(ElearnDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CourseReview>> GetByCourseIdAsync(Guid courseId, bool includeHidden = false)
        {
            // Tái sử dụng FindAsync với predicate
            var predicate = includeHidden
                ? (System.Linq.Expressions.Expression<Func<CourseReview, bool>>)(r => r.CourseId == courseId)
                : (System.Linq.Expressions.Expression<Func<CourseReview, bool>>)(r => r.CourseId == courseId && !r.IsHidden && r.IsApproved);

            var reviews = await FindAsync(predicate);
            return reviews.OrderByDescending(r => r.CreatedAt);
        }

        public async Task<CourseReview?> GetByUserAndCourseIdAsync(string userId, Guid courseId)
        {
            // Include navigation properties
            return await _dbSet
                .Include(r => r.Course)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.CourseId == courseId && !r.IsDeleted);
        }

        public async Task<ReviewSummary> GetReviewSummaryAsync(Guid courseId)
        {
            // Tái sử dụng FindAsync cho approved reviews
            var reviews = (await FindAsync(r => r.CourseId == courseId && r.IsApproved && !r.IsHidden)).ToList();

            if (!reviews.Any())
            {
                return new ReviewSummary();
            }

            return new ReviewSummary
            {
                TotalReviews = reviews.Count,
                AverageRating = reviews.Average(r => r.Rating),
                Rating5Count = reviews.Count(r => r.Rating == 5),
                Rating4Count = reviews.Count(r => r.Rating == 4),
                Rating3Count = reviews.Count(r => r.Rating == 3),
                Rating2Count = reviews.Count(r => r.Rating == 2),
                Rating1Count = reviews.Count(r => r.Rating == 1)
            };
        }

        public async Task<IEnumerable<CourseReview>> GetApprovedReviewsByCourseIdAsync(Guid courseId, int pageNumber, int pageSize)
        {
            // Pagination cần execute ở database level, không thể tái sử dụng FindAsync
            // vì FindAsync đã execute và load vào memory
            // Include navigation properties để tránh N+1 query
            var query = _dbSet
                .Include(r => r.Course)
                .Include(r => r.User)
                .Where(r => r.CourseId == courseId && !r.IsDeleted && r.IsApproved && !r.IsHidden)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            return await query.ToListAsync();
        }

        public async Task<int> GetApprovedReviewCountAsync(Guid courseId)
        {
            // Count ở database level để tối ưu performance
            return await _dbSet
                .CountAsync(r => r.CourseId == courseId && !r.IsDeleted && r.IsApproved && !r.IsHidden);
        }
    }
}

