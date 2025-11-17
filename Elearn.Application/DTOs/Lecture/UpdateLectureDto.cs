namespace Elearn.Application.DTOs.Lecture
{
    public class UpdateLectureDto
    {
        public string? Title { get; set; }
        public string? Type { get; set; }
        public int? Duration { get; set; }
        public string? VideoUrl { get; set; }
        public string? Content { get; set; }
        public int? OrderIndex { get; set; }
        public bool? IsPreviewable { get; set; }
    }
}

