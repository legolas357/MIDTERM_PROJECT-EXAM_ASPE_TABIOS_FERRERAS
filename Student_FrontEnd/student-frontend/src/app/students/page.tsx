'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { StudentDTO } from '@/types';
import Link from 'next/link';
import '@/app/globals.css';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(err => {
        console.error('Failed to fetch students:', err);
        setError('Unable to load student data.');
      });
  }, []);

  return (
    <div className="students-page">
      <h1 className="page-title">All Students</h1>
      <div className="student-actions">
        <Link href="/students/add" className="btn-back">
          ➕ Add Student
        </Link>
        <Link href="/" className="btn-back">
          ← Back to Home
        </Link>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Student No.</th>
              <th>Section</th>
              <th>Subject</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map(student => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.gender}</td>
                <td>{new Date(student.birthDate).toLocaleDateString()}</td>
                <td>{student.address}</td>
                <td>{student.email}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.studentNumber}</td>
                <td>{student.section?.sectionName || 'N/A'}</td>
                <td>{student.section?.subject?.subjectName || 'N/A'}</td>
                <td className="text-center">
                  <button
                    className="table-btn"
                    onClick={() => router.push(`/students/edit/${student.studentId}`)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this student?')) {
                        if (confirm('Are you absolutely sure? This action cannot be undone!')) {
                          api.delete(`/students/${student.studentId}`)
                            .then(() => setStudents(students.filter(s => s.studentId !== student.studentId)))
                            .catch(() => alert('Delete failed'));
                        }
                      }
                    }}
                    className="table-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={12} className="no-data">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
