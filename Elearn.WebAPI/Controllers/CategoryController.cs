using Elearn.Application.Common;
using Elearn.Application.DTOs.Category;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Validations;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    public class CategoryController : BaseApiController<CategoryController>
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
            : base(logger)
        {
            _categoryService = categoryService;
        }

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            // Sử dụng FluentValidation
            var validator = new CreateCategoryValidator();
            var validationResult = await validator.ValidateAsync(dto);
            
            if (!validationResult.IsValid)
            {
                var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                return BadRequest(BaseResponse<CategoryDto>.Fail(errors));
            }

            var result = await _categoryService.CreateCategoryAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] bool isDescending = true)
        {
            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Keyword = keyword,
                SortBy = sortBy,
                IsDescending = isDescending
            };

            var result = await _categoryService.GetAllCategoriesAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CategoryDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDetailsDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetByName
        [HttpGet("name/{name}")]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByName(string name)
        {
            var result = await _categoryService.GetCategoryByNameAsync(name);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
        {
            // Sử dụng FluentValidation
            var validator = new UpdateCategoryValidator();
            var validationResult = await validator.ValidateAsync(dto);
            
            if (!validationResult.IsValid)
            {
                var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                return BadRequest(BaseResponse<CategoryDto>.Fail(errors));
            }

            var result = await _categoryService.UpdateCategoryAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Restore
        [HttpPost("{id:guid}/restore")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Restore(Guid id)
        {
            var result = await _categoryService.RestoreCategoryAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Search
        [HttpGet("search")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var result = await _categoryService.SearchCategoriesAsync(keyword);
            return HandleResponse(result);
        }
        #endregion

        #region GetWithCourses
        [HttpGet("with-courses")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetWithCourses()
        {
            var result = await _categoryService.GetCategoriesWithCoursesAsync();
            return HandleResponse(result);
        }
        #endregion

        #region GetWithActiveCourses
        [HttpGet("with-active-courses")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetWithActiveCourses()
        {
            var result = await _categoryService.GetCategoriesWithActiveCoursesAsync();
            return HandleResponse(result);
        }
        #endregion

        #region GetDeleted
        [HttpGet("deleted")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDeleted()
        {
            var result = await _categoryService.GetDeletedCategoriesAsync();
            return HandleResponse(result);
        }
        #endregion

        #region GetRootCategories (for Mega Menu)
        [HttpGet("root")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 600, // 10 phút - categories ít thay đổi hơn nên cache lâu hơn
            Location = ResponseCacheLocation.Any // Cache cả client và server
        )]
        public async Task<IActionResult> GetRootCategories()
        {
            var result = await _categoryService.GetRootCategoriesAsync();
            return HandleResponse(result);
        }
        #endregion
    }
}
