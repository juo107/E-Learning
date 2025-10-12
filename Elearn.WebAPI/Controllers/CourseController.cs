using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    public class CourseController : BaseApiController<CourseController>
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService, ILogger<CourseController> logger)
            : base(logger)
        {
            _courseService = courseService;
        }

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(BaseResponse<CourseDto>.Fail(GetModelErrors()));

            var result = await _courseService.CreateCourseAsync(dto);
            return HandleResponse(result);
        }
        #endregion

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
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

            var result = await _courseService.GetAllCoursesAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Update
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCourseDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(BaseResponse<CourseDto>.Fail(GetModelErrors()));

            var result = await _courseService.UpdateCourseAsync(id, dto);
            return HandleResponse(result);
        }
        #endregion

        #region Delete
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            return HandleResponse(result);
        }
        #endregion
    }
}
