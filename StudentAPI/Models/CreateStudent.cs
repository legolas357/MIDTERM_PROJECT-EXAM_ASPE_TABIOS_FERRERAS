using System.ComponentModel.DataAnnotations;

namespace StudentAPI.Models
{
	public class CreateStudent
	{
		[Required]
		public string FirstName { get; set; }

		[Required]
		public string LastName { get; set; }

		[Required, EmailAddress]
		public string Email { get; set; }

		[Required]
		public string Gender { get; set; }

		[Required]
		public DateTime Birthdate { get; set; }

		[Required]
		public string Address { get; set; }

		[Required, Phone]
		public string PhoneNumber { get; set; }

		[Required]
		public string StudentNumber { get; set; }

		[Required]
		public int SectionId { get; set; }
	}
}
