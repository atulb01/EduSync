using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EduSyncWebAPI.Data;
using EduSyncWebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using EduSyncWebAPI.DTO;

namespace EduSyncWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<UserModel> _hasher = new();

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if (await _context.UserModels.AnyAsync(u => u.Email == model.Email))
                return BadRequest("Email already exists");

            var user = new UserModel
            {
                UserId = Guid.NewGuid(),
                Name = model.Name,
                Email = model.Email,
                Role = model.Role
            };
            user.PasswordHash = _hasher.HashPassword(user, model.Password);

            _context.UserModels.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                token = GenerateJwtToken(user),
                user = new
                {
                    user.UserId,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _context.UserModels.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
            if (result != PasswordVerificationResult.Success)
                return Unauthorized("Invalid credentials");

            return Ok(new
            {
                token = GenerateJwtToken(user),
                user = new
                {
                    user.UserId,
                    user.Name,
                    user.Email,
                    user.Role
                }
            });
        }

        private string GenerateJwtToken(UserModel user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("userId", user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
