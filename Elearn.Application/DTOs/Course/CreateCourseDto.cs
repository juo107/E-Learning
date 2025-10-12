namespace Elearn.Application.DTOs.Course
{
    public class CreateCourseDto
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
        public Guid? CategoryId { get; set; }
    }
}
