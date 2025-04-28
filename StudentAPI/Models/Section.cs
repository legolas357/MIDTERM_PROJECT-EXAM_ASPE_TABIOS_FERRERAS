namespace StudentAPI.Models
{
	public class Section
	{
		public int Id { get; set; }
		public string SectionName { get; set; } = "";
		public string YearLevel { get; set; } = "";
		public string Semester { get; set; } = "";
		public int SubjectId { get; set; }
		public Subject Subject { get; set; }
		public ICollection<StudentSection> StudentSections { get; set; }
	}

}
