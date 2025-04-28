import '@/app/globals.css';

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="container homepage-content">
        <h1 className="homepage-title">Welcome to the <span>Student Management System</span></h1>
        <p className="homepage-subtitle">Effortlessly manage students, sections, and subjects with style.</p>

        <div className="cards homepage-cards">
          <a href="/students" className="cardbtn">Manage Students</a>
          <a href="/sections" className="cardbtn">Manage Sections</a>
          <a href="/subjects" className="cardbtn">Manage Subjects</a>
        </div>
      </div>
    </div>
  );
}
