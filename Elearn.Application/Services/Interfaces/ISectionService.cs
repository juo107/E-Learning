using Elearn.Application.Common;
using Elearn.Application.DTOs.Section;

namespace Elearn.Application.Services.Interfaces
{
    public interface ISectionService
    {
        Task<BaseResponse<IEnumerable<SectionDto>>> GetAllSectionsAsync(QueryParameters? parameters = null);
        Task<BaseResponse<SectionDetailsDto>> GetSectionByIdAsync(Guid id);
        Task<BaseResponse<IEnumerable<SectionDto>>> GetSectionsByCourseIdAsync(Guid courseId);
        Task<BaseResponse<SectionDto>> CreateSectionAsync(CreateSectionDto dto);
        Task<BaseResponse<SectionDto>> UpdateSectionAsync(Guid id, UpdateSectionDto dto);
        Task<BaseResponse<bool>> DeleteSectionAsync(Guid id);
        Task<BaseResponse<bool>> RestoreSectionAsync(Guid id);
        Task<bool> SectionExistsAsync(Guid id);
    }
}

