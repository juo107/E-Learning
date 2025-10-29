using Elearn.Application.DTOs.Course;
using Elearn.Domain.Entities.Enums;
using FluentValidation;

namespace Elearn.Application.Validations
{
    public class UpdateCourseValidator : AbstractValidator<UpdateCourseDto>
    {
        public UpdateCourseValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Course title is required.")
                .Length(3, 200).WithMessage("Title must be between 3 and 200 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Course description is required.")
                .Length(10, 2000).WithMessage("Description must be between 10 and 2000 characters.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Price must be greater than or equal to 0.");

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("Category is required.")
                .When(x => x.CategoryId.HasValue);

            RuleFor(x => x.Level)
                .IsInEnum().WithMessage("Course level is invalid.")
                .When(x => x.Level.HasValue);

            RuleFor(x => x.Language)
                .IsInEnum().WithMessage("Course language is invalid.")
                .When(x => x.Language.HasValue);

            RuleFor(x => x.PublishedAt)
                .GreaterThan(DateTime.MinValue)
                .When(x => x.PublishedAt.HasValue)
                .WithMessage("PublishedAt is invalid.");
        }
    }
}
