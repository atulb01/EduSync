using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[Route("api/[controller]")]
[ApiController]
public class CourseContentController : ControllerBase
{
    private readonly IConfiguration _config;
    public CourseContentController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadContent([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var containerName = "course-content";
        var connectionString = _config["AzureBlob:ConnectionString"];
        var blobClient = new BlobContainerClient(connectionString, containerName);

        await blobClient.CreateIfNotExistsAsync();

        var blob = blobClient.GetBlobClient(file.FileName);
        using var stream = file.OpenReadStream();
        await blob.UploadAsync(stream, overwrite: true);

        return Ok(new { url = blob.Uri.ToString() });
    }
}
