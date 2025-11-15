using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Section;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;

namespace Elearn.Application.Services.Implementations
{
    public class SectionService : ISectionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRedisCacheService _cache;

        public SectionService(IUnitOfWork unitOfWork, IMapper mapper, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<SectionDto>>> GetAllSectionsAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                var cacheKey = $"sections:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.SortBy}:{parameters.IsDescending}";
                
                var cachedSections = await _cache.GetAsync<IEnumerable<SectionDto>>(cacheKey);
                if (cachedSections != null)
                {
                    return BaseResponse<IEnumerable<SectionDto>>.Ok(cachedSections, "Sections retrieved from cache");
                }

                var sections = await _unitOfWork.Sections.GetAllWithIncludesAsync(s => s.Course, s => s.Lectures);
                
                // Apply filtering by keyword if provided
                if (!string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    sections = sections.Where(s => 
                        s.Title.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        (s.Description != null && s.Description.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase)));
                }

                // Apply sorting
                sections = parameters.SortBy?.ToLower() switch
                {
                    "title" => parameters.IsDescending ? sections.OrderByDescending(s => s.Title) : sections.OrderBy(s => s.Title),
                    "orderindex" => parameters.IsDescending ? sections.OrderByDescending(s => s.OrderIndex) : sections.OrderBy(s => s.OrderIndex),
                    "createdat" => parameters.IsDescending ? sections.OrderByDescending(s => s.CreatedAt) : sections.OrderBy(s => s.CreatedAt),
                    _ => parameters.IsDescending ? sections.OrderByDescending(s => s.OrderIndex) : sections.OrderBy(s => s.OrderIndex)
                };

                // Apply pagination
                sections = sections
                    .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                    .Take(parameters.PageSize);

                var sectionDtos = sections.Select(s => new SectionDto
                {
                    Id = s.Id,
                    CourseId = s.CourseId,
                    Title = s.Title,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    IsPreviewable = s.IsPreviewable,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    LecturesCount = s.Lectures?.Count(l => !l.IsDeleted) ?? 0
                });

                await _cache.SetAsync(cacheKey, sectionDtos, TimeSpan.FromMinutes(10));
                
                return BaseResponse<IEnumerable<SectionDto>>.Ok(sectionDtos, "Sections retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<SectionDto>>.Fail($"Error retrieving sections: {ex.Message}");
            }
        }

        public async Task<BaseResponse<SectionDetailsDto>> GetSectionByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"section:{id}";
                var cachedSection = await _cache.GetAsync<SectionDetailsDto>(cacheKey);
                if (cachedSection != null)
                {
                    return BaseResponse<SectionDetailsDto>.Ok(cachedSection, "Section retrieved from cache");
                }

                var section = await _unitOfWork.Sections.GetByIdWithLecturesAsync(id);
                if (section == null)
                {
                    return BaseResponse<SectionDetailsDto>.Fail("Section not found");
                }

                var sectionDto = new SectionDetailsDto
                {
                    Id = section.Id,
                    CourseId = section.CourseId,
                    Title = section.Title,
                    Description = section.Description,
                    OrderIndex = section.OrderIndex,
                    IsPreviewable = section.IsPreviewable,
                    CreatedAt = section.CreatedAt,
                    UpdatedAt = section.UpdatedAt,
                    LecturesCount = section.Lectures?.Count(l => !l.IsDeleted) ?? 0,
                    CourseTitle = section.Course?.Title,
                    Lectures = section.Lectures?.Where(l => !l.IsDeleted)
                        .OrderBy(l => l.OrderIndex)
                        .Select(l => new DTOs.Lecture.LectureDto
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
                        }).ToList()
                };

                await _cache.SetAsync(cacheKey, sectionDto, TimeSpan.FromMinutes(10));
                
                return BaseResponse<SectionDetailsDto>.Ok(sectionDto, "Section retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<SectionDetailsDto>.Fail($"Error retrieving section: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<SectionDto>>> GetSectionsByCourseIdAsync(Guid courseId)
        {
            try
            {
                var cacheKey = $"sections:course:{courseId}";
                var cachedSections = await _cache.GetAsync<IEnumerable<SectionDto>>(cacheKey);
                if (cachedSections != null)
                {
                    return BaseResponse<IEnumerable<SectionDto>>.Ok(cachedSections, "Sections retrieved from cache");
                }

                var sections = await _unitOfWork.Sections.GetByCourseIdWithLecturesAsync(courseId);
                
                var sectionDtos = sections.Select(s => new SectionDto
                {
                    Id = s.Id,
                    CourseId = s.CourseId,
                    Title = s.Title,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    IsPreviewable = s.IsPreviewable,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    LecturesCount = s.Lectures?.Count(l => !l.IsDeleted) ?? 0
                });

                await _cache.SetAsync(cacheKey, sectionDtos, TimeSpan.FromMinutes(10));
                
                return BaseResponse<IEnumerable<SectionDto>>.Ok(sectionDtos, "Sections retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<SectionDto>>.Fail($"Error retrieving sections: {ex.Message}");
            }
        }

        public async Task<BaseResponse<SectionDto>> CreateSectionAsync(CreateSectionDto dto)
        {
            try
            {
                // Validate course exists
                var course = await _unitOfWork.Courses.GetByIdAsync(dto.CourseId);
                if (course == null)
                {
                    return BaseResponse<SectionDto>.Fail("Course not found");
                }

                // If OrderIndex is not specified or is 0, set it to max + 1
                int orderIndex = dto.OrderIndex;
                if (orderIndex <= 0)
                {
                    orderIndex = await _unitOfWork.Sections.GetMaxOrderIndexByCourseIdAsync(dto.CourseId) + 1;
                }

                var section = new Section
                {
                    CourseId = dto.CourseId,
                    Title = dto.Title,
                    Description = dto.Description,
                    OrderIndex = orderIndex,
                    IsPreviewable = dto.IsPreviewable
                };

                await _unitOfWork.Sections.AddAsync(section);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("sections:*");
                await _cache.RemoveByPatternAsync($"course:{dto.CourseId}*");

                var sectionDto = _mapper.Map<SectionDto>(section);
                sectionDto.LecturesCount = 0;

                return BaseResponse<SectionDto>.Ok(sectionDto, "Section created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<SectionDto>.Fail($"Error creating section: {ex.Message}");
            }
        }

        public async Task<BaseResponse<SectionDto>> UpdateSectionAsync(Guid id, UpdateSectionDto dto)
        {
            try
            {
                var section = await _unitOfWork.Sections.GetByIdAsync(id);
                if (section == null)
                {
                    return BaseResponse<SectionDto>.Fail("Section not found");
                }

                if (!string.IsNullOrWhiteSpace(dto.Title))
                    section.Title = dto.Title;
                
                if (dto.Description != null)
                    section.Description = dto.Description;
                
                if (dto.OrderIndex.HasValue)
                    section.OrderIndex = dto.OrderIndex.Value;
                
                if (dto.IsPreviewable.HasValue)
                    section.IsPreviewable = dto.IsPreviewable.Value;

                section.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Sections.Update(section);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("sections:*");
                await _cache.RemoveByPatternAsync($"course:{section.CourseId}*");

                var sectionDto = _mapper.Map<SectionDto>(section);
                var lectures = await _unitOfWork.Sections.GetByIdWithLecturesAsync(id);
                sectionDto.LecturesCount = lectures?.Lectures?.Count(l => !l.IsDeleted) ?? 0;

                return BaseResponse<SectionDto>.Ok(sectionDto, "Section updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<SectionDto>.Fail($"Error updating section: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteSectionAsync(Guid id)
        {
            try
            {
                var section = await _unitOfWork.Sections.GetByIdAsync(id);
                if (section == null)
                {
                    return BaseResponse<bool>.Fail("Section not found");
                }

                _unitOfWork.Sections.Delete(section);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("sections:*");
                await _cache.RemoveByPatternAsync($"course:{section.CourseId}*");

                return BaseResponse<bool>.Ok(true, "Section deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting section: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreSectionAsync(Guid id)
        {
            try
            {
                var section = await _unitOfWork.Sections.GetByIdAsync(id);
                if (section == null)
                {
                    return BaseResponse<bool>.Fail("Section not found");
                }

                section.IsDeleted = false;
                section.DeletedAt = null;
                section.DeletedBy = null;
                section.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Sections.Update(section);
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await _cache.RemoveByPatternAsync("sections:*");
                await _cache.RemoveByPatternAsync($"course:{section.CourseId}*");

                return BaseResponse<bool>.Ok(true, "Section restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring section: {ex.Message}");
            }
        }

        public async Task<bool> SectionExistsAsync(Guid id)
        {
            return await _unitOfWork.Sections.SectionExistsAsync(id);
        }
    }
}

