'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link component
import { useRouter } from 'next/navigation';
import '@/app/globals.css';

interface Section {
  sectionId: number;
  sectionName: string;
  subject: {
    subjectName: string;
  };
}

export default function ManageSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('https://localhost:7127/api/Sections');
        const data = await res.json();
        setSections(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        const res = await fetch(`https://localhost:7127/api/Sections/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setSections(sections.filter((s) => s.sectionId !== id));
        } else {
          console.error('Failed to delete section');
        }
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  return (
    <div className="manage-sections-page">
      <h1 className="page-title">All Sections</h1>

      <div className="student-actions">
        <Link href="/" className="btn-back">
          ← Back to Home
        </Link>
      </div>

      <div className="table-container">
        <table className="section-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Section Name</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <tr key={section.sectionId}>
                  <td>{section.sectionId}</td>
                  <td>{section.sectionName}</td>
                  <td>{section.subject?.subjectName || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="no-data">No sections found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
