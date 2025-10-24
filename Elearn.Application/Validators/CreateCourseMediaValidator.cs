using FluentValidation;
using Elearn.Application.DTOs.CourseMedia;
using Elearn.Domain.Entities.Enums;

namespace Elearn.Application.Validators
{
    public class CreateCourseMediaValidator : AbstractValidator<CreateCourseMediaDto>
    {
        public CreateCourseMediaValidator()
        {
            RuleFor(x => x.CourseId)
                .NotEmpty()
                .WithMessage("Course ID is required");

            RuleFor(x => x.MediaType)
                .IsInEnum()
                .WithMessage("Invalid media type");

            RuleFor(x => x.MediaUrl)
                .NotEmpty()
                .WithMessage("Media URL is required")
                .MaximumLength(1000)
                .WithMessage("Media URL cannot exceed 1000 characters")
                .Must(BeValidUrl)
                .WithMessage("Media URL must be a valid URL");

            RuleFor(x => x.ThumbnailUrl)
                .MaximumLength(1000)
                .WithMessage("Thumbnail URL cannot exceed 1000 characters")
                .Must(BeValidUrlOrEmpty)
                .WithMessage("Thumbnail URL must be a valid URL when provided");

            RuleFor(x => x.AltText)
                .MaximumLength(255)
                .WithMessage("Alt text cannot exceed 255 characters");

            RuleFor(x => x.OrderIndex)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Order index must be non-negative");

            RuleFor(x => x.Width)
                .GreaterThan(0)
                .When(x => x.Width.HasValue)
                .WithMessage("Width must be greater than 0 when provided");

            RuleFor(x => x.Height)
                .GreaterThan(0)
                .When(x => x.Height.HasValue)
                .WithMessage("Height must be greater than 0 when provided");

            RuleFor(x => x.FileSizeKB)
                .GreaterThan(0)
                .When(x => x.FileSizeKB.HasValue)
                .WithMessage("File size must be greater than 0 when provided");
        }

        private bool BeValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }

        private bool BeValidUrlOrEmpty(string? url)
        {
            if (string.IsNullOrEmpty(url))
                return true;
            return BeValidUrl(url);
        }
    }
}
