'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import '@/app/globals.css';

interface Section {
  sectionId: number;
  sectionName: string;
  subject: {
    subjectName: string;
  };
}

interface Student {
  Id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  address: string;
  email: string;
  phoneNumber: string;
  studentNumber: string;
  sectionId: number;
}

export default function EditStudent() {
  const [student, setStudent] = useState<Student | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [subject, setSubject] = useState<string>('');
  const router = useRouter();
  const { id } = useParams(); // Get the ID from the URL

  // Fetch sections on component mount
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('https://localhost:7127/api/sections');
        if (!res.ok) throw new Error(`Failed to fetch sections: ${res.status}`);
        const data = await res.json();
        setSections(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
        alert('Failed to load sections. Please try again later.');
      }
    };
    fetchSections();
  }, []);

  // Fetch student data when component loads or when sections change
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return; // Ensure id is available
      try {
        const res = await fetch(`https://localhost:7127/api/students/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
        const studentData: Student = await res.json();
        setStudent(studentData);
        setSelectedSectionId(studentData.sectionId);

        // Find the selected section and set the subject
        const selectedSection = sections.find(
          (sec) => sec.sectionId === studentData.sectionId
        );
        if (selectedSection) {
          setSubject(selectedSection.subject.subjectName);
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        alert('Failed to load student data. Please try again later.');
      }
    };
    fetchStudent();
  }, [sections, id]);

  // Handle change in section selection
  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = Number(e.target.value);
    setSelectedSectionId(sectionId);

    // Update subject based on selected section
    const section = sections.find((sec) => sec.sectionId === sectionId);
    if (section) {
      setSubject(section.subject.subjectName);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!student || selectedSectionId === null) {
      alert('Please fill out all fields.');
      return;
    }

    // Confirm update action
    const confirmation = window.confirm('Are you sure you want to update this student?');
    if (!confirmation) return;

    // Send updated student data to the server
    try {
      const res = await fetch(`https://localhost:7127/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Id: student.Id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          gender: student.gender,
          birthDate: student.birthDate,
          address: student.address,
          phoneNumber: student.phoneNumber,
          studentNumber: student.studentNumber,
          sectionId: selectedSectionId,
        }),
      });

      if (res.ok) {
        alert('Student updated successfully!');
        router.push('/students'); // Redirect to students list
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert(`Failed to update student. Server says: ${errorText}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while updating the student.');
    }
  };

  // Loading state while fetching student data
  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-student-page">
      <a href="/students" className="edit-student-page btn-back">
        Back to Students
      </a>
      <h1 className="page-title">Edit Student</h1>
      <form onSubmit={handleSubmit} className="edit-student-form">
        {/* Form fields for student details */}
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            className="form-input"
            value={student.firstName}
            onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            className="form-input"
            value={student.lastName}
            onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={student.email}
            onChange={(e) => setStudent({ ...student, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            className="form-input"
            value={student.gender}
            onChange={(e) => setStudent({ ...student, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="birthDate" className="form-label">Birth Date</label>
          <input
            type="date"
            className="form-input"
            value={student.birthDate.slice(0, 10)}
            onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            className="form-input"
            value={student.address}
            onChange={(e) => setStudent({ ...student, address: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            className="form-input"
            value={student.phoneNumber}
            onChange={(e) => setStudent({ ...student, phoneNumber: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="studentNumber" className="form-label">Student Number</label>
          <input
            className="form-input"
            value={student.studentNumber}
            onChange={(e) => setStudent({ ...student, studentNumber: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="section" className="form-label">Section</label>
          <select
            className="form-input"
            value={selectedSectionId ?? ''}
            onChange={handleSectionChange}
            required
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.sectionId} value={section.sectionId}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
        {subject && (
          <div className="subject-info">
            Subject: {subject}
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="submit-button">Update Student</button>
          <button type="button" onClick={() => router.push('/students')} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
