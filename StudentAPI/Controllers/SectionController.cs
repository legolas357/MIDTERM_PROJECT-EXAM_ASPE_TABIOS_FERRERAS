using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class SectionsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public SectionsController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<object>>> GetSections()
		{
			var sections = await _context.Sections
				.Include(s => s.Subject)
				.Select(s => new
				{
					SectionId = s.Id,
					s.SectionName,
					s.SubjectId,
					Subject = new
					{
						s.Subject.Id,
						s.Subject.SubjectCode,
						s.Subject.SubjectName
					},
					StudentSections = s.StudentSections.Select(ss => new
					{
						ss.StudentId,
						ss.SectionId
					})
				})
				.ToListAsync();

			return Ok(sections);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<object>> GetSection(int id)
		{
			var section = await _context.Sections
				.Include(s => s.Subject) // Include the related Subject
				.Include(s => s.StudentSections) // Include the related StudentSections
				.ThenInclude(ss => ss.Student) // Optionally, include the Student data in StudentSections
				.FirstOrDefaultAsync(s => s.Id == id);

			if (section == null)
				return NotFound();

			// Creating the DTO for the response
			var sectionDto = new
			{
				SectionId = section.Id,
				section.SectionName,
				section.YearLevel,
				section.Semester,
				section.SubjectId,
				Subject = new
				{
					section.Subject.Id,
					section.Subject.SubjectCode,
					section.Subject.SubjectName,
					section.Subject.Units,
					Section = section.Subject.Section.Select(sec => new
					{
						sec.Id,
						sec.SectionName
					}).ToList() // Ensure this relationship is correctly populated
				},
				StudentSections = section.StudentSections.Select(ss => new
				{
					ss.StudentId,
					ss.SectionId,
					Student = new
					{
						ss.Student.FirstName,
						ss.Student.LastName,
						ss.Student.Email
					}
				}).ToList() // Ensure it's converted to a list of student info
			};

			return Ok(sectionDto);
		}


		[HttpPost]
		public async Task<ActionResult<Section>> CreateSection(Section section)
		{
			_context.Sections.Add(section);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetSection), new { id = section.Id }, section);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateSection(int id, Section section)
		{
			if (id != section.Id) return BadRequest();

			var existing = await _context.Sections.FindAsync(id);
			if (existing == null) return NotFound();

			existing.SectionName = section.SectionName;
			existing.SubjectId = section.SubjectId;

			await _context.SaveChangesAsync();
			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSection(int id)
		{
			var section = await _context.Sections.FindAsync(id);
			if (section == null)
				return NotFound();

			_context.Sections.Remove(section);
			await _context.SaveChangesAsync();

			return NoContent();
		}
	}
}
