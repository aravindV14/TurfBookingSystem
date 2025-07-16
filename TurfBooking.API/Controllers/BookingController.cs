using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurfBooking.API.Data;
using TurfBooking.API.Models;
using System.Security.Claims;

namespace TurfBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: All bookings (for calendar view)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAll()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .OrderBy(b => b.SlotStart)
                .ToListAsync();
        }

        // ✅ POST: Book a slot (user only)
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> BookSlot(DateTime slotStart, DateTime slotEnd)
        {
            if (slotEnd <= slotStart)
                return BadRequest("End time must be after start time");

            // Check for conflicting bookings
            var conflict = await _context.Bookings.AnyAsync(b =>
                !b.IsBlockedByAdmin &&
                ((slotStart >= b.SlotStart && slotStart < b.SlotEnd) ||
                 (slotEnd > b.SlotStart && slotEnd <= b.SlotEnd) ||
                 (slotStart <= b.SlotStart && slotEnd >= b.SlotEnd)));

            if (conflict)
                return BadRequest("Slot already booked or blocked");

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var booking = new Booking
            {
                UserId = userId,
                SlotStart = slotStart,
                SlotEnd = slotEnd
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok("Slot booked successfully");
        }

        // ✅ DELETE: Admin deletes a booking
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok("Booking deleted");
        }
[HttpGet("my")]
[Authorize(Roles = "User,Admin")]
public async Task<IActionResult> GetMyBookings()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    var bookings = await _context.Bookings
        .Where(b => b.UserId == userId)
        .Select(b => new
        {
            b.Id,
            SlotStart = b.SlotStart,
            SlotEnd = b.SlotEnd,
            b.IsBlockedByAdmin
        })
        .ToListAsync();

    return Ok(bookings);
}
    


        // ✅ POST: Admin blocks a slot (no user can book this time)
        [HttpPost("block")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> BlockSlot(DateTime slotStart, DateTime slotEnd)
        {
            if (slotEnd <= slotStart)
                return BadRequest("End time must be after start time");

            // Check if there's already a block
            var exists = await _context.Bookings.AnyAsync(b =>
                b.IsBlockedByAdmin &&
                b.SlotStart == slotStart &&
                b.SlotEnd == slotEnd);

            if (exists)
                return BadRequest("Already blocked");

            var block = new Booking
            {
                SlotStart = slotStart,
                SlotEnd = slotEnd,
                IsBlockedByAdmin = true
            };

            _context.Bookings.Add(block);
            await _context.SaveChangesAsync();

            return Ok("Slot blocked by admin");
        }
    }
}
