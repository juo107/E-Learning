using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Resource;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;

namespace Elearn.Application.Services.Implementations
{
    public class ResourceService : IResourceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRedisCacheService _cache;

        public ResourceService(IUnitOfWork unitOfWork, IMapper mapper, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<ResourceDto>>> GetAllResourcesAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                var cacheKey = $"resources:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.SortBy}:{parameters.IsDescending}";
                
                var cachedResources = await _cache.GetAsync<IEnumerable<ResourceDto>>(cacheKey);
                if (cachedResources != null)
                {
                    return BaseResponse<IEnumerable<ResourceDto>>.Ok(cachedResources, "Resources retrieved from cache");
                }

                var resources = await _unitOfWork.Resources.GetAllWithIncludesAsync(r => r.Lecture);
                
                // Apply filtering by keyword if provided
                if (!string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    resources = resources.Where(r => 
                        r.FileName.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        r.FileUrl.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase));
                }

                // Apply sorting
                resources = parameters.SortBy?.ToLower() switch
                {
                    "filename" => parameters.IsDescending ? resources.OrderByDescending(r => r.FileName) : resources.OrderBy(r => r.FileName),
                    "createdat" => parameters.IsDescending ? resources.OrderByDescending(r => r.CreatedAt) : resources.OrderBy(r => r.CreatedAt),
                    _ => parameters.IsDescending ? resources.OrderByDescending(r => r.CreatedAt) : resources.OrderBy(r => r.CreatedAt)
                };

                // Apply pagination
                resources = resources
                    .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                    .Take(parameters.PageSize);

                var resourceDtos = resources.Select(r => new ResourceDto
                {
                    Id = r.Id,
                    LectureId = r.LectureId,
                    FileName = r.FileName,
                    FileUrl = r.FileUrl,
                    ResourceType = r.ResourceType.ToString(),
                    FileSizeKB = r.FileSizeKB,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                });

                await _cache.SetAsync(cacheKey, resourceDtos, TimeSpan.FromMinutes(10));
                
                return BaseResponse<IEnumerable<ResourceDto>>.Ok(resourceDtos, "Resources retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<ResourceDto>>.Fail($"Error retrieving resources: {ex.Message}");
            }
        }

        public async Task<BaseResponse<ResourceDetailsDto>> GetResourceByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"resource:{id}";
                var cachedResource = await _cache.GetAsync<ResourceDetailsDto>(cacheKey);
                if (cachedResource != null)
                {
                    return BaseResponse<ResourceDetailsDto>.Ok(cachedResource, "Resource retrieved from cache");
                }

                var resourceEntity = await _unitOfWork.Resources.GetByIdWithIncludesAsync(id, r => r.Lecture);
                
                if (resourceEntity == null)
                {
                    return BaseResponse<ResourceDetailsDto>.Fail("Resource not found");
                }

                var resourceDto = new ResourceDetailsDto
                {
                    Id = resourceEntity.Id,
                    LectureId = resourceEntity.LectureId,
                    FileName = resourceEntity.FileName,
                    FileUrl = resourceEntity.FileUrl,
                    ResourceType = resourceEntity.ResourceType.ToString(),
                    FileSizeKB = resourceEntity.FileSizeKB,
                    CreatedAt = resourceEntity.CreatedAt,
                    UpdatedAt = resourceEntity.UpdatedAt,
                    LectureTitle = resourceEntity.Lecture?.Title
                };

                await _cache.SetAsync(cacheKey, resourceDto, TimeSpan.FromMinutes(10));
                
                return BaseResponse<ResourceDetailsDto>.Ok(resourceDto, "Resource retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<ResourceDetailsDto>.Fail($"Error retrieving resource: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<ResourceDto>>> GetResourcesByLectureIdAsync(Guid lectureId)
        {
            try
            {
                var cacheKey = $"resources:lecture:{lectureId}";
                var cachedResources = await _cache.GetAsync<IEnumerable<ResourceDto>>(cacheKey);
                if (cachedResources != null)
                {
                    return BaseResponse<IEnumerable<ResourceDto>>.Ok(cachedResources, "Resources retrieved from cache");
                }

                var resources = await _unitOfWork.Resources.GetByLectureIdAsync(lectureId);
                
                var resourceDtos = resources.Select(r => new ResourceDto
                {
                    Id = r.Id,
                    LectureId = r.LectureId,
                    FileName = r.FileName,
                    FileUrl = r.FileUrl,
                    ResourceType = r.ResourceType.ToString(),
                    FileSizeKB = r.FileSizeKB,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                });

                await _cache.SetAsync(cacheKey, resourceDtos, TimeSpan.FromMinutes(10));
                
                return BaseResponse<IEnumerable<ResourceDto>>.Ok(resourceDtos, "Resources retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<ResourceDto>>.Fail($"Error retrieving resources: {ex.Message}");
            }
        }

        public async Task<BaseResponse<ResourceDto>> CreateResourceAsync(CreateResourceDto dto)
        {
            try
            {
                // Validate lecture exists
                var lecture = await _unitOfWork.Lectures.GetByIdAsync(dto.LectureId);
                if (lecture == null)
                {
                    return BaseResponse<ResourceDto>.Fail("Lecture not found");
                }

                // Convert ResourceType string to enum
                ResourceType resourceType = Enum.Parse<ResourceType>(dto.ResourceType);

                var resource = new Resource
                {
                    LectureId = dto.LectureId,
                    FileName = dto.FileName,
                    FileUrl = dto.FileUrl,
                    ResourceType = resourceType,
                    FileSizeKB = dto.FileSizeKB
                };

                await _unitOfWork.Resources.AddAsync(resource);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("resources:*");
                await _cache.RemoveByPatternAsync($"lecture:{dto.LectureId}*");

                var resourceDto = new ResourceDto
                {
                    Id = resource.Id,
                    LectureId = resource.LectureId,
                    FileName = resource.FileName,
                    FileUrl = resource.FileUrl,
                    ResourceType = resource.ResourceType.ToString(),
                    FileSizeKB = resource.FileSizeKB,
                    CreatedAt = resource.CreatedAt,
                    UpdatedAt = resource.UpdatedAt
                };

                return BaseResponse<ResourceDto>.Ok(resourceDto, "Resource created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<ResourceDto>.Fail($"Error creating resource: {ex.Message}");
            }
        }

        public async Task<BaseResponse<ResourceDto>> UpdateResourceAsync(Guid id, UpdateResourceDto dto)
        {
            try
            {
                var resource = await _unitOfWork.Resources.GetByIdAsync(id);
                if (resource == null)
                {
                    return BaseResponse<ResourceDto>.Fail("Resource not found");
                }

                if (!string.IsNullOrWhiteSpace(dto.FileName))
                    resource.FileName = dto.FileName;
                
                if (!string.IsNullOrWhiteSpace(dto.FileUrl))
                    resource.FileUrl = dto.FileUrl;
                
                if (!string.IsNullOrWhiteSpace(dto.ResourceType))
                    resource.ResourceType = Enum.Parse<ResourceType>(dto.ResourceType);
                
                if (dto.FileSizeKB.HasValue)
                    resource.FileSizeKB = dto.FileSizeKB;

                resource.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Resources.Update(resource);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("resources:*");
                await _cache.RemoveByPatternAsync($"lecture:{resource.LectureId}*");

                var resourceDto = new ResourceDto
                {
                    Id = resource.Id,
                    LectureId = resource.LectureId,
                    FileName = resource.FileName,
                    FileUrl = resource.FileUrl,
                    ResourceType = resource.ResourceType.ToString(),
                    FileSizeKB = resource.FileSizeKB,
                    CreatedAt = resource.CreatedAt,
                    UpdatedAt = resource.UpdatedAt
                };

                return BaseResponse<ResourceDto>.Ok(resourceDto, "Resource updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<ResourceDto>.Fail($"Error updating resource: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteResourceAsync(Guid id)
        {
            try
            {
                var resource = await _unitOfWork.Resources.GetByIdAsync(id);
                if (resource == null)
                {
                    return BaseResponse<bool>.Fail("Resource not found");
                }

                _unitOfWork.Resources.Delete(resource);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("resources:*");
                await _cache.RemoveByPatternAsync($"lecture:{resource.LectureId}*");

                return BaseResponse<bool>.Ok(true, "Resource deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting resource: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreResourceAsync(Guid id)
        {
            try
            {
                var resource = await _unitOfWork.Resources.GetByIdAsync(id);
                if (resource == null)
                {
                    return BaseResponse<bool>.Fail("Resource not found");
                }

                resource.IsDeleted = false;
                resource.DeletedAt = null;
                resource.DeletedBy = null;
                resource.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Resources.Update(resource);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("resources:*");
                await _cache.RemoveByPatternAsync($"lecture:{resource.LectureId}*");

                return BaseResponse<bool>.Ok(true, "Resource restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring resource: {ex.Message}");
            }
        }

        public async Task<bool> ResourceExistsAsync(Guid id)
        {
            return await _unitOfWork.Resources.ResourceExistsAsync(id);
        }
    }
}

