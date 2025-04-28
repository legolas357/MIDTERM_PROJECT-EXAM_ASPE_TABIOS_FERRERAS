'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';

interface Section {
  sectionId: number;
  sectionName: string;
  subject: {
    subjectName: string;
  };
}

export default function AddStudentPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthdate: '',
    address: '',
    phoneNumber: '',
    studentNumber: '',
    sectionId: 0
  });

  const [emailError, setEmailError] = useState('');
  const [studentNumberError, setStudentNumberError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('https://localhost:7127/api/Sections')
      .then(res => setSections(res.data));
  }, []);

  useEffect(() => {
    if (form.sectionId) {
      const section = sections.find(s => s.sectionId === +form.sectionId);
      setSelectedSection(section || null);
    } else {
      setSelectedSection(null);
    }
  }, [form.sectionId, sections]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'email') setEmailError('');
    if (name === 'studentNumber') setStudentNumberError('');
  };

  const validateUniqueFields = async () => {
    let valid = true;
    setEmailError('');
    setStudentNumberError('');
    setErrorMessage('');

    try {
      const emailCheck = await axios.get(`https://localhost:7127/api/Students/checkEmail?email=${form.email}`);
      if (emailCheck.data.exists) {
        setEmailError('Email already registered.');
        valid = false;
      }

      const studentNumberCheck = await axios.get(`https://localhost:7127/api/Students/checkStudentNumber?studentNumber=${form.studentNumber}`);
      if (studentNumberCheck.data.exists) {
        setStudentNumberError('StudentNo. already registered.');
        valid = false;
      }

      return valid;
    } catch (error) {
      setErrorMessage('An error occurred during validation.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUnique = await validateUniqueFields();
    if (!isUnique) return;

    const isConfirmed = window.confirm('Are you sure you want to add this student?');
    if (!isConfirmed) return;

    try {
      await axios.post('https://localhost:7127/api/Students', form);
      router.push('/students');
    } catch (error: any) {
      alert(error.response?.data || 'An error occurred while submitting the form.');
    }
  };

  return (
    <div className="add-student-page">
      <Link href="/students" className="add-student-page btn-back">
        ← Back to Students
      </Link>
      <h2 className="page-title">Add New Student</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="firstName">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required />
              </td>
              <td>
                <label htmlFor="lastName">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required />
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={emailError ? 'input-error' : ''}
                />
                {emailError && <div className="error-message">{emailError}</div>}
              </td>
            </tr>

            <tr>
              <td>
                <label htmlFor="gender">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
              <td>
                <label htmlFor="birthdate">Birthdate</label>
                <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required />
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <label htmlFor="address">Address</label>
                <input name="address" value={form.address} onChange={handleChange} required />
              </td>
            </tr>

            <tr>
              <td>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
              </td>
              <td>
                <label htmlFor="studentNumber">Student Number</label>
                <input
                  name="studentNumber"
                  value={form.studentNumber}
                  onChange={handleChange}
                  required
                  className={studentNumberError ? 'input-error' : ''}
                />
                {studentNumberError && <div className="error-message">{studentNumberError}</div>}
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <label htmlFor="sectionId">Section</label>
                <select name="sectionId" value={form.sectionId} onChange={handleChange} required>
                  <option key="default" value="">Select Section</option>
                  {sections.map(sec => (
                    <option key={sec.sectionId} value={sec.sectionId}>
                      {sec.sectionName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {selectedSection && (
              <tr>
                <td colSpan={2}>
                  <label>Subject</label>
                  <input value={selectedSection.subject?.subjectName || ''} readOnly />
                </td>
              </tr>
            )}

            {errorMessage && (
              <tr>
                <td colSpan={2} className="error-message">{errorMessage}</td>
              </tr>
            )}

            <tr>
              <td colSpan={2} style={{ textAlign: 'center' }}>
                <button type="submit" className="btn-submit">Add Student</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
