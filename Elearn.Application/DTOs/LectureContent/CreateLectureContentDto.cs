namespace Elearn.Application.DTOs.LectureContent
{
    public class CreateLectureContentDto
    {
        public Guid LectureId { get; set; }
        public string BlockType { get; set; } = string.Empty; // Text, Heading1, Image, Video, etc.
        public string DataJson { get; set; } = string.Empty;
        public int? OrderIndex { get; set; } // Optional, will auto-assign if null
    }
}

