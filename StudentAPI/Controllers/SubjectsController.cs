using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class SubjectsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public SubjectsController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: api/Subjects
		[HttpGet]
		public async Task<ActionResult<IEnumerable<object>>> GetSubjects()
		{
			var subjects = await _context.Subjects
				.Include(s => s.Section)
				.Select(s => new
				{
					s.Id,
					s.SubjectCode,
					s.SubjectName,
					s.Units,
					Sections = s.Section.Select(sec => new
					{
						sec.Id,
						sec.SectionName,
						sec.YearLevel,
						sec.Semester
					}).ToList()
				})
				.ToListAsync();

			return Ok(subjects);
		}

		// GET: api/Subjects/5
		[HttpGet("{id}")]
		public async Task<ActionResult<object>> GetSubject(int id)
		{
			var subject = await _context.Subjects
				.Include(s => s.Section)
				.FirstOrDefaultAsync(s => s.Id == id);

			if (subject == null)
				return NotFound();

			return Ok(new
			{
				subject.Id,
				subject.SubjectCode,
				subject.SubjectName,
				subject.Units,
				Section = subject.Section.Select(sec => new
				{
					sec.Id,
					sec.SectionName,
					sec.YearLevel,
					sec.Semester
				}).ToList()
			});
		}

		// POST: api/Subjects
		[HttpPost]
		public async Task<ActionResult<Subject>> PostSubject(Subject subject)
		{
			_context.Subjects.Add(subject);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subject);
		}

		// PUT: api/Subjects/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutSubject(int id, Subject subject)
		{
			if (id != subject.Id)
				return BadRequest();

			_context.Entry(subject).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.Subjects.Any(s => s.Id == id))
					return NotFound();
				else
					throw;
			}

			return NoContent();
		}

		// DELETE: api/Subjects/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteSubject(int id)
		{
			var subject = await _context.Subjects.FindAsync(id);
			if (subject == null)
				return NotFound();

			_context.Subjects.Remove(subject);
			await _context.SaveChangesAsync();

			return NoContent();
		}
	}
}
