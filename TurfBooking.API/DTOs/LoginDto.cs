namespace TurfBooking.API.DTOs
{
    public class LoginDto
    {
        public string Identifier { get; set; } = string.Empty; // Username or Phone
        public string Password { get; set; } = string.Empty;
    }
}
