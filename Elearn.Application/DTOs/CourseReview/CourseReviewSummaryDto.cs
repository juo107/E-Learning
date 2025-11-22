namespace Elearn.Application.DTOs.CourseReview
{
    public class CourseReviewSummaryDto
    {
        public Guid CourseId { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public int Rating5Count { get; set; }
        public int Rating4Count { get; set; }
        public int Rating3Count { get; set; }
        public int Rating2Count { get; set; }
        public int Rating1Count { get; set; }
    }
}

