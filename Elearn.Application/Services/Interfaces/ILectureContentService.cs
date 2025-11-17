using Elearn.Application.Common;
using Elearn.Application.DTOs.LectureContent;

namespace Elearn.Application.Services.Interfaces
{
    public interface ILectureContentService
    {
        Task<BaseResponse<IEnumerable<LectureContentDto>>> GetByLectureIdAsync(Guid lectureId);
        Task<BaseResponse<LectureContentDto>> GetByIdAsync(Guid id);
        Task<BaseResponse<LectureContentDto>> CreateAsync(CreateLectureContentDto dto);
        Task<BaseResponse<LectureContentDto>> UpdateAsync(Guid id, UpdateLectureContentDto dto);
        Task<BaseResponse<bool>> DeleteAsync(Guid id);
        Task<BaseResponse<bool>> RestoreAsync(Guid id);
        Task<BaseResponse<bool>> ReorderBlocksAsync(ReorderBlocksDto dto);
        Task<BaseResponse<LectureContentDto>> UpdateBlockJsonAsync(Guid id, UpdateBlockJsonDto dto);
        Task<bool> LectureContentExistsAsync(Guid id);
    }
}

