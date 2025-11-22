using Elearn.Application.DTOs.CourseReview;
using FluentValidation;

namespace Elearn.Application.Validations
{
    public class UpdateCourseReviewValidator : AbstractValidator<UpdateCourseReviewDto>
    {
        public UpdateCourseReviewValidator()
        {
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");

            RuleFor(x => x.Comment)
                .MaximumLength(2000).WithMessage("Comment cannot exceed 2000 characters.")
                .When(x => !string.IsNullOrEmpty(x.Comment));
        }
    }
}

