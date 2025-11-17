using Elearn.Application.Common;
using Elearn.Application.DTOs.Lecture;

namespace Elearn.Application.Services.Interfaces
{
    public interface ILectureService
    {
        Task<BaseResponse<IEnumerable<LectureDto>>> GetAllLecturesAsync(QueryParameters? parameters = null);
        Task<BaseResponse<LectureDetailsDto>> GetLectureByIdAsync(Guid id);
        Task<BaseResponse<IEnumerable<LectureDto>>> GetLecturesBySectionIdAsync(Guid sectionId);
        Task<BaseResponse<LectureDto>> CreateLectureAsync(CreateLectureDto dto);
        Task<BaseResponse<LectureDto>> UpdateLectureAsync(Guid id, UpdateLectureDto dto);
        Task<BaseResponse<bool>> DeleteLectureAsync(Guid id);
        Task<BaseResponse<bool>> RestoreLectureAsync(Guid id);
        Task<bool> LectureExistsAsync(Guid id);
    }
}

