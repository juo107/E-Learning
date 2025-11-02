using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Promotion;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Domain.Entities.Enums;
using Elearn.Infrastructure.Repository;
using Elearn.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace Elearn.Application.Services.Implementations
{
    public class PromotionService : IPromotionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IRedisCacheService _cache;

        public PromotionService(IUnitOfWork unitOfWork, IMapper mapper, IRedisCacheService cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<BaseResponse<IEnumerable<PromotionDto>>> GetAllPromotionsAsync(QueryParameters? parameters = null)
        {
            try
            {
                if (parameters == null)
                {
                    parameters = new QueryParameters();
                }

                var cacheKey = $"promotions:list:{parameters.PageNumber}:{parameters.PageSize}:{parameters.Keyword}:{parameters.SortBy}:{parameters.IsDescending}";
                
                var cachedPromotions = await _cache.GetAsync<IEnumerable<PromotionDto>>(cacheKey);
                if (cachedPromotions != null)
                {
                    return BaseResponse<IEnumerable<PromotionDto>>.Ok(cachedPromotions, "Promotions retrieved from cache");
                }

                var promotions = await _unitOfWork.Promotions.GetAllWithIncludesAsync(
                    p => p.Category, 
                    p => p.PromotionCourses);

                // Apply filtering by keyword if provided
                if (!string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    promotions = promotions.Where(p => 
                        p.Name.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        (p.Description != null && p.Description.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase)) ||
                        (p.Code != null && p.Code.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase)));
                }

                // Apply sorting
                promotions = parameters.SortBy?.ToLower() switch
                {
                    "name" => parameters.IsDescending ? promotions.OrderByDescending(p => p.Name) : promotions.OrderBy(p => p.Name),
                    "startdate" => parameters.IsDescending ? promotions.OrderByDescending(p => p.StartDate) : promotions.OrderBy(p => p.StartDate),
                    "enddate" => parameters.IsDescending ? promotions.OrderByDescending(p => p.EndDate) : promotions.OrderBy(p => p.EndDate),
                    "value" => parameters.IsDescending ? promotions.OrderByDescending(p => p.Value) : promotions.OrderBy(p => p.Value),
                    "createdat" => parameters.IsDescending ? promotions.OrderByDescending(p => p.CreatedAt) : promotions.OrderBy(p => p.CreatedAt),
                    _ => parameters.IsDescending ? promotions.OrderByDescending(p => p.CreatedAt) : promotions.OrderBy(p => p.CreatedAt)
                };

                // Apply pagination
                var totalCount = promotions.Count();
                promotions = promotions
                    .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                    .Take(parameters.PageSize);

                var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(promotions);
                
                // Map CourseIds
                foreach (var dto in promotionDtos)
                {
                    var promotion = promotions.FirstOrDefault(p => p.Id == dto.Id);
                    if (promotion != null && promotion.PromotionCourses.Any())
                    {
                        dto.CourseIds = promotion.PromotionCourses.Select(pc => pc.CourseId).ToList();
                    }
                }

                await _cache.SetAsync(cacheKey, promotionDtos, TimeSpan.FromSeconds(30));
                
                return BaseResponse<IEnumerable<PromotionDto>>.Ok(promotionDtos, $"Promotions retrieved successfully. Total: {totalCount}.");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<PromotionDto>>.Fail($"Error retrieving promotions: {ex.Message}");
            }
        }

        public async Task<BaseResponse<PromotionDto>> GetPromotionByIdAsync(Guid id)
        {
            try
            {
                var cacheKey = $"promotion:{id}";
                var cachedPromotion = await _cache.GetAsync<PromotionDto>(cacheKey);
                if (cachedPromotion != null)
                {
                    return BaseResponse<PromotionDto>.Ok(cachedPromotion, "Promotion retrieved from cache");
                }

                var promotion = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                    id, 
                    p => p.Category, 
                    p => p.PromotionCourses);
                
                if (promotion == null)
                    return BaseResponse<PromotionDto>.Fail("Promotion not found");

                var promotionDto = _mapper.Map<PromotionDto>(promotion);
                promotionDto.CourseIds = promotion.PromotionCourses.Select(pc => pc.CourseId).ToList();
                
                await _cache.SetAsync(cacheKey, promotionDto, TimeSpan.FromMinutes(30));
                
                return BaseResponse<PromotionDto>.Ok(promotionDto, "Promotion retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<PromotionDto>.Fail($"Error retrieving promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<PromotionDto>> CreatePromotionAsync(CreatePromotionDto dto)
        {
            try
            {
                // Validate dates
                if (dto.StartDate >= dto.EndDate)
                {
                    return BaseResponse<PromotionDto>.Fail("Start date must be before end date");
                }

                // Validate code uniqueness if provided
                if (!string.IsNullOrWhiteSpace(dto.Code))
                {
                    var existingPromotion = await _unitOfWork.Promotions.FindAsync(p => p.Code == dto.Code && !p.IsDeleted);
                    if (existingPromotion.Any())
                    {
                        return BaseResponse<PromotionDto>.Fail("Promotion code already exists");
                    }
                }

                // Validate category exists if provided
                if (dto.CategoryId.HasValue && dto.Scope == PromotionScope.Category)
                {
                    var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId.Value);
                    if (category == null)
                    {
                        return BaseResponse<PromotionDto>.Fail("Category not found");
                    }
                }

                var promotion = _mapper.Map<Promotion>(dto);
                promotion.Id = Guid.NewGuid();
                promotion.CreatedAt = DateTime.UtcNow;

                // Handle specific courses if Scope = SpecificCourses
                if (dto.Scope == PromotionScope.SpecificCourses && dto.CourseIds != null && dto.CourseIds.Any())
                {
                    foreach (var courseId in dto.CourseIds)
                    {
                        var course = await _unitOfWork.Courses.GetByIdAsync(courseId);
                        if (course == null)
                        {
                            return BaseResponse<PromotionDto>.Fail($"Course with id {courseId} not found");
                        }

                        promotion.PromotionCourses.Add(new PromotionCourse
                        {
                            Id = Guid.NewGuid(),
                            PromotionId = promotion.Id,
                            CourseId = courseId,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _unitOfWork.Promotions.AddAsync(promotion);
                await _unitOfWork.CompleteAsync();

                // Reload promotion với đầy đủ thông tin để update courses discount
                var createdPromotion = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                    promotion.Id,
                    p => p.Category,
                    p => p.PromotionCourses);

                // Cập nhật discount cho các courses nếu promotion active
                if (createdPromotion != null && createdPromotion.IsActive && 
                    createdPromotion.StartDate <= DateTime.UtcNow && 
                    createdPromotion.EndDate >= DateTime.UtcNow)
                {
                    await UpdateCoursesDiscountAsync(createdPromotion);
                }

                // Invalidate cache
                await InvalidatePromotionCacheAsync();

                var promotionDto = _mapper.Map<PromotionDto>(createdPromotion ?? promotion);
                promotionDto.CourseIds = (createdPromotion ?? promotion).PromotionCourses.Select(pc => pc.CourseId).ToList();
                promotionDto.CategoryName = (createdPromotion ?? promotion).Category?.Name;

                return BaseResponse<PromotionDto>.Ok(promotionDto, "Promotion created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<PromotionDto>.Fail($"Error creating promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<PromotionDto>> UpdatePromotionAsync(Guid id, UpdatePromotionDto dto)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                    id, 
                    p => p.Category, 
                    p => p.PromotionCourses);
                
                if (promotion == null)
                    return BaseResponse<PromotionDto>.Fail("Promotion not found");

                // Validate dates if both provided
                var startDate = dto.StartDate ?? promotion.StartDate;
                var endDate = dto.EndDate ?? promotion.EndDate;
                if (startDate >= endDate)
                {
                    return BaseResponse<PromotionDto>.Fail("Start date must be before end date");
                }

                // Validate code uniqueness if changed
                if (!string.IsNullOrWhiteSpace(dto.Code) && dto.Code != promotion.Code)
                {
                    var existingPromotion = await _unitOfWork.Promotions.FindAsync(p => p.Code == dto.Code && p.Id != id && !p.IsDeleted);
                    if (existingPromotion.Any())
                    {
                        return BaseResponse<PromotionDto>.Fail("Promotion code already exists");
                    }
                }

                // Update properties
                if (!string.IsNullOrWhiteSpace(dto.Name))
                    promotion.Name = dto.Name;
                if (dto.Description != null)
                    promotion.Description = dto.Description;
                if (dto.Type.HasValue)
                    promotion.Type = dto.Type.Value;
                if (dto.Value.HasValue)
                    promotion.Value = dto.Value.Value;
                if (dto.Scope.HasValue)
                    promotion.Scope = dto.Scope.Value;
                if (dto.CategoryId.HasValue)
                    promotion.CategoryId = dto.CategoryId;
                if (dto.StartDate.HasValue)
                    promotion.StartDate = dto.StartDate.Value;
                if (dto.EndDate.HasValue)
                    promotion.EndDate = dto.EndDate.Value;
                if (dto.MaxUsageCount.HasValue)
                    promotion.MaxUsageCount = dto.MaxUsageCount;
                if (dto.Code != null)
                    promotion.Code = dto.Code;
                if (dto.RequireCode.HasValue)
                    promotion.RequireCode = dto.RequireCode.Value;
                if (dto.IsActive.HasValue)
                    promotion.IsActive = dto.IsActive.Value;
                if (dto.MinimumOrderAmount.HasValue)
                    promotion.MinimumOrderAmount = dto.MinimumOrderAmount;
                if (dto.MaximumDiscountAmount.HasValue)
                    promotion.MaximumDiscountAmount = dto.MaximumDiscountAmount;

                promotion.UpdatedAt = DateTime.UtcNow;

                // Handle specific courses if Scope = SpecificCourses
                if (dto.Scope == PromotionScope.SpecificCourses && dto.CourseIds != null)
                {
                    // Clear existing promotion courses
                    promotion.PromotionCourses.Clear();

                    // Add new promotion courses
                    foreach (var courseId in dto.CourseIds)
                    {
                        var course = await _unitOfWork.Courses.GetByIdAsync(courseId);
                        if (course == null)
                        {
                            return BaseResponse<PromotionDto>.Fail($"Course with id {courseId} not found");
                        }

                        promotion.PromotionCourses.Add(new PromotionCourse
                        {
                            Id = Guid.NewGuid(),
                            PromotionId = promotion.Id,
                            CourseId = courseId,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _unitOfWork.CompleteAsync();

                // Cập nhật discount cho các courses nếu có thay đổi về active state, scope, value, hoặc dates
                var shouldUpdateCourses = dto.IsActive.HasValue || 
                                        dto.Value.HasValue || 
                                        dto.Scope.HasValue || 
                                        dto.StartDate.HasValue || 
                                        dto.EndDate.HasValue ||
                                        (dto.Scope == PromotionScope.SpecificCourses && dto.CourseIds != null);
                
                if (shouldUpdateCourses && promotion.IsActive && promotion.StartDate <= DateTime.UtcNow && promotion.EndDate >= DateTime.UtcNow)
                {
                    await UpdateCoursesDiscountAsync(promotion);
                }

                // Invalidate cache
                await InvalidatePromotionCacheAsync();

                var promotionDto = _mapper.Map<PromotionDto>(promotion);
                promotionDto.CourseIds = promotion.PromotionCourses.Select(pc => pc.CourseId).ToList();
                promotionDto.CategoryName = promotion.Category?.Name;

                return BaseResponse<PromotionDto>.Ok(promotionDto, "Promotion updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<PromotionDto>.Fail($"Error updating promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeletePromotionAsync(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
                if (promotion == null)
                    return BaseResponse<bool>.Fail("Promotion not found");

                // Lấy promotion với courses trước khi delete để remove discount
                var promotionWithCourses = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                    id,
                    p => p.PromotionCourses);

                promotion.IsDeleted = true;
                promotion.DeletedAt = DateTime.UtcNow;
                promotion.DeletedBy = "System"; // TODO: Get from current user context
                promotion.UpdatedAt = DateTime.UtcNow;
                
                _unitOfWork.Promotions.Update(promotion);
                await _unitOfWork.CompleteAsync();

                // Remove discount từ các courses khi delete promotion
                if (promotionWithCourses != null && promotionWithCourses.IsActive)
                {
                    await RemoveCoursesDiscountAsync(promotionWithCourses);
                }

                // Invalidate cache
                await InvalidatePromotionCacheAsync();

                return BaseResponse<bool>.Ok(true, "Promotion deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestorePromotionAsync(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
                if (promotion == null)
                    return BaseResponse<bool>.Fail("Promotion not found");

                promotion.IsDeleted = false;
                promotion.DeletedAt = null;
                promotion.DeletedBy = null;
                await _unitOfWork.CompleteAsync();

                // Invalidate cache
                await InvalidatePromotionCacheAsync();

                return BaseResponse<bool>.Ok(true, "Promotion restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> ActivatePromotionAsync(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                    id,
                    p => p.Category,
                    p => p.PromotionCourses);
                
                if (promotion == null)
                    return BaseResponse<bool>.Fail("Promotion not found");

                promotion.IsActive = true;
                await _unitOfWork.CompleteAsync();

                // Cập nhật discount cho các courses khi activate promotion
                if (promotion.StartDate <= DateTime.UtcNow && promotion.EndDate >= DateTime.UtcNow)
                {
                    await UpdateCoursesDiscountAsync(promotion);
                }

                // Invalidate cache
                await InvalidatePromotionCacheAsync();

                return BaseResponse<bool>.Ok(true, "Promotion activated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error activating promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeactivatePromotionAsync(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                    id,
                    p => p.Category,
                    p => p.PromotionCourses);
                
                if (promotion == null)
                    return BaseResponse<bool>.Fail("Promotion not found");

                promotion.IsActive = false;
                await _unitOfWork.CompleteAsync();

                // Remove discount từ các courses khi deactivate promotion
                await RemoveCoursesDiscountAsync(promotion);

                // Invalidate cache
                await InvalidatePromotionCacheAsync();

                return BaseResponse<bool>.Ok(true, "Promotion deactivated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deactivating promotion: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<PromotionDto>>> GetActivePromotionsAsync()
        {
            try
            {
                var cacheKey = "promotions:active";
                var cachedPromotions = await _cache.GetAsync<IEnumerable<PromotionDto>>(cacheKey);
                if (cachedPromotions != null)
                {
                    return BaseResponse<IEnumerable<PromotionDto>>.Ok(cachedPromotions, "Active promotions retrieved from cache");
                }

                var promotions = await _unitOfWork.Promotions.GetActivePromotionsAsync();
                var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(promotions);
                
                // Giảm cache TTL xuống 30 giây để cập nhật nhanh hơn
                await _cache.SetAsync(cacheKey, promotionDtos, TimeSpan.FromSeconds(30));
                
                return BaseResponse<IEnumerable<PromotionDto>>.Ok(promotionDtos, "Active promotions retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<PromotionDto>>.Fail($"Error retrieving active promotions: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<PromotionDto>>> GetPromotionsByCategoryAsync(Guid categoryId)
        {
            try
            {
                var promotions = await _unitOfWork.Promotions.GetPromotionsByCategoryAsync(categoryId);
                var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(promotions);
                
                return BaseResponse<IEnumerable<PromotionDto>>.Ok(promotionDtos, "Promotions retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<PromotionDto>>.Fail($"Error retrieving promotions: {ex.Message}");
            }
        }

        public async Task<bool> PromotionExistsAsync(Guid id)
        {
            var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
            return promotion != null && !promotion.IsDeleted;
        }

        private async Task InvalidatePromotionCacheAsync()
        {
            // Remove all promotion-related cache keys
            var keys = new[] { "promotions:list:*", "promotions:active", "promotion:*" };
            foreach (var pattern in keys)
            {
                await _cache.RemoveByPatternAsync(pattern);
            }
        }

        /// <summary>
        /// Cập nhật discount cho các courses dựa trên promotion
        /// </summary>
        private async Task UpdateCoursesDiscountAsync(Promotion promotion)
        {
            try
            {
                List<Course> coursesToUpdate = new List<Course>();

                if (promotion.Scope == PromotionScope.All)
                {
                    // Lấy tất cả published courses
                    var allCourses = await _unitOfWork.Courses.GetAllAsync();
                    coursesToUpdate = allCourses.Where(c => c.IsPublished && !c.IsDeleted).ToList();
                    Console.WriteLine($"[UpdateCoursesDiscount] Scope=All: Found {coursesToUpdate.Count} courses");
                }
                else if (promotion.Scope == PromotionScope.Category && promotion.CategoryId.HasValue)
                {
                    // Lấy courses trong category
                    var categoryCourses = await _unitOfWork.Courses.GetCoursesByCategoryAsync(promotion.CategoryId.Value);
                    coursesToUpdate = categoryCourses.Where(c => c.IsPublished && !c.IsDeleted).ToList();
                    Console.WriteLine($"[UpdateCoursesDiscount] Scope=Category: Found {coursesToUpdate.Count} courses for category {promotion.CategoryId}");
                }
                else if (promotion.Scope == PromotionScope.SpecificCourses)
                {
                    // Lấy courses cụ thể từ PromotionCourses
                    var promotionWithCourses = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                        promotion.Id,
                        p => p.PromotionCourses);
                    
                    if (promotionWithCourses != null && promotionWithCourses.PromotionCourses.Any())
                    {
                        foreach (var pc in promotionWithCourses.PromotionCourses)
                        {
                            var course = await _unitOfWork.Courses.GetByIdAsync(pc.CourseId);
                            if (course != null && course.IsPublished && !course.IsDeleted)
                            {
                                coursesToUpdate.Add(course);
                            }
                        }
                        Console.WriteLine($"[UpdateCoursesDiscount] Scope=SpecificCourses: Found {coursesToUpdate.Count} courses");
                    }
                }

                if (coursesToUpdate.Count == 0)
                {
                    Console.WriteLine("[UpdateCoursesDiscount] No courses to update");
                    return;
                }

                // Cập nhật discount cho từng course
                int updatedCount = 0;
                foreach (var course in coursesToUpdate)
                {
                    // Tính toán discount
                    var discountPercent = (float)promotion.Value;
                    
                    // Tính final price với giới hạn maximum discount nếu có
                    decimal discountAmount = course.Price * (decimal)(discountPercent / 100);
                    if (promotion.MaximumDiscountAmount.HasValue && discountAmount > promotion.MaximumDiscountAmount.Value)
                    {
                        discountAmount = promotion.MaximumDiscountAmount.Value;
                        discountPercent = (float)((discountAmount / course.Price) * 100);
                    }
                    
                    var finalPrice = course.Price - discountAmount;

                    // Cập nhật trực tiếp vào entity đã được track
                    course.DiscountPercent = discountPercent;
                    course.FinalPrice = finalPrice;
                    course.DiscountExpiresAt = promotion.EndDate;
                    course.UpdatedAt = DateTime.UtcNow;
                    course.UpdatedBy = "System"; // TODO: Get from current user context

                    // Mark entity as modified - Update() sẽ mark tất cả properties
                    _unitOfWork.Courses.Update(course);
                    updatedCount++;
                    
                    Console.WriteLine($"[UpdateCoursesDiscount] Updated course {course.Id}: DiscountPercent={discountPercent}, FinalPrice={finalPrice}, OriginalPrice={course.Price}");
                }

                // Save changes ngay lập tức để đảm bảo update vào DB
                var savedCount = await _unitOfWork.CompleteAsync();
                Console.WriteLine($"[UpdateCoursesDiscount] Saved {savedCount} changes for {updatedCount} courses");

                // Invalidate course cache
                await _cache.RemoveByPatternAsync("courses:*");
                foreach (var course in coursesToUpdate)
                {
                    await _cache.RemoveAsync($"course:{course.Id}");
                }
            }
            catch (Exception ex)
            {
                // Log error nhưng không throw để không làm fail promotion creation
                // TODO: Add proper logging
                Console.WriteLine($"Error updating courses discount: {ex.Message}");
            }
        }

        /// <summary>
        /// Xóa discount từ các courses khi promotion bị deactivate hoặc delete
        /// </summary>
        private async Task RemoveCoursesDiscountAsync(Promotion promotion)
        {
            try
            {
                List<Course> coursesToUpdate = new List<Course>();

                if (promotion.Scope == PromotionScope.All)
                {
                    // Lấy tất cả published courses
                    var allCourses = await _unitOfWork.Courses.GetAllAsync();
                    coursesToUpdate = allCourses.Where(c => c.IsPublished && !c.IsDeleted).ToList();
                }
                else if (promotion.Scope == PromotionScope.Category && promotion.CategoryId.HasValue)
                {
                    // Lấy courses trong category
                    var categoryCourses = await _unitOfWork.Courses.GetCoursesByCategoryAsync(promotion.CategoryId.Value);
                    coursesToUpdate = categoryCourses.Where(c => c.IsPublished && !c.IsDeleted).ToList();
                }
                else if (promotion.Scope == PromotionScope.SpecificCourses)
                {
                    // Lấy courses cụ thể từ PromotionCourses
                    var promotionWithCourses = await _unitOfWork.Promotions.GetByIdWithIncludesAsync(
                        promotion.Id,
                        p => p.PromotionCourses);
                    
                    if (promotionWithCourses != null && promotionWithCourses.PromotionCourses.Any())
                    {
                        foreach (var pc in promotionWithCourses.PromotionCourses)
                        {
                            var course = await _unitOfWork.Courses.GetByIdAsync(pc.CourseId);
                            if (course != null && course.IsPublished && !course.IsDeleted)
                            {
                                coursesToUpdate.Add(course);
                            }
                        }
                    }
                }

                // Reset discount cho từng course
                foreach (var course in coursesToUpdate)
                {
                    // Chỉ reset nếu discount hiện tại khớp với promotion này
                    // (để tránh reset discount từ promotion khác)
                    var currentDiscountPercent = (float)promotion.Value;
                    var currentDiscountAmount = course.Price * (decimal)(currentDiscountPercent / 100);
                    if (promotion.MaximumDiscountAmount.HasValue && currentDiscountAmount > promotion.MaximumDiscountAmount.Value)
                    {
                        currentDiscountAmount = promotion.MaximumDiscountAmount.Value;
                    }
                    var expectedFinalPrice = course.Price - currentDiscountAmount;

                    // Chỉ reset nếu FinalPrice khớp (có thể là từ promotion này)
                    if (course.FinalPrice.HasValue && 
                        Math.Abs(course.FinalPrice.Value - expectedFinalPrice) < 0.01m &&
                        course.DiscountExpiresAt == promotion.EndDate)
                    {
                        course.DiscountPercent = null;
                        course.FinalPrice = null;
                        course.DiscountExpiresAt = null;
                        course.UpdatedAt = DateTime.UtcNow;
                        course.UpdatedBy = "System";

                        _unitOfWork.Courses.Update(course);
                    }
                }

                await _unitOfWork.CompleteAsync();

                // Invalidate course cache
                await _cache.RemoveByPatternAsync("courses:*");
                foreach (var course in coursesToUpdate)
                {
                    await _cache.RemoveAsync($"course:{course.Id}");
                }
            }
            catch (Exception ex)
            {
                // Log error nhưng không throw
                Console.WriteLine($"Error removing courses discount: {ex.Message}");
            }
        }
    }
}

