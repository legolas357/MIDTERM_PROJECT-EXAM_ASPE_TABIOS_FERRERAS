namespace StudentAPI.Models
{
	public class Student
	{
		public int Id { get; set; }
		public string FirstName { get; set; } = "";
		public string LastName { get; set; } = "";
		public string Email { get; set; } = "";
		public string Address { get; set; } = "";
		public string PhoneNumber { get; set; } = "";
		public DateTime BirthDate { get; set; }
		public string StudentNumber { get; set; } = "";
		public string Gender{ get; set; } = "";
		public int SectionId { get; set; }
		public ICollection<StudentSection> StudentSections { get; set; }
	}

}
