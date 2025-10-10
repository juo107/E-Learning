namespace Elearn.Application.DTOs.Course
{
    public class CourseDto
    {
        public Guid Id { get; set; }
        public string CourseCode { get; set; } = default!;
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationInMinutes { get; set; }
    }
}
