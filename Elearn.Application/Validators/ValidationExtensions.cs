using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Elearn.Application.Validators;

namespace Elearn.Application.Validations
{
    public static class ValidationExtensions
    {
        public static IServiceCollection AddValidators(this IServiceCollection services)
        {
            // Register validators
            services.AddScoped<IValidator<Elearn.Application.DTOs.Category.CreateCategoryDto>, CreateCategoryValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.Category.UpdateCategoryDto>, UpdateCategoryValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.Course.CreateCourseDto>, CreateCourseValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.Course.UpdateCourseDto>, UpdateCourseValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.CourseMedia.CreateCourseMediaDto>, CreateCourseMediaValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.CourseMedia.UpdateCourseMediaDto>, UpdateCourseMediaValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.Auth.RegisterDto>, RegisterDtoValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.Auth.LoginDto>, LoginDtoValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.CourseReview.CreateCourseReviewDto>, CreateCourseReviewValidator>();
            services.AddScoped<IValidator<Elearn.Application.DTOs.CourseReview.UpdateCourseReviewDto>, UpdateCourseReviewValidator>();

            return services;
        }
    }
}
