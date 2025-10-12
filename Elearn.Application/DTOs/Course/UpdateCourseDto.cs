using System.ComponentModel.DataAnnotations;

namespace Elearn.Application.DTOs.Course
{
    public class UpdateCourseDto
    {
        [Required(ErrorMessage = "Course title is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters")]
        public string Title { get; set; } = default!;

        [Required(ErrorMessage = "Course description is required")]
        [StringLength(2000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 2000 characters")]
        public string Description { get; set; } = default!;

        [Required(ErrorMessage = "Course price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than or equal to 0")]
        public decimal Price { get; set; }
    }
}
