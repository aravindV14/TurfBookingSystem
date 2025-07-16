using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TurfBooking.API.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public DateTime SlotStart { get; set; }

        

        [Required]
        public DateTime SlotEnd { get; set; }

        public bool IsBlockedByAdmin { get; set; } = false;
    }
}
