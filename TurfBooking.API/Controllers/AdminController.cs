using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurfBooking.API.Data;
using TurfBooking.API.Models;

namespace TurfBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Entire controller is restricted to admins
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: List all users (excluding existing admins)
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => u.Role != "Admin")
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.PhoneNumber,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // ✅ PUT: Promote a user to admin
        [HttpPut("promote/{id}")]
        public async Task<ActionResult> PromoteToAdmin(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            if (user.Role == "Admin")
                return BadRequest("User is already an admin");

            user.Role = "Admin";
            await _context.SaveChangesAsync();

            return Ok($"{user.Username} has been promoted to Admin");
        }
    }
}
