using Elearn.Application.Common;
using Elearn.Application.DTOs.Course;
using Elearn.Application.Services.Interfaces;
using Elearn.Application.Validations;
using Microsoft.AspNetCore.Mvc;

namespace Elearn.WebAPI.Controllers
{
    public class CourseController : BaseApiController<CourseController>
    {
        private readonly ICourseService _courseService;
        private readonly ISectionService _sectionService;

        public CourseController(ICourseService courseService, ISectionService sectionService, ILogger<CourseController> logger)
            : base(logger)
        {
            _courseService = courseService;
            _sectionService = sectionService;
        }

        #region Create
        [HttpPost]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            // Sử dụng FluentValidation
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

        #region GetAll
        [HttpGet]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 300, // 5 phút - cache response trong 5 phút
            Location = ResponseCacheLocation.Any, // Cache cả client và server
            VaryByQueryKeys = new[] { "pageNumber", "pageSize", "keyword", "categoryId", "minPrice", "maxPrice", "minDurationInMinutes", "maxDurationInMinutes", "sortBy", "isDescending" } // Cache riêng cho mỗi bộ query parameters
        )]
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
            [FromQuery] bool isDescending = true)
        {
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
                OnlyPublished = true // Public API only returns published courses
            };

            var result = await _courseService.GetAllCoursesAsync(query);
            return HandleResponse(result);
        }
        #endregion

        #region Autocomplete
        [HttpGet("autocomplete")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<string>>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 300, // 5 phút
            Location = ResponseCacheLocation.Any,
            VaryByQueryKeys = new[] { "prefix", "size" }
        )]
        public async Task<IActionResult> Autocomplete([FromQuery] string prefix, [FromQuery] int size = 10)
        {
            var result = await _courseService.AutocompleteCoursesAsync(prefix, size);
            return HandleResponse(result);
        }
        #endregion

        #region Search
        [HttpGet("search")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 300, // 5 phút
            Location = ResponseCacheLocation.Any,
            VaryByQueryKeys = new[] { "keyword" }
        )]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var result = await _courseService.SearchCoursesAsync(keyword);
            return HandleResponse(result);
        }
        #endregion

        #region GetById
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CourseDetailsDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDetailsDto>), StatusCodes.Status404NotFound)]
        [ResponseCache(
            Duration = 600, // 10 phút - course details ít thay đổi hơn
            Location = ResponseCacheLocation.Any
            // Route values (id) tự động được dùng để tạo cache key riêng cho mỗi course
        )]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region GetSections
        /// <summary>
        /// Get all sections with lectures for a course (Public API)
        /// </summary>
        [HttpGet("{id:guid}/sections")]
        [ProducesResponseType(typeof(BaseResponse<IEnumerable<object>>), StatusCodes.Status200OK)]
        [ResponseCache(
            Duration = 600, // 10 phút
            Location = ResponseCacheLocation.Any
        )]
        public async Task<IActionResult> GetSections(Guid id)
        {
            var sectionsResult = await _sectionService.GetSectionsByCourseIdAsync(id);
            if (!sectionsResult.Success || sectionsResult.Data == null)
            {
                return HandleResponse(sectionsResult);
            }

            // Get detailed sections with lectures
            var sectionsWithLectures = new List<object>();
            foreach (var section in sectionsResult.Data)
            {
                var sectionDetailsResult = await _sectionService.GetSectionByIdAsync(section.Id);
                if (sectionDetailsResult.Success && sectionDetailsResult.Data != null)
                {
                    var lecturesList = sectionDetailsResult.Data.Lectures != null
                        ? sectionDetailsResult.Data.Lectures.Select(l => new
                        {
                            id = l.Id,
                            sectionId = l.SectionId,
                            title = l.Title,
                            type = l.Type,
                            duration = l.Duration,
                            videoUrl = l.VideoUrl,
                            content = l.Content,
                            orderIndex = l.OrderIndex,
                            isPreviewable = l.IsPreviewable,
                            resourcesCount = l.ResourcesCount,
                            createdAt = l.CreatedAt,
                            updatedAt = l.UpdatedAt
                        }).Cast<object>().ToList()
                        : new List<object>();

                    sectionsWithLectures.Add(new
                    {
                        id = sectionDetailsResult.Data.Id,
                        courseId = sectionDetailsResult.Data.CourseId,
                        title = sectionDetailsResult.Data.Title,
                        description = sectionDetailsResult.Data.Description,
                        orderIndex = sectionDetailsResult.Data.OrderIndex,
                        isPreviewable = sectionDetailsResult.Data.IsPreviewable,
                        lecturesCount = sectionDetailsResult.Data.LecturesCount,
                        createdAt = sectionDetailsResult.Data.CreatedAt,
                        updatedAt = sectionDetailsResult.Data.UpdatedAt,
                        lectures = lecturesList
                    });
                }
            }

            return Ok(BaseResponse<object>.Ok(sectionsWithLectures, "Sections retrieved successfully"));
        }
        #endregion

        #region Update
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(BaseResponse<CourseDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCourseDto dto)
        {
            // Sử dụng FluentValidation
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
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            return HandleResponse(result);
        }
        #endregion

        #region Index
        [HttpPost("index")]
        [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> IndexCourses()
        {
            var result = await _courseService.IndexAllCoursesAsync();
            return HandleResponse(result);
        }
        #endregion

        #region Admin - Assign Instructors
        /// <summary>
        /// Gán instructor cho các courses chưa có instructor (Admin only)
        /// </summary>
        [HttpPost("admin/assign-instructors")]
        [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status200OK)]
        public async Task<IActionResult> AssignInstructorsToCourses()
        {
            var result = await _courseService.AssignInstructorsToCoursesAsync();
            return HandleResponse(result);
        }
        #endregion
    }
}
