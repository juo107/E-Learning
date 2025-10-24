using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.CourseMedia;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository.Interfaces;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;

namespace Elearn.Application.Services.Implementations
{
    /// <summary>
    /// Service implementation for CourseMedia business operations
    /// </summary>
    public class CourseMediaService : ICourseMediaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRedisCacheService _cache;

        /// <summary>
        /// Constructor for CourseMediaService
        /// </summary>
        /// <param name="unitOfWork">Unit of work for database operations</param>
        /// <param name="mapper">AutoMapper for object mapping</param>
        /// <param name="cache">Redis cache service</param>
        public CourseMediaService(IUnitOfWork unitOfWork, IMapper mapper, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetAllCourseMediasAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                var cacheKey = $"courseMedias:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.SortBy}:{parameters.IsDescending}";
                
                var cachedCourseMedias = await _cache.GetAsync<IEnumerable<CourseMediaDto>>(cacheKey);
                if (cachedCourseMedias != null)
                {
                    return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(cachedCourseMedias, "Course medias retrieved from cache");
                }

                var courseMedias = await _unitOfWork.CourseMedias.GetAllAsync();
                
                if (!string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    courseMedias = courseMedias.Where(cm => 
                        cm.AltText != null && cm.AltText.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase));
                }

                var courseMediaDtos = _mapper.Map<IEnumerable<CourseMediaDto>>(courseMedias);
                
                await _cache.SetAsync(cacheKey, courseMediaDtos, TimeSpan.FromMinutes(30));
                
                return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(courseMediaDtos, "Course medias retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseMediaDto>>.Fail($"Error retrieving course medias: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseMediaDto>> GetCourseMediaByIdAsync(Guid id)
        {
            try
            {
                var courseMedia = await _unitOfWork.CourseMedias.GetByIdAsync(id);
                if (courseMedia == null)
                {
                    return BaseResponse<CourseMediaDto>.Fail("Course media not found");
                }

                var courseMediaDto = _mapper.Map<CourseMediaDto>(courseMedia);
                return BaseResponse<CourseMediaDto>.Ok(courseMediaDto, "Course media retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseMediaDto>.Fail($"Error retrieving course media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseMediaDto>> CreateCourseMediaAsync(CreateCourseMediaDto dto)
        {
            try
            {
                var courseMedia = _mapper.Map<CourseMedia>(dto);
                await _unitOfWork.CourseMedias.AddAsync(courseMedia);
                await _unitOfWork.CompleteAsync();

                var courseMediaDto = _mapper.Map<CourseMediaDto>(courseMedia);
                return BaseResponse<CourseMediaDto>.Ok(courseMediaDto, "Course media created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseMediaDto>.Fail($"Error creating course media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseMediaDto>> UpdateCourseMediaAsync(Guid id, UpdateCourseMediaDto dto)
        {
            try
            {
                var courseMedia = await _unitOfWork.CourseMedias.GetByIdAsync(id);
                if (courseMedia == null)
                {
                    return BaseResponse<CourseMediaDto>.Fail("Course media not found");
                }

                _mapper.Map(dto, courseMedia);
                _unitOfWork.CourseMedias.Update(courseMedia);
                await _unitOfWork.CompleteAsync();

                var courseMediaDto = _mapper.Map<CourseMediaDto>(courseMedia);
                return BaseResponse<CourseMediaDto>.Ok(courseMediaDto, "Course media updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseMediaDto>.Fail($"Error updating course media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteCourseMediaAsync(Guid id)
        {
            try
            {
                var courseMedia = await _unitOfWork.CourseMedias.GetByIdAsync(id);
                if (courseMedia == null)
                {
                    return BaseResponse<bool>.Fail("Course media not found");
                }

                _unitOfWork.CourseMedias.Delete(courseMedia);
                await _unitOfWork.CompleteAsync();

                return BaseResponse<bool>.Ok(true, "Course media deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting course media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreCourseMediaAsync(Guid id)
        {
            try
            {
                var courseMedia = await _unitOfWork.CourseMedias.GetByIdAsync(id);
                if (courseMedia == null)
                {
                    return BaseResponse<bool>.Fail("Course media not found");
                }

                _unitOfWork.CourseMedias.Restore(courseMedia);
                await _unitOfWork.CompleteAsync();

                return BaseResponse<bool>.Ok(true, "Course media restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring course media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetCourseMediasByCourseIdAsync(Guid courseId)
        {
            try
            {
                var courseMedias = await _unitOfWork.CourseMedias.GetByCourseIdAsync(courseId);
                var courseMediaDtos = _mapper.Map<IEnumerable<CourseMediaDto>>(courseMedias);
                return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(courseMediaDtos, "Course medias retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseMediaDto>>.Fail($"Error retrieving course medias: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetCourseMediasByMediaTypeAsync(MediaType mediaType)
        {
            try
            {
                var courseMedias = await _unitOfWork.CourseMedias.GetByMediaTypeAsync(mediaType);
                var courseMediaDtos = _mapper.Map<IEnumerable<CourseMediaDto>>(courseMedias);
                return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(courseMediaDtos, "Course medias retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseMediaDto>>.Fail($"Error retrieving course medias: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetCourseMediasByStatusAsync(MediaStatus status)
        {
            try
            {
                var courseMedias = await _unitOfWork.CourseMedias.GetByStatusAsync(status);
                var courseMediaDtos = _mapper.Map<IEnumerable<CourseMediaDto>>(courseMedias);
                return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(courseMediaDtos, "Course medias retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseMediaDto>>.Fail($"Error retrieving course medias: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CourseMediaDto>> GetPrimaryMediaByCourseIdAsync(Guid courseId)
        {
            try
            {
                var courseMedia = await _unitOfWork.CourseMedias.GetPrimaryMediaByCourseIdAsync(courseId);
                if (courseMedia == null)
                {
                    return BaseResponse<CourseMediaDto>.Fail("Primary media not found for this course");
                }

                var courseMediaDto = _mapper.Map<CourseMediaDto>(courseMedia);
                return BaseResponse<CourseMediaDto>.Ok(courseMediaDto, "Primary media retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CourseMediaDto>.Fail($"Error retrieving primary media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> SetPrimaryMediaAsync(Guid mediaId, Guid courseId)
        {
            try
            {
                var result = await _unitOfWork.CourseMedias.SetPrimaryMediaAsync(mediaId, courseId);
                if (result)
                {
                    return BaseResponse<bool>.Ok(true, "Primary media set successfully");
                }
                return BaseResponse<bool>.Fail("Failed to set primary media");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error setting primary media: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetActiveMediaByCourseIdAsync(Guid courseId)
        {
            try
            {
                var courseMedias = await _unitOfWork.CourseMedias.GetActiveMediaByCourseIdAsync(courseId);
                var courseMediaDtos = _mapper.Map<IEnumerable<CourseMediaDto>>(courseMedias);
                return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(courseMediaDtos, "Active course medias retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseMediaDto>>.Fail($"Error retrieving active course medias: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CourseMediaDto>>> GetMediaByCourseIdAndTypeAsync(Guid courseId, MediaType mediaType)
        {
            try
            {
                var courseMedias = await _unitOfWork.CourseMedias.GetMediaByCourseIdAndTypeAsync(courseId, mediaType);
                var courseMediaDtos = _mapper.Map<IEnumerable<CourseMediaDto>>(courseMedias);
                return BaseResponse<IEnumerable<CourseMediaDto>>.Ok(courseMediaDtos, "Course medias retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CourseMediaDto>>.Fail($"Error retrieving course medias: {ex.Message}");
            }
        }

        public async Task<bool> CourseMediaExistsAsync(Guid id)
        {
            try
            {
                var courseMedia = await _unitOfWork.CourseMedias.GetByIdAsync(id);
                return courseMedia != null;
            }
            catch
            {
                return false;
            }
        }
    }
}
