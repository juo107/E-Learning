namespace Elearn.Application.DTOs.LectureContent
{
    public class LectureContentDto
    {
        public Guid Id { get; set; }
        public Guid LectureId { get; set; }
        public string BlockType { get; set; } = string.Empty; // Text, Heading1, Image, Video, etc.
        public string DataJson { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

