namespace Elearn.Application.DTOs.CourseReview
{
    public class CreateCourseReviewDto
    {
        public Guid CourseId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}

