using Elearn.Application.Common;
using Elearn.Application.DTOs.Category;

namespace Elearn.Application.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<BaseResponse<IEnumerable<CategoryDto>>> GetAllCategoriesAsync(QueryParameters? parameters = null);
        Task<BaseResponse<CategoryDetailsDto>> GetCategoryByIdAsync(Guid id);
        Task<BaseResponse<CategoryDetailsDto>> GetCategoryByNameAsync(string name);
        Task<BaseResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto dto);
        Task<BaseResponse<CategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryDto dto);
        Task<BaseResponse<bool>> DeleteCategoryAsync(Guid id);
        Task<BaseResponse<bool>> RestoreCategoryAsync(Guid id);
        Task<BaseResponse<IEnumerable<CategoryDto>>> SearchCategoriesAsync(string keyword);
        Task<BaseResponse<IEnumerable<CategoryDto>>> GetCategoriesWithCoursesAsync();
        Task<BaseResponse<IEnumerable<CategoryDto>>> GetCategoriesWithActiveCoursesAsync();
        Task<BaseResponse<IEnumerable<CategoryDto>>> GetDeletedCategoriesAsync();
        Task<BaseResponse<IEnumerable<CategoryDto>>> GetRootCategoriesAsync();
        Task<BaseResponse<IEnumerable<CategoryDto>>> GetSubCategoriesAsync(Guid parentId);
        Task<BaseResponse<CategoryDetailsDto>> GetCategoryWithHierarchyAsync(Guid id);
        Task<bool> CategoryExistsAsync(Guid id);
        Task<bool> CategoryExistsByNameAsync(string name);
    }
}
