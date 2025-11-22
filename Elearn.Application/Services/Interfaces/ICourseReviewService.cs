using Elearn.Application.Common;
using Elearn.Application.DTOs.CourseReview;

namespace Elearn.Application.Services.Interfaces
{
    public interface ICourseReviewService
    {
        Task<BaseResponse<IEnumerable<CourseReviewDto>>> GetReviewsByCourseIdAsync(Guid courseId, QueryParameters? parameters = null);
        Task<BaseResponse<CourseReviewDto>> GetReviewByIdAsync(Guid id);
        Task<BaseResponse<CourseReviewDto>> CreateReviewAsync(string userId, CreateCourseReviewDto dto);
        Task<BaseResponse<CourseReviewDto>> UpdateReviewAsync(string userId, Guid reviewId, UpdateCourseReviewDto dto);
        Task<BaseResponse<bool>> DeleteReviewAsync(string userId, Guid reviewId);
        Task<BaseResponse<CourseReviewSummaryDto>> GetReviewSummaryAsync(Guid courseId);
        Task<BaseResponse<bool>> ApproveReviewAsync(Guid reviewId);
        Task<BaseResponse<bool>> HideReviewAsync(Guid reviewId);
        Task<BaseResponse<bool>> DeleteReviewByModeratorAsync(Guid reviewId);
    }
}

