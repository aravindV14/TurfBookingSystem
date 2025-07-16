using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurfBooking.API.Data; // Update namespace if different
using TurfBooking.API.Models; // Update if User model is elsewhere

namespace TurfBookingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("make-admin")]
        public async Task<IActionResult> MakeAdmin([FromBody] string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return NotFound("User not found.");

            if (user.Role == "Admin")
                return BadRequest("User is already an admin.");

            user.Role = "Admin";
            await _context.SaveChangesAsync();

            return Ok("User promoted to admin.");
        }
    }
}
