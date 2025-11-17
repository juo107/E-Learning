using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Lecture;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;

namespace Elearn.Application.Services.Implementations
{
    public class LectureService : ILectureService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRedisCacheService _cache;

        public LectureService(IUnitOfWork unitOfWork, IMapper mapper, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<LectureDto>>> GetAllLecturesAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                var cacheKey = $"lectures:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.SortBy}:{parameters.IsDescending}";
                
                var cachedLectures = await _cache.GetAsync<IEnumerable<LectureDto>>(cacheKey);
                if (cachedLectures != null)
                {
                    return BaseResponse<IEnumerable<LectureDto>>.Ok(cachedLectures, "Lectures retrieved from cache");
                }

                var lectures = await _unitOfWork.Lectures.GetAllWithIncludesAsync(l => l.Section, l => l.Resources);
                
                // Apply filtering by keyword if provided
                if (!string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    lectures = lectures.Where(l => 
                        l.Title.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        (l.Content != null && l.Content.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase)));
                }

                // Apply sorting
                lectures = parameters.SortBy?.ToLower() switch
                {
                    "title" => parameters.IsDescending ? lectures.OrderByDescending(l => l.Title) : lectures.OrderBy(l => l.Title),
                    "orderindex" => parameters.IsDescending ? lectures.OrderByDescending(l => l.OrderIndex) : lectures.OrderBy(l => l.OrderIndex),
                    "createdat" => parameters.IsDescending ? lectures.OrderByDescending(l => l.CreatedAt) : lectures.OrderBy(l => l.CreatedAt),
                    _ => parameters.IsDescending ? lectures.OrderByDescending(l => l.OrderIndex) : lectures.OrderBy(l => l.OrderIndex)
                };

                // Apply pagination
                lectures = lectures
                    .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                    .Take(parameters.PageSize);

                var lectureDtos = lectures.Select(l => new LectureDto
                {
                    Id = l.Id,
                    SectionId = l.SectionId,
                    Title = l.Title,
                    Type = l.Type.ToString(),
                    Duration = l.Duration,
                    VideoUrl = l.VideoUrl,
                    Content = l.Content,
                    OrderIndex = l.OrderIndex,
                    IsPreviewable = l.IsPreviewable,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt,
                    ResourcesCount = l.Resources?.Count(r => !r.IsDeleted) ?? 0
                });

                await _cache.SetAsync(cacheKey, lectureDtos, TimeSpan.FromMinutes(10));
                
                return BaseResponse<IEnumerable<LectureDto>>.Ok(lectureDtos, "Lectures retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<LectureDto>>.Fail($"Error retrieving lectures: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureDetailsDto>> GetLectureByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"lecture:{id}";
                var cachedLecture = await _cache.GetAsync<LectureDetailsDto>(cacheKey);
                if (cachedLecture != null)
                {
                    return BaseResponse<LectureDetailsDto>.Ok(cachedLecture, "Lecture retrieved from cache");
                }

                var lecture = await _unitOfWork.Lectures.GetByIdWithResourcesAsync(id);
                if (lecture == null)
                {
                    return BaseResponse<LectureDetailsDto>.Fail("Lecture not found");
                }

                var lectureDto = new LectureDetailsDto
                {
                    Id = lecture.Id,
                    SectionId = lecture.SectionId,
                    Title = lecture.Title,
                    Type = lecture.Type.ToString(),
                    Duration = lecture.Duration,
                    VideoUrl = lecture.VideoUrl,
                    Content = lecture.Content,
                    OrderIndex = lecture.OrderIndex,
                    IsPreviewable = lecture.IsPreviewable,
                    CreatedAt = lecture.CreatedAt,
                    UpdatedAt = lecture.UpdatedAt,
                    ResourcesCount = lecture.Resources?.Count(r => !r.IsDeleted) ?? 0,
                    SectionTitle = lecture.Section?.Title
                };

                await _cache.SetAsync(cacheKey, lectureDto, TimeSpan.FromMinutes(10));
                
                return BaseResponse<LectureDetailsDto>.Ok(lectureDto, "Lecture retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureDetailsDto>.Fail($"Error retrieving lecture: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<LectureDto>>> GetLecturesBySectionIdAsync(Guid sectionId)
        {
            try
            {
                var cacheKey = $"lectures:section:{sectionId}";
                var cachedLectures = await _cache.GetAsync<IEnumerable<LectureDto>>(cacheKey);
                if (cachedLectures != null)
                {
                    return BaseResponse<IEnumerable<LectureDto>>.Ok(cachedLectures, "Lectures retrieved from cache");
                }

                var lectures = await _unitOfWork.Lectures.GetBySectionIdWithResourcesAsync(sectionId);
                
                var lectureDtos = lectures.Select(l => new LectureDto
                {
                    Id = l.Id,
                    SectionId = l.SectionId,
                    Title = l.Title,
                    Type = l.Type.ToString(),
                    Duration = l.Duration,
                    VideoUrl = l.VideoUrl,
                    Content = l.Content,
                    OrderIndex = l.OrderIndex,
                    IsPreviewable = l.IsPreviewable,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt,
                    ResourcesCount = l.Resources?.Count(r => !r.IsDeleted) ?? 0
                });

                await _cache.SetAsync(cacheKey, lectureDtos, TimeSpan.FromMinutes(10));
                
                return BaseResponse<IEnumerable<LectureDto>>.Ok(lectureDtos, "Lectures retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<LectureDto>>.Fail($"Error retrieving lectures: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureDto>> CreateLectureAsync(CreateLectureDto dto)
        {
            try
            {
                // Validate section exists
                var section = await _unitOfWork.Sections.GetByIdAsync(dto.SectionId);
                if (section == null)
                {
                    return BaseResponse<LectureDto>.Fail("Section not found");
                }

                // Convert Type string to enum
                LectureType lectureType = Enum.Parse<LectureType>(dto.Type);

                // If OrderIndex is not specified or is 0, set it to max + 1
                int orderIndex = dto.OrderIndex;
                if (orderIndex <= 0)
                {
                    orderIndex = await _unitOfWork.Lectures.GetMaxOrderIndexBySectionIdAsync(dto.SectionId) + 1;
                }

                var lecture = new Lecture
                {
                    SectionId = dto.SectionId,
                    Title = dto.Title,
                    Type = lectureType,
                    Duration = dto.Duration,
                    VideoUrl = dto.VideoUrl,
                    Content = dto.Content,
                    OrderIndex = orderIndex,
                    IsPreviewable = dto.IsPreviewable
                };

                await _unitOfWork.Lectures.AddAsync(lecture);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("lectures:*");
                await _cache.RemoveByPatternAsync($"section:{dto.SectionId}*");

                var lectureDto = new LectureDto
                {
                    Id = lecture.Id,
                    SectionId = lecture.SectionId,
                    Title = lecture.Title,
                    Type = lecture.Type.ToString(),
                    Duration = lecture.Duration,
                    VideoUrl = lecture.VideoUrl,
                    Content = lecture.Content,
                    OrderIndex = lecture.OrderIndex,
                    IsPreviewable = lecture.IsPreviewable,
                    CreatedAt = lecture.CreatedAt,
                    UpdatedAt = lecture.UpdatedAt,
                    ResourcesCount = 0
                };

                return BaseResponse<LectureDto>.Ok(lectureDto, "Lecture created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureDto>.Fail($"Error creating lecture: {ex.Message}");
            }
        }

        public async Task<BaseResponse<LectureDto>> UpdateLectureAsync(Guid id, UpdateLectureDto dto)
        {
            try
            {
                var lecture = await _unitOfWork.Lectures.GetByIdAsync(id);
                if (lecture == null)
                {
                    return BaseResponse<LectureDto>.Fail("Lecture not found");
                }

                if (!string.IsNullOrWhiteSpace(dto.Title))
                    lecture.Title = dto.Title;
                
                if (!string.IsNullOrWhiteSpace(dto.Type))
                    lecture.Type = Enum.Parse<LectureType>(dto.Type);
                
                if (dto.Duration.HasValue)
                    lecture.Duration = dto.Duration;
                
                if (dto.VideoUrl != null)
                    lecture.VideoUrl = dto.VideoUrl;
                
                if (dto.Content != null)
                    lecture.Content = dto.Content;
                
                if (dto.OrderIndex.HasValue)
                    lecture.OrderIndex = dto.OrderIndex.Value;
                
                if (dto.IsPreviewable.HasValue)
                    lecture.IsPreviewable = dto.IsPreviewable.Value;

                lecture.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Lectures.Update(lecture);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("lectures:*");
                await _cache.RemoveByPatternAsync($"section:{lecture.SectionId}*");

                var lectureWithResources = await _unitOfWork.Lectures.GetByIdWithResourcesAsync(id);
                var lectureDto = new LectureDto
                {
                    Id = lecture.Id,
                    SectionId = lecture.SectionId,
                    Title = lecture.Title,
                    Type = lecture.Type.ToString(),
                    Duration = lecture.Duration,
                    VideoUrl = lecture.VideoUrl,
                    Content = lecture.Content,
                    OrderIndex = lecture.OrderIndex,
                    IsPreviewable = lecture.IsPreviewable,
                    CreatedAt = lecture.CreatedAt,
                    UpdatedAt = lecture.UpdatedAt,
                    ResourcesCount = lectureWithResources?.Resources?.Count(r => !r.IsDeleted) ?? 0
                };

                return BaseResponse<LectureDto>.Ok(lectureDto, "Lecture updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<LectureDto>.Fail($"Error updating lecture: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteLectureAsync(Guid id)
        {
            try
            {
                var lecture = await _unitOfWork.Lectures.GetByIdAsync(id);
                if (lecture == null)
                {
                    return BaseResponse<bool>.Fail("Lecture not found");
                }

                _unitOfWork.Lectures.Delete(lecture);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("lectures:*");
                await _cache.RemoveByPatternAsync($"section:{lecture.SectionId}*");

                return BaseResponse<bool>.Ok(true, "Lecture deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting lecture: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreLectureAsync(Guid id)
        {
            try
            {
                var lecture = await _unitOfWork.Lectures.GetByIdAsync(id);
                if (lecture == null)
                {
                    return BaseResponse<bool>.Fail("Lecture not found");
                }

                lecture.IsDeleted = false;
                lecture.DeletedAt = null;
                lecture.DeletedBy = null;
                lecture.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Lectures.Update(lecture);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("lectures:*");
                await _cache.RemoveByPatternAsync($"section:{lecture.SectionId}*");

                return BaseResponse<bool>.Ok(true, "Lecture restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring lecture: {ex.Message}");
            }
        }

        public async Task<bool> LectureExistsAsync(Guid id)
        {
            return await _unitOfWork.Lectures.LectureExistsAsync(id);
        }
    }
}

