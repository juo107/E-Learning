using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

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

            return services;
        }
    }
}
