namespace Elearn.Application.DTOs.Section
{
    public class UpdateSectionDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? OrderIndex { get; set; }
        public bool? IsPreviewable { get; set; }
    }
}

