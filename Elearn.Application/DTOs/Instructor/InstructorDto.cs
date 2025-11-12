namespace Elearn.Application.DTOs.Instructor
{
    public class InstructorDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public string Bio { get; set; } = string.Empty;
        public string Profession { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int TotalCourses { get; set; }
        public int TotalStudents { get; set; }
        public int TotalReviews { get; set; }
    }
}

