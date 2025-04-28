'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';

interface Subject {
  id: number;
  subjectCode: string;
  subjectName: string;
  units: number;
}

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('https://localhost:7127/api/Subjects');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSubjects(await res.json());
      } catch (err) {
        console.error(err);
        setError('Unable to load subjects.');
      }
    };
    fetchSubjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this subject?')) return;
    try {
      const res = await fetch(`https://localhost:7127/api/Subjects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setSubjects(subjects.filter(s => s.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="manage-sections-page">
      <h1 className="page-title">All Subjects</h1>

      <div className="student-actions">
        <Link href="/" className="btn-back">← Back to Home</Link>
      </div>

      {error && <div className="no-data">{error}</div>}

      <div className="table-container">
        <table className="section-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th className="text-center">Units</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? subjects.map(sub => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.subjectCode}</td>
                <td>{sub.subjectName}</td>
                <td className="text-center">{sub.units}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="no-data">No subjects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
