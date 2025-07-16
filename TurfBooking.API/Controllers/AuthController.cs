using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurfBooking.API.Data;
using TurfBooking.API.DTOs;
using TurfBooking.API.Models;
using TurfBooking.API.Services;
using System.Security.Cryptography;
using System.Text;

namespace TurfBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;

            // Seed default admin if no users exist
            if (!_context.Users.Any())
            {
                CreateAdmin("admin", "9999999999", "admin@123");
            }
        }

        private void CreateAdmin(string username, string phone, string password)
        {
            CreatePasswordHash(password, out byte[] hash, out byte[] salt);

            var admin = new User
            {
                Username = username,
                PhoneNumber = phone,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = "Admin"
            };

            _context.Users.Add(admin);
            _context.SaveChanges();
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            if (await _context.Users.AnyAsync(u => u.Username == dto.Username || u.PhoneNumber == dto.PhoneNumber))
                return BadRequest("Username or phone already exists");

            CreatePasswordHash(dto.Password, out byte[] hash, out byte[] salt);

            var user = new User
            {
                Username = dto.Username,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.CreateToken(user);
            return Ok(token);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Identifier || u.PhoneNumber == dto.Identifier);

            if (user == null)
                return Unauthorized("Invalid username or phone");

            if (!VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid password");

            var token = _tokenService.CreateToken(user);
            return Ok(token);
        }

        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA512(salt);
            var computed = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computed.SequenceEqual(hash);
        }
    }
}
