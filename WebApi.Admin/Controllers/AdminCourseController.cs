using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Admin.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class AdminCourseController : BaseAdminController<AdminCourseController>
    {
        private readonly ICourseService _courseService;

        public AdminCourseController(ICourseService courseService, ILogger<AdminCourseController> logger)
            : base(logger)
        {
            _courseService = courseService;
        }

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] Guid? categoryId = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? minDurationInMinutes = null,
            [FromQuery] int? maxDurationInMinutes = null,
            [FromQuery] DateTime? createdFrom = null,
            [FromQuery] DateTime? createdTo = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] bool isDescending = true,
            [FromQuery] bool includeDeleted = false,
            [FromQuery] bool onlyPublished = false,
            [FromQuery] bool onlyDraft = false,
            [FromQuery] string? level = null,
            [FromQuery] string? language = null)
        {
            // Convert level string to enum number
            int? levelValue = null;
            if (!string.IsNullOrEmpty(level))
            {
                levelValue = level switch
                {
                    "Beginner" => 0,
                    "Intermediate" => 1,
                    "Advanced" => 2,
                    _ => null
                };
            }

            // Convert language string to enum number
            int? languageValue = null;
            if (!string.IsNullOrEmpty(language))
            {
                languageValue = language switch
                {
                    "Vi" => 0,
                    "En" => 1,
                    _ => null
                };
            }

            var query = new QueryParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Keyword = keyword,
                CategoryId = categoryId,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                MinDurationInMinutes = minDurationInMinutes,
                MaxDurationInMinutes = maxDurationInMinutes,
                CreatedFrom = createdFrom,
                CreatedTo = createdTo,
                SortBy = sortBy,
                IsDescending = isDescending,
                IncludeDeleted = includeDeleted,
                OnlyPublished = onlyPublished,
                OnlyDraft = onlyDraft,
                Level = levelValue,
                Language = languageValue
            };

            var result = await _courseService.GetAllCoursesAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CourseDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDetailsDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<CourseDto>.Fail(GetModelErrors()));
            }

            var validator = new CreateCourseValidator();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                return BadRequest(BaseResponse<CourseDto>.Fail(errors));
            }

            var result = await _courseService.CreateCourseAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCourseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(BaseResponse<CourseDto>.Fail(GetModelErrors()));
            }

            var validator = new UpdateCourseValidator();
            var validationResult = await validator.ValidateAsync(dto);

            if (!validationResult.IsValid)
            {
                var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                return BadRequest(BaseResponse<CourseDto>.Fail(errors));
            }

            var result = await _courseService.UpdateCourseAsync(id, dto);
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
            var result = await _courseService.DeleteCourseAsync(id);
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
            var result = await _courseService.RestoreCourseAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Index
        [HttpPost("index")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> IndexCourses()
        {
            var result = await _courseService.IndexAllCoursesAsync();
            return HandleResponse(result);
        }
        #endregion
    }
}

