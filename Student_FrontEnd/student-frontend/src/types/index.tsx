export interface SubjectDTO {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
    units: number;
  }
  
  export interface SectionDTO {
    sectionId: number;
    sectionName: string;
    yearLevel: string;
    semester: string;
    subjectId: number;
    subject: SubjectDTO;
  }
  
  export interface StudentDTO {
    studentId: number;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    address: string;
    email: string;
    phoneNumber: string;
    studentNumber: string;
    section?: {
      sectionId: number;
      sectionName: string;
      subject: {
        subjectId: number;
        subjectName: string;
      };
    };
  }
  
  
  export interface StudentSectionDTO {
    studentId: number;
    sectionId: number;
    student?: StudentDTO;
    section?: SectionDTO;
  }
  
export interface AddStudentDTO {
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
