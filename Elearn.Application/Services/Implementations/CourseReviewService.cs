using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.CourseReview;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Repository.Interfaces;
using Elearn.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Application.Services.Implementations
{
    public class CourseReviewService : ICourseReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRedisCacheService _cache;

        public CourseReviewService(IUnitOfWork unitOfWork, IMapper mapper, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<CourseReviewDto>>> GetReviewsByCourseIdAsync(Guid courseId, QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                // Cache key for reviews list
                var cacheKey = $"reviews:course:{courseId}:page:{parameters.PageNumber}:size:{parameters.PageSize}";
                
                var cachedReviews = await _cache.GetAsync<IEnumerable<CourseReviewDto>>(cacheKey);
                if (cachedReviews != null)
                {
                    return BaseResponse<IEnumerable<CourseReviewDto>>.Ok(cachedReviews, "Reviews retrieved from cache");
                }

                var reviews = await _unitOfWork.CourseReviews.GetApprovedReviewsByCourseIdAsync(
                    courseId, 
                    parameters.PageNumber, 
                    parameters.PageSize);

                var reviewDtos = reviews.Select(r => new CourseReviewDto
                {
                    Id = r.Id,
                    CourseId = r.CourseId,
                    CourseTitle = r.Course?.Title ?? string.Empty,
                    UserId = r.UserId,
                    UserName = r.User?.FullName ?? r.User?.Email ?? "Unknown",
                    UserAvatarUrl = r.User?.AvatarUrl,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    IsApproved = r.IsApproved,
                    IsHidden = r.IsHidden,
                    HelpfulCount = r.HelpfulCount,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToList();

                // Cache for 10 minutes
                await _cache.SetAsync(cacheKey, reviewDtos, TimeSpan.FromMinutes(10));

                return BaseResponse<IEnumerable<CourseReviewDto>>.Ok(reviewDtos, "Reviews retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseReviewDto>>.Fail($"Error retrieving reviews: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseReviewDto>> GetReviewByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"review:{id}";
                var cachedReview = await _cache.GetAsync<CourseReviewDto>(cacheKey);
                if (cachedReview != null)
                {
                    return BaseResponse<CourseReviewDto>.Ok(cachedReview, "Review retrieved from cache");
                }

                var review = await _unitOfWork.CourseReviews.GetByIdWithIncludesAsync(id, r => r.Course!, r => r.User!);
                if (review == null)
                {
                    return BaseResponse<CourseReviewDto>.Fail("Review not found");
                }

                var reviewDto = new CourseReviewDto
                {
                    Id = review.Id,
                    CourseId = review.CourseId,
                    CourseTitle = review.Course?.Title ?? string.Empty,
                    UserId = review.UserId,
                    UserName = review.User?.FullName ?? review.User?.Email ?? "Unknown",
                    UserAvatarUrl = review.User?.AvatarUrl,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    IsApproved = review.IsApproved,
                    IsHidden = review.IsHidden,
                    HelpfulCount = review.HelpfulCount,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt
                };

                await _cache.SetAsync(cacheKey, reviewDto, TimeSpan.FromMinutes(10));

                return BaseResponse<CourseReviewDto>.Ok(reviewDto, "Review retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseReviewDto>.Fail($"Error retrieving review: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseReviewDto>> CreateReviewAsync(string userId, CreateCourseReviewDto dto)
        {
            try
            {
                // Validate rating
                if (dto.Rating < 1 || dto.Rating > 5)
                {
                    return BaseResponse<CourseReviewDto>.Fail("Rating must be between 1 and 5");
                }

                // Check if user already reviewed this course
                var existingReview = await _unitOfWork.CourseReviews.GetByUserAndCourseIdAsync(userId, dto.CourseId);
                if (existingReview != null)
                {
                    return BaseResponse<CourseReviewDto>.Fail("You have already reviewed this course");
                }

                // Check if course exists
                var course = await _unitOfWork.Courses.GetByIdAsync(dto.CourseId);
                if (course == null)
                {
                    return BaseResponse<CourseReviewDto>.Fail("Course not found");
                }

                var review = new CourseReview
                {
                    CourseId = dto.CourseId,
                    UserId = userId,
                    Rating = dto.Rating,
                    Comment = dto.Comment,
                    IsApproved = false, // Requires ContentAdmin approval
                    IsHidden = false,
                    CreatedBy = userId
                };

                await _unitOfWork.CourseReviews.AddAsync(review);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync($"reviews:course:{dto.CourseId}:*");
                await _cache.RemoveByPatternAsync($"review-summary:course:{dto.CourseId}");

                var reviewDto = new CourseReviewDto
                {
                    Id = review.Id,
                    CourseId = review.CourseId,
                    CourseTitle = course.Title,
                    UserId = review.UserId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    IsApproved = review.IsApproved,
                    IsHidden = review.IsHidden,
                    HelpfulCount = review.HelpfulCount,
                    CreatedAt = review.CreatedAt
                };

                return BaseResponse<CourseReviewDto>.Ok(reviewDto, "Review created successfully. Waiting for approval.");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseReviewDto>.Fail($"Error creating review: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseReviewDto>> UpdateReviewAsync(string userId, Guid reviewId, UpdateCourseReviewDto dto)
        {
            try
            {
                // Validate rating
                if (dto.Rating < 1 || dto.Rating > 5)
                {
                    return BaseResponse<CourseReviewDto>.Fail("Rating must be between 1 and 5");
                }

                var review = await _unitOfWork.CourseReviews.GetByIdWithIncludesAsync(reviewId, r => r.Course!, r => r.User!);
                if (review == null)
                {
                    return BaseResponse<CourseReviewDto>.Fail("Review not found");
                }

                // Check if user owns this review
                if (review.UserId != userId)
                {
                    return BaseResponse<CourseReviewDto>.Fail("You can only update your own reviews");
                }

                review.Rating = dto.Rating;
                review.Comment = dto.Comment;
                review.UpdatedAt = DateTime.UtcNow;
                review.UpdatedBy = userId;
                review.IsApproved = false; // Reset approval status after update

                _unitOfWork.CourseReviews.Update(review);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync($"reviews:course:{review.CourseId}:*");
                await _cache.RemoveByPatternAsync($"review-summary:course:{review.CourseId}");
                await _cache.RemoveByPatternAsync($"review:{reviewId}");

                var reviewDto = new CourseReviewDto
                {
                    Id = review.Id,
                    CourseId = review.CourseId,
                    CourseTitle = review.Course?.Title ?? string.Empty,
                    UserId = review.UserId,
                    UserName = review.User?.FullName ?? review.User?.Email ?? "Unknown",
                    UserAvatarUrl = review.User?.AvatarUrl,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    IsApproved = review.IsApproved,
                    IsHidden = review.IsHidden,
                    HelpfulCount = review.HelpfulCount,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt
                };

                return BaseResponse<CourseReviewDto>.Ok(reviewDto, "Review updated successfully. Waiting for approval.");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseReviewDto>.Fail($"Error updating review: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteReviewAsync(string userId, Guid reviewId)
        {
            try
            {
                var review = await _unitOfWork.CourseReviews.GetByIdAsync(reviewId);
                if (review == null)
                {
                    return BaseResponse<bool>.Fail("Review not found");
                }

                // Check if user owns this review
                if (review.UserId != userId)
                {
                    return BaseResponse<bool>.Fail("You can only delete your own reviews");
                }

                _unitOfWork.CourseReviews.Delete(review);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync($"reviews:course:{review.CourseId}:*");
                await _cache.RemoveByPatternAsync($"review-summary:course:{review.CourseId}");
                await _cache.RemoveByPatternAsync($"review:{reviewId}");

                return BaseResponse<bool>.Ok(true, "Review deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting review: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseReviewSummaryDto>> GetReviewSummaryAsync(Guid courseId)
        {
            try
            {
                var cacheKey = $"review-summary:course:{courseId}";
                var cachedSummary = await _cache.GetAsync<CourseReviewSummaryDto>(cacheKey);
                if (cachedSummary != null)
                {
                    return BaseResponse<CourseReviewSummaryDto>.Ok(cachedSummary, "Review summary retrieved from cache");
                }

                var summary = await _unitOfWork.CourseReviews.GetReviewSummaryAsync(courseId);

                var summaryDto = new CourseReviewSummaryDto
                {
                    CourseId = courseId,
                    AverageRating = summary.AverageRating,
                    TotalReviews = summary.TotalReviews,
                    Rating5Count = summary.Rating5Count,
                    Rating4Count = summary.Rating4Count,
                    Rating3Count = summary.Rating3Count,
                    Rating2Count = summary.Rating2Count,
                    Rating1Count = summary.Rating1Count
                };

                // Cache for 15 minutes
                await _cache.SetAsync(cacheKey, summaryDto, TimeSpan.FromMinutes(15));

                return BaseResponse<CourseReviewSummaryDto>.Ok(summaryDto, "Review summary retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseReviewSummaryDto>.Fail($"Error retrieving review summary: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> ApproveReviewAsync(Guid reviewId)
        {
            try
            {
                var review = await _unitOfWork.CourseReviews.GetByIdAsync(reviewId);
                if (review == null)
                {
                    return BaseResponse<bool>.Fail("Review not found");
                }

                review.IsApproved = true;
                review.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync($"reviews:course:{review.CourseId}:*");
                await _cache.RemoveByPatternAsync($"review-summary:course:{review.CourseId}");
                await _cache.RemoveByPatternAsync($"review:{reviewId}");

                return BaseResponse<bool>.Ok(true, "Review approved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error approving review: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> HideReviewAsync(Guid reviewId)
        {
            try
            {
                var review = await _unitOfWork.CourseReviews.GetByIdAsync(reviewId);
                if (review == null)
                {
                    return BaseResponse<bool>.Fail("Review not found");
                }

                review.IsHidden = true;
                review.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync($"reviews:course:{review.CourseId}:*");
                await _cache.RemoveByPatternAsync($"review-summary:course:{review.CourseId}");
                await _cache.RemoveByPatternAsync($"review:{reviewId}");

                return BaseResponse<bool>.Ok(true, "Review hidden successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error hiding review: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteReviewByModeratorAsync(Guid reviewId)
        {
            try
            {
                var review = await _unitOfWork.CourseReviews.GetByIdAsync(reviewId);
                if (review == null)
                {
                    return BaseResponse<bool>.Fail("Review not found");
                }

                var courseId = review.CourseId;
                var reviewToDelete = await _unitOfWork.CourseReviews.GetByIdAsync(reviewId);
                if (reviewToDelete != null)
                {
                    _unitOfWork.CourseReviews.Delete(reviewToDelete);
                    await _unitOfWork.CompleteAsync();
                }

                // Invalidate cache
                await _cache.RemoveByPatternAsync($"reviews:course:{courseId}:*");
                await _cache.RemoveByPatternAsync($"review-summary:course:{courseId}");
                await _cache.RemoveByPatternAsync($"review:{reviewId}");

                return BaseResponse<bool>.Ok(true, "Review deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting review: {ex.Message}");
            }
        }
    }
}

