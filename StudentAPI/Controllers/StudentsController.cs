using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class StudentsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public StudentsController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: api/Students
		[HttpGet]
		public async Task<ActionResult<IEnumerable<object>>> GetStudents()
		{
			var students = await _context.Students
				.AsNoTracking()
				.Include(s => s.StudentSections)
					.ThenInclude(ss => ss.Section)
					.ThenInclude(sec => sec.Subject)
				.Select(s => new
				{
					StudentId = s.Id,
					s.FirstName,
					s.LastName,
					s.Email,
					s.Gender,
					s.BirthDate,
					s.Address,
					s.PhoneNumber,
					s.StudentNumber,
					Section = s.StudentSections.Select(ss => new
					{
						ss.Section.SectionName,
						Subject = ss.Section.Subject != null ? new
						{
							ss.Section.Subject.SubjectName
						} : null
					}).FirstOrDefault()
				})
				.ToListAsync();

			return Ok(students);
		}

		// GET: api/Students/{id}
		[HttpGet("{id}")]
		public async Task<ActionResult<object>> GetStudent(int id)
		{
			var student = await _context.Students
				.AsNoTracking()
				.Include(s => s.StudentSections)
					.ThenInclude(ss => ss.Section)
					.ThenInclude(sec => sec.Subject)
				.Where(s => s.Id == id)
				.Select(s => new
				{
					StudentId = s.Id,
					s.FirstName,
					s.LastName,
					s.Email,
					s.Gender,
					s.BirthDate,
					s.Address,
					s.PhoneNumber,
					s.StudentNumber,
					Section = s.StudentSections.Select(ss => new
					{
						ss.Section.SectionName,
						Subject = ss.Section.Subject != null ? new
						{
							ss.Section.Subject.SubjectName
						} : null
					}).FirstOrDefault()
				})
				.FirstOrDefaultAsync();

			if (student == null)
				return NotFound(new { message = "Student not found." });

			return Ok(student);
		}

		// GET: api/Students/checkEmail?email=example@example.com
		[HttpGet("checkEmail")]
		public IActionResult CheckEmail(string email)
		{
			var exists = _context.Students.Any(s => s.Email == email);
			return Ok(new { exists });
		}

		// GET: api/Students/checkStudentNumber?studentNumber=1234-22
		[HttpGet("checkStudentNumber")]
		public IActionResult CheckStudentNumber(string studentNumber)
		{
			var exists = _context.Students.Any(s => s.StudentNumber == studentNumber);
			return Ok(new { exists });
		}

		// POST: api/Students
		[HttpPost]
		public async Task<ActionResult> CreateStudent(CreateStudent dto)
		{
			if (await _context.Students.AnyAsync(s => s.Email == dto.Email))
				return BadRequest(new { message = "Student with this email already exists." });

			if (await _context.Students.AnyAsync(s => s.StudentNumber == dto.StudentNumber))
				return BadRequest(new { message = "Student with this student number already exists." });

			var student = new Student
			{
				FirstName = dto.FirstName,
				LastName = dto.LastName,
				Email = dto.Email,
				Gender = dto.Gender,
				BirthDate = dto.Birthdate,
				Address = dto.Address,
				PhoneNumber = dto.PhoneNumber,
				StudentNumber = dto.StudentNumber
			};

			_context.Students.Add(student);
			await _context.SaveChangesAsync();

			var ss = new StudentSection
			{
				StudentId = student.Id,
				SectionId = dto.SectionId
			};

			_context.StudentSections.Add(ss);
			await _context.SaveChangesAsync();

			var studentWithSection = await _context.Students
				.Where(s => s.Id == student.Id)
				.Include(s => s.StudentSections)
					.ThenInclude(ss => ss.Section)
						.ThenInclude(sec => sec.Subject)
				.Select(s => new
				{
					s.Id,
					s.FirstName,
					s.LastName,
					s.Email,
					s.Gender,
					s.BirthDate,
					s.Address,
					s.PhoneNumber,
					s.StudentNumber,
					Section = s.StudentSections
						.Select(ss => new
						{
							ss.Section.Id,
							ss.Section.SectionName,
							Subject = new
							{
								ss.Section.Subject.Id,
								ss.Section.Subject.SubjectCode,
								ss.Section.Subject.SubjectName
							}
						})
						.FirstOrDefault()
				})
				.FirstOrDefaultAsync();

			return CreatedAtAction(
				nameof(GetStudent),
				new { id = student.Id },
				studentWithSection
			);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateStudent(int Id, UpdateStudent studentDto)
		{
			if (Id != studentDto.Id)
				return BadRequest(new { message = "Student ID mismatch." });

			var student = await _context.Students.FindAsync(Id);
			if (student == null)
				return NotFound(new { message = "Student not found." });

			if (await _context.Students.AnyAsync(s => s.Email == studentDto.Email && s.Id != Id))
				return BadRequest(new { message = "Student with this email already exists." });

			if (await _context.Students.AnyAsync(s => s.StudentNumber == studentDto.StudentNumber && s.Id != Id))
				return BadRequest(new { message = "Student with this student number already exists." });

			student.FirstName = studentDto.FirstName;
			student.LastName = studentDto.LastName;
			student.Gender = studentDto.Gender;
			student.BirthDate = studentDto.BirthDate;
			student.Address = studentDto.Address;
			student.Email = studentDto.Email;
			student.PhoneNumber = studentDto.PhoneNumber;
			student.StudentNumber = studentDto.StudentNumber;

			var existingSection = await _context.StudentSections
				.FirstOrDefaultAsync(ss => ss.StudentId == Id);

			if (existingSection != null)
			{
				existingSection.SectionId = studentDto.SectionId;
			}
			else
			{
				var newSection = new StudentSection
				{
					StudentId = student.Id,
					SectionId = studentDto.SectionId
				};
				_context.StudentSections.Add(newSection);
			}

			_context.Entry(student).State = EntityState.Modified;
			await _context.SaveChangesAsync();

			var updatedStudent = await _context.Students
				.Where(s => s.Id == student.Id)
				.Include(s => s.StudentSections)
					.ThenInclude(ss => ss.Section)
						.ThenInclude(sec => sec.Subject)
				.Select(s => new
				{
					s.Id,
					s.FirstName,
					s.LastName,
					s.Email,
					s.Gender,
					s.BirthDate,
					s.Address,
					s.PhoneNumber,
					s.StudentNumber,
					Section = s.StudentSections
						.Select(ss => new
						{
							ss.Section.Id,
							ss.Section.SectionName,
							Subject = new
							{
								ss.Section.Subject.Id,
								ss.Section.Subject.SubjectCode,
								ss.Section.Subject.SubjectName
							}
						})
						.FirstOrDefault()
				})
				.FirstOrDefaultAsync();

			return Ok(updatedStudent);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> HardDeleteStudent(int id)
		{
			var student = await _context.Students
				.Include(s => s.StudentSections)
				.FirstOrDefaultAsync(s => s.Id == id);

			if (student == null)
				return NotFound(new { message = "Student not found." });

			var studentSections = await _context.StudentSections
				.Where(ss => ss.StudentId == id)
				.ToListAsync();

			_context.StudentSections.RemoveRange(studentSections);
			_context.Students.Remove(student);
			await _context.SaveChangesAsync();

			return NoContent();
		}
	}
}
