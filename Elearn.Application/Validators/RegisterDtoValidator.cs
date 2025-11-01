using FluentValidation;
using Elearn.Application.DTOs.Auth;

namespace Elearn.Application.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format")
                .MaximumLength(256).WithMessage("Email must not exceed 256 characters");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Confirm password is required")
                .Equal(x => x.Password).WithMessage("Passwords do not match");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MaximumLength(200).WithMessage("Full name must not exceed 200 characters");

            RuleFor(x => x.Role)
                .Must(role => role == "Student" || role == "Instructor")
                .WithMessage("Role must be either 'Student' or 'Instructor'");
        }
    }
}




