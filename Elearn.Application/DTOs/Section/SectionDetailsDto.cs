using Elearn.Application.DTOs.Lecture;

namespace Elearn.Application.DTOs.Section
{
    public class SectionDetailsDto : SectionDto
    {
        public string? CourseTitle { get; set; }
        public List<LectureDto>? Lectures { get; set; }
    }
}

