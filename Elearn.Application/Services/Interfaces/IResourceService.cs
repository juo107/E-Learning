using Elearn.Application.Common;
using Elearn.Application.DTOs.Resource;

namespace Elearn.Application.Services.Interfaces
{
    public interface IResourceService
    {
        Task<BaseResponse<IEnumerable<ResourceDto>>> GetAllResourcesAsync(QueryParameters? parameters = null);
        Task<BaseResponse<ResourceDetailsDto>> GetResourceByIdAsync(Guid id);
        Task<BaseResponse<IEnumerable<ResourceDto>>> GetResourcesByLectureIdAsync(Guid lectureId);
        Task<BaseResponse<ResourceDto>> CreateResourceAsync(CreateResourceDto dto);
        Task<BaseResponse<ResourceDto>> UpdateResourceAsync(Guid id, UpdateResourceDto dto);
        Task<BaseResponse<bool>> DeleteResourceAsync(Guid id);
        Task<BaseResponse<bool>> RestoreResourceAsync(Guid id);
        Task<bool> ResourceExistsAsync(Guid id);
    }
}

