namespace Elearn.Application.DTOs.LectureContent
{
    public class ReorderBlocksDto
    {
        public Guid LectureId { get; set; }
        public List<BlockOrderItem> Blocks { get; set; } = new();
    }

    public class BlockOrderItem
    {
        public Guid BlockId { get; set; }
        public int OrderIndex { get; set; }
    }
}

