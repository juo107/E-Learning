using AutoMapper;
using Elearn.Application.Common;
using Elearn.Application.DTOs.Category;
using Elearn.Application.Services.Interfaces;
using Elearn.Domain.Entities;
using Elearn.Infrastructure.Repository;

namespace Elearn.Application.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponse<IEnumerable<CategoryDto>>> GetAllCategoriesAsync(QueryParameters? parameters = null)
        {
            try
            {
                var categories = await _unitOfWork.Categories.GetAllAsync();
                
                // Apply filtering by keyword if provided
                if (parameters != null && !string.IsNullOrWhiteSpace(parameters.Keyword))
                {
                    categories = categories.Where(c => 
                        c.Name.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase) ||
                        (c.Description != null && c.Description.Contains(parameters.Keyword, StringComparison.OrdinalIgnoreCase)));
                }

                // Apply sorting
                if (parameters != null)
                {
                    categories = parameters.SortBy?.ToLower() switch
                    {
                        "name" => parameters.IsDescending ? categories.OrderByDescending(c => c.Name) : categories.OrderBy(c => c.Name),
                        "description" => parameters.IsDescending ? categories.OrderByDescending(c => c.Description) : categories.OrderBy(c => c.Description),
                        "createdat" => parameters.IsDescending ? categories.OrderByDescending(c => c.CreatedAt) : categories.OrderBy(c => c.CreatedAt),
                        _ => parameters.IsDescending ? categories.OrderByDescending(c => c.CreatedAt) : categories.OrderBy(c => c.CreatedAt)
                    };

                    // Apply pagination
                    categories = categories
                        .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                        .Take(parameters.PageSize);
                }

                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                return BaseResponse<IEnumerable<CategoryDto>>.Ok(categoryDtos, "Categories retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CategoryDto>>.Fail($"Error retrieving categories: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CategoryDto>> GetCategoryByIdAsync(Guid id)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                    return BaseResponse<CategoryDto>.Fail("Category not found");

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return BaseResponse<CategoryDto>.Ok(categoryDto, "Category retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CategoryDto>.Fail($"Error retrieving category: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CategoryDto>> GetCategoryByNameAsync(string name)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByNameAsync(name);
                if (category == null)
                    return BaseResponse<CategoryDto>.Fail("Category not found");

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return BaseResponse<CategoryDto>.Ok(categoryDto, "Category retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CategoryDto>.Fail($"Error retrieving category: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto dto)
        {
            try
            {
                // Validate input
                if (dto == null)
                    return BaseResponse<CategoryDto>.Fail("Category data is required");

                if (string.IsNullOrWhiteSpace(dto.Name))
                    return BaseResponse<CategoryDto>.Fail("Category name is required");

                // Check if category name already exists
                if (await CategoryExistsByNameAsync(dto.Name))
                    return BaseResponse<CategoryDto>.Fail("Category with this name already exists");

                var category = _mapper.Map<Category>(dto);
                category.CreatedAt = DateTime.UtcNow;
                category.CreatedBy = "System"; // TODO: Get from current user context

                await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.CompleteAsync();

                var categoryDto = _mapper.Map<CategoryDto>(category);
                return BaseResponse<CategoryDto>.Ok(categoryDto, "Category created successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CategoryDto>.Fail($"Error creating category: {ex.Message}");
            }
        }

        public async Task<BaseResponse<CategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryDto dto)
        {
            try
            {
                // Validate input
                if (dto == null)
                    return BaseResponse<CategoryDto>.Fail("Category data is required");

                if (string.IsNullOrWhiteSpace(dto.Name))
                    return BaseResponse<CategoryDto>.Fail("Category name is required");

                var existing = await _unitOfWork.Categories.GetByIdAsync(id);
                if (existing == null)
                    return BaseResponse<CategoryDto>.Fail("Category not found");

                // Check if another category with the same name exists (excluding current one)
                var existingByName = await _unitOfWork.Categories.GetByNameAsync(dto.Name);
                if (existingByName != null && existingByName.Id != id)
                    return BaseResponse<CategoryDto>.Fail("Category with this name already exists");

                // Update properties
                existing.Name = dto.Name;
                existing.Description = dto.Description;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.UpdatedBy = "System"; // TODO: Get from current user context

                _unitOfWork.Categories.Update(existing);
                await _unitOfWork.CompleteAsync();

                var categoryDto = _mapper.Map<CategoryDto>(existing);
                return BaseResponse<CategoryDto>.Ok(categoryDto, "Category updated successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<CategoryDto>.Fail($"Error updating category: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteCategoryAsync(Guid id)
        {
            try
            {
                var existing = await _unitOfWork.Categories.GetByIdAsync(id);
                if (existing == null)
                    return BaseResponse<bool>.Fail("Category not found");

                // Soft delete - chỉ đánh dấu IsDeleted = true
                existing.IsDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
                existing.UpdatedBy = "System"; // TODO: Get from current user context
                
                _unitOfWork.Categories.Update(existing);
                await _unitOfWork.CompleteAsync();

                return BaseResponse<bool>.Ok(true, "Category deleted successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error deleting category: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> RestoreCategoryAsync(Guid id)
        {
            try
            {
                var restored = await _unitOfWork.Categories.RestoreCategoryAsync(id);
                if (!restored)
                    return BaseResponse<bool>.Fail("Category not found or not deleted");

                return BaseResponse<bool>.Ok(true, "Category restored successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail($"Error restoring category: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CategoryDto>>> SearchCategoriesAsync(string keyword)
        {
            try
            {
                var categories = await _unitOfWork.Categories.SearchCategoriesAsync(keyword);
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                return BaseResponse<IEnumerable<CategoryDto>>.Ok(categoryDtos, "Categories retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CategoryDto>>.Fail($"Error searching categories: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CategoryDto>>> GetCategoriesWithCoursesAsync()
        {
            try
            {
                var categories = await _unitOfWork.Categories.GetCategoriesWithCoursesAsync();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                return BaseResponse<IEnumerable<CategoryDto>>.Ok(categoryDtos, "Categories retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CategoryDto>>.Fail($"Error retrieving categories: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CategoryDto>>> GetCategoriesWithActiveCoursesAsync()
        {
            try
            {
                var categories = await _unitOfWork.Categories.GetCategoriesWithActiveCoursesAsync();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                return BaseResponse<IEnumerable<CategoryDto>>.Ok(categoryDtos, "Categories retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CategoryDto>>.Fail($"Error retrieving categories: {ex.Message}");
            }
        }

        public async Task<BaseResponse<IEnumerable<CategoryDto>>> GetDeletedCategoriesAsync()
        {
            try
            {
                var categories = await _unitOfWork.Categories.GetDeletedCategoriesAsync();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                return BaseResponse<IEnumerable<CategoryDto>>.Ok(categoryDtos, "Deleted categories retrieved successfully");
            }
            catch (Exception ex)
            {
                return BaseResponse<IEnumerable<CategoryDto>>.Fail($"Error retrieving deleted categories: {ex.Message}");
            }
        }

        public async Task<bool> CategoryExistsAsync(Guid id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            return category != null;
        }

        public async Task<bool> CategoryExistsByNameAsync(string name)
        {
            return await _unitOfWork.Categories.ExistsByNameAsync(name);
        }
    }
}
