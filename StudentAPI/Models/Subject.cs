namespace StudentAPI.Models
{
	public class Subject
	{
		public int Id { get; set; }
		public string SubjectCode { get; set; } = "";
		public string SubjectName { get; set; } = "";
		public int Units { get; set; }
		public ICollection<Section> Section { get; set; }
	}

}
