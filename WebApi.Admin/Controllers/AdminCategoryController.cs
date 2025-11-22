using Elearn.Application.Common;
using Elearn.Application.DTOs.Category;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "TenantAdminOnly")]
    public class AdminCategoryController : BaseAdminController<AdminCategoryController>
    {
        private readonly ICategoryService _categoryService;

        public AdminCategoryController(ICategoryService categoryService, ILogger<AdminCategoryController> logger)
            : base(logger)
        {
            _categoryService = categoryService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<CategoryDto>.Fail(GetModelErrors()));
            }

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

        #region Update
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<CategoryDto>.Fail(GetModelErrors()));
            }

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
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Restore(Guid id)
        {
            var result = await _categoryService.RestoreCategoryAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetDeleted
        [HttpGet("deleted")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetDeleted()
        {
            var result = await _categoryService.GetDeletedCategoriesAsync();
            return HandleResponse(result);
        }
        #endregion

        #region GetRootCategories
        [HttpGet("root")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetRootCategories()
        {
            var result = await _categoryService.GetRootCategoriesAsync();
            return HandleResponse(result);
        }
        #endregion

        #region GetSubCategories
        [HttpGet("{parentId:guid}/subcategories")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CategoryDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetSubCategories(Guid parentId)
        {
            var result = await _categoryService.GetSubCategoriesAsync(parentId);
            return HandleResponse(result);
        }
        #endregion

        #region GetWithHierarchy
        [HttpGet("{id:guid}/hierarchy")]
        [ProducesResponseType(typeof(BaseResponse<CategoryDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CategoryDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetWithHierarchy(Guid id)
        {
            var result = await _categoryService.GetCategoryWithHierarchyAsync(id);
            return HandleResponse(result);
        }
        #endregion
    }
}

