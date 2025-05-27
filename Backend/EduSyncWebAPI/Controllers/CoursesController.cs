using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EduSyncWebAPI.Data;
using EduSyncWebAPI.Models;
using EduSyncWebAPI.DTO;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;


namespace EduSyncWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public CoursesController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses.ToListAsync();
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }

        // PUT: api/Courses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(Guid id, CourseDTO course)
        {
            if (id != course.CourseId)
            {
                return BadRequest();
            }

            Course originalCourse = new Course()
            {
                CourseId = course.CourseId,
                Title = course.Title,
                Description = course.Description,
                InstructorId = course.InstructorId,
                MediaUrl = course.MediaUrl
            };

            _context.Entry(originalCourse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Courses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(CourseDTO course)
        {
            Course originalCourse = new Course()
            {
                CourseId = course.CourseId,
                Title = course.Title,
                Description = course.Description,
                InstructorId = course.InstructorId,
                MediaUrl = course.MediaUrl
            };

            _context.Courses.Add(originalCourse);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourse", new { id = originalCourse.CourseId }, originalCourse);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            // 🔥 Step 1: Delete file from Azure Blob if MediaUrl exists
            if (!string.IsNullOrWhiteSpace(course.MediaUrl))
            {
                try
                {
                    var connectionString = _config["AzureBlob:ConnectionString"];
                    var containerName = "course-content"; // MUST match actual Azure container name

                    var blobContainerClient = new BlobContainerClient(connectionString, containerName);

                    // ✅ Extract file name from URL
                    var fileName = Path.GetFileName(new Uri(course.MediaUrl).LocalPath);

                    if (!string.IsNullOrEmpty(fileName))
                    {
                        var blobClient = blobContainerClient.GetBlobClient(fileName);
                        var deleted = await blobClient.DeleteIfExistsAsync();

                        Console.WriteLine(deleted ? $"✅ Blob deleted: {fileName}" : $"⚠️ Blob not found: {fileName}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("⚠️ Blob deletion error: " + ex.Message);
                    // Don't fail the course deletion just because blob deletion failed
                }
            }

            // 🧹 Step 2: Remove course from DB
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }
    }
}
