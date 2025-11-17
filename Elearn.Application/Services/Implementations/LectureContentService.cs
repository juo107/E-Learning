using Elearn.Application.Common;
using Elearn.Application.DTOs.LectureContent;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities.Courses;
using Elearn.Domain.Entities.Enums.Courses;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;
using System.Text.Json;

namespace Elearn.Application.Services.Implementations
{
    public class LectureContentService : ILectureContentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRedisCacheService _cache;

        public LectureContentService(IUnitOfWork unitOfWork, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<LectureContentDto>>> GetByLectureIdAsync(Guid lectureId)
        {
            try
            {
                var cacheKey = $"lecture-content:lecture:{lectureId}";
                var cachedContents = await _cache.GetAsync<IEnumerable<LectureContentDto>>(cacheKey);
                if (cachedContents != null)
                {
                    return BaseResponse<IEnumerable<LectureContentDto>>.Ok(cachedContents, "Lecture contents retrieved from cache");
                }

                var contents = await _unitOfWork.LectureContents.GetByLectureIdOrderedAsync(lectureId);

                var contentDtos = contents.Select(c => new LectureContentDto
                {
                    Id = c.Id,
                    LectureId = c.LectureId,
                    BlockType = c.BlockType.ToString(),
                    DataJson = c.DataJson,
                    OrderIndex = c.OrderIndex,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                });

                await _cache.SetAsync(cacheKey, contentDtos, TimeSpan.FromMinutes(10));

                return BaseResponse<IEnumerable<LectureContentDto>>.Ok(contentDtos, "Lecture contents retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<LectureContentDto>>.Fail($"Error retrieving lecture contents: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureContentDto>> GetByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"lecture-content:{id}";
                var cachedContent = await _cache.GetAsync<LectureContentDto>(cacheKey);
                if (cachedContent != null)
                {
                    return BaseResponse<LectureContentDto>.Ok(cachedContent, "Lecture content retrieved from cache");
                }

                var content = await _unitOfWork.LectureContents.GetByIdWithLectureAsync(id);
                if (content == null)
                {
                    return BaseResponse<LectureContentDto>.Fail("Lecture content not found");
                }

                var contentDto = new LectureContentDto
                {
                    Id = content.Id,
                    LectureId = content.LectureId,
                    BlockType = content.BlockType.ToString(),
                    DataJson = content.DataJson,
                    OrderIndex = content.OrderIndex,
                    CreatedAt = content.CreatedAt,
                    UpdatedAt = content.UpdatedAt
                };

                await _cache.SetAsync(cacheKey, contentDto, TimeSpan.FromMinutes(10));

                return BaseResponse<LectureContentDto>.Ok(contentDto, "Lecture content retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureContentDto>.Fail($"Error retrieving lecture content: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureContentDto>> CreateAsync(CreateLectureContentDto dto)
        {
            try
            {
                // Verify lecture exists
                var lectureExists = await _unitOfWork.Lectures.LectureExistsAsync(dto.LectureId);
                if (!lectureExists)
                {
                    return BaseResponse<LectureContentDto>.Fail("Lecture not found");
                }

                // Parse BlockType
                if (!Enum.TryParse<ContentBlockType>(dto.BlockType, out var blockType))
                {
                    return BaseResponse<LectureContentDto>.Fail($"Invalid BlockType: {dto.BlockType}");
                }

                // Validate JSON
                if (!string.IsNullOrEmpty(dto.DataJson))
                {
                    try
                    {
                        JsonDocument.Parse(dto.DataJson);
                    }
                    catch
                    {
                        return BaseResponse<LectureContentDto>.Fail("Invalid JSON format in DataJson");
                    }
                }

                // Determine OrderIndex
                int orderIndex;
                if (dto.OrderIndex.HasValue)
                {
                    orderIndex = dto.OrderIndex.Value;
                }
                else
                {
                    var maxOrder = await _unitOfWork.LectureContents.GetMaxOrderIndexByLectureIdAsync(dto.LectureId);
                    orderIndex = maxOrder + 1;
                }

                var lectureContent = new LectureContent
                {
                    Id = Guid.NewGuid(),
                    LectureId = dto.LectureId,
                    BlockType = blockType,
                    DataJson = dto.DataJson ?? string.Empty,
                    OrderIndex = orderIndex,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.LectureContents.AddAsync(lectureContent);
                await _unitOfWork.CompleteAsync();

                // Clear cache
                await _cache.RemoveAsync($"lecture-content:lecture:{dto.LectureId}");

                var contentDto = new LectureContentDto
                {
                    Id = lectureContent.Id,
                    LectureId = lectureContent.LectureId,
                    BlockType = lectureContent.BlockType.ToString(),
                    DataJson = lectureContent.DataJson,
                    OrderIndex = lectureContent.OrderIndex,
                    CreatedAt = lectureContent.CreatedAt,
                    UpdatedAt = lectureContent.UpdatedAt
                };

                return BaseResponse<LectureContentDto>.Ok(contentDto, "Lecture content created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureContentDto>.Fail($"Error creating lecture content: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureContentDto>> UpdateAsync(Guid id, UpdateLectureContentDto dto)
        {
            try
            {
                var lectureContent = await _unitOfWork.LectureContents.GetByIdAsync(id);
                if (lectureContent == null)
                {
                    return BaseResponse<LectureContentDto>.Fail("Lecture content not found");
                }

                // Update BlockType if provided
                if (!string.IsNullOrEmpty(dto.BlockType))
                {
                    if (!Enum.TryParse<ContentBlockType>(dto.BlockType, out var blockType))
                    {
                        return BaseResponse<LectureContentDto>.Fail($"Invalid BlockType: {dto.BlockType}");
                    }
                    lectureContent.BlockType = blockType;
                }

                // Update DataJson if provided
                if (dto.DataJson != null)
                {
                    // Validate JSON
                    try
                    {
                        JsonDocument.Parse(dto.DataJson);
                        lectureContent.DataJson = dto.DataJson;
                    }
                    catch
                    {
                        return BaseResponse<LectureContentDto>.Fail("Invalid JSON format in DataJson");
                    }
                }

                // Update OrderIndex if provided
                if (dto.OrderIndex.HasValue)
                {
                    lectureContent.OrderIndex = dto.OrderIndex.Value;
                }

                lectureContent.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.CompleteAsync();

                // Clear cache
                await _cache.RemoveAsync($"lecture-content:{id}");
                await _cache.RemoveAsync($"lecture-content:lecture:{lectureContent.LectureId}");

                var contentDto = new LectureContentDto
                {
                    Id = lectureContent.Id,
                    LectureId = lectureContent.LectureId,
                    BlockType = lectureContent.BlockType.ToString(),
                    DataJson = lectureContent.DataJson,
                    OrderIndex = lectureContent.OrderIndex,
                    CreatedAt = lectureContent.CreatedAt,
                    UpdatedAt = lectureContent.UpdatedAt
                };

                return BaseResponse<LectureContentDto>.Ok(contentDto, "Lecture content updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureContentDto>.Fail($"Error updating lecture content: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteAsync(Guid id)
        {
            try
            {
                var lectureContent = await _unitOfWork.LectureContents.GetByIdAsync(id);
                if (lectureContent == null)
                {
                    return BaseResponse<bool>.Fail("Lecture content not found");
                }

                var lectureId = lectureContent.LectureId;

                _unitOfWork.LectureContents.Delete(lectureContent);
                await _unitOfWork.CompleteAsync();

                // Clear cache
                await _cache.RemoveAsync($"lecture-content:{id}");
                await _cache.RemoveAsync($"lecture-content:lecture:{lectureId}");

                return BaseResponse<bool>.Ok(true, "Lecture content deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting lecture content: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreAsync(Guid id)
        {
            try
            {
                var lectureContent = await _unitOfWork.LectureContents.GetByIdAsync(id);
                if (lectureContent == null)
                {
                    return BaseResponse<bool>.Fail("Lecture content not found");
                }

                var lectureId = lectureContent.LectureId;

                lectureContent.IsDeleted = false;
                lectureContent.DeletedAt = null;
                lectureContent.DeletedBy = null;
                lectureContent.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.LectureContents.Update(lectureContent);
                await _unitOfWork.CompleteAsync();

                // Clear cache
                await _cache.RemoveAsync($"lecture-content:{id}");
                await _cache.RemoveAsync($"lecture-content:lecture:{lectureId}");

                return BaseResponse<bool>.Ok(true, "Lecture content restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring lecture content: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> ReorderBlocksAsync(ReorderBlocksDto dto)
        {
            try
            {
                // Verify lecture exists
                var lectureExists = await _unitOfWork.Lectures.LectureExistsAsync(dto.LectureId);
                if (!lectureExists)
                {
                    return BaseResponse<bool>.Fail("Lecture not found");
                }

                // Build order map
                var blockOrderMap = dto.Blocks.ToDictionary(b => b.BlockId, b => b.OrderIndex);

                // Reorder blocks
                await _unitOfWork.LectureContents.ReorderBlocksAsync(dto.LectureId, blockOrderMap);
                await _unitOfWork.CompleteAsync();

                // Clear cache
                await _cache.RemoveAsync($"lecture-content:lecture:{dto.LectureId}");

                return BaseResponse<bool>.Ok(true, "Blocks reordered successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error reordering blocks: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureContentDto>> UpdateBlockJsonAsync(Guid id, UpdateBlockJsonDto dto)
        {
            try
            {
                var lectureContent = await _unitOfWork.LectureContents.GetByIdAsync(id);
                if (lectureContent == null)
                {
                    return BaseResponse<LectureContentDto>.Fail("Lecture content not found");
                }

                // Validate JSON
                try
                {
                    JsonDocument.Parse(dto.DataJson);
                }
                catch
                {
                    return BaseResponse<LectureContentDto>.Fail("Invalid JSON format");
                }

                lectureContent.DataJson = dto.DataJson;
                lectureContent.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.CompleteAsync();

                // Clear cache
                await _cache.RemoveAsync($"lecture-content:{id}");
                await _cache.RemoveAsync($"lecture-content:lecture:{lectureContent.LectureId}");

                var contentDto = new LectureContentDto
                {
                    Id = lectureContent.Id,
                    LectureId = lectureContent.LectureId,
                    BlockType = lectureContent.BlockType.ToString(),
                    DataJson = lectureContent.DataJson,
                    OrderIndex = lectureContent.OrderIndex,
                    CreatedAt = lectureContent.CreatedAt,
                    UpdatedAt = lectureContent.UpdatedAt
                };

                return BaseResponse<LectureContentDto>.Ok(contentDto, "Block JSON updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureContentDto>.Fail($"Error updating block JSON: {ex.Message}");
            }
        }

        public async Task<bool> LectureContentExistsAsync(Guid id)
        {
            return await _unitOfWork.LectureContents.LectureContentExistsAsync(id);
        }
    }
}

