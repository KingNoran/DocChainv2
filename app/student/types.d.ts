
import { Eip1193Provider } from 'ethers';

// window.ethereum
declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: "student" | "registrar" | "admin";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "student" | "registrar" | "admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "student" | "registrar" | "admin";
  }
}

interface Student {
  studentId: number;
  userId: string;
  year: number;
  semester: number;
  course: course;           // enum or union type
  finalGrade: string;
  torReady: boolean;
  nationality: string | null;
  address: string | null;
  birthday: Date | null; // optional
  major: string | null;
  highschool: string | null;
  dateEntrance?: Date;    // optional
  dateGraduated: Date | null;
}

interface AuthCredentials{
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    role: string;
}

interface TORAction{
  id: string;
  studentId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Semester{
  id: string;
  transcriptId: string;
  year: string;
  semester: string;
  createdAt: Date;
}

interface UserParams{
    firstName: string;
    middleName?: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    address: string;
    phone: string;
}

interface RegistrarUserParams{
    firstName: string;
    middleName?: string;
    lastName: string;
    phone: string;
    email: string;
    nationality: string;
    phone: string;
    address: string;
    birthday: Date;
}

interface StudentParams{
    year: number;
    semester: number;
    course: string;
    finalGrade: number;
    torReady: boolean;
}

interface StudentOverviewTemplate{
  studentId: number;
  userId: string;
  course: course;
  year: number;
  semester: number;
  torReady: boolean;
  role: string;
  password: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastActivityDate: Date;
  createdAt: string;
  nationality: string | null;
  address: string | null;
  birthday: string | null;
}

export type roles =
    "STUDENT"|
    "REGISTRAR"|
    "ADMIN"|
    null;

export type studentYear =
    "First Year"|
    "Second Year"|
    "Third Year"|
    "Fourth Year"|
    "Invalid Input";

export interface CreditUnit {
  lecture: number;
  laboratory: number;
}

export interface Subject {
  id: number;
  courseCode: string;
  courseTitle: string;
  creditUnit: CreditUnit;
  preRequisite?: string;
  finalGrade?: number;
  instructor?: string;
  syTaken?: Date;
  contactHrs?: CreditUnit;
}

export interface Semester {
  firstSem?: Subject[];
  secondSem?: Subject[];
  midSem?: Subject[];
}

export interface YearChecklist {
  firstYear?: Semester[];
  secondYear?: Semester[];
  thirdYear?: Semester[];
  fourthYear?: Semester[];
  midYear1?: Semester[];
  midYear2?: Semester[];
}

export type TOR = Record<string, YearChecklist>;

interface CourseGrade {
  gradeKey: string;
  syTaken: string;
  instructor: string;
  finalRating: string;
}

export type names = typeof subjectNames;
export type subject_names = names[number];

export type course = 
    "BSIT"|
    "BSCS"|
    "BSCRIM"|
    "BSHM"|
    "BSP"|
    "BSED_M"|
    "BSED_E"|
    "BSBM_MM"|
    null;

export const subjectNames = [
    "Ethics",
    "Purposive Communication",
    "Kontekstwalisadong Komunikasyon sa Filipino",
    "Discrete Structure",
    "Introduction to Computing",
    "Computer Programming 1",
    "Movement Enhancement",
    "National Service Training Program 1",
    "CVSU 101",
    "Arts Appreciation",
    "Science, Technology and Society",
    "Dalumat Ng/Sa Filipino",
    "Mathematics in the Modern World",
    "Computer Programming 2",
    "Web System and Technologies 1",
    "Fitness Exercise",
    "National Service Training Program 2",
    "Mga Babasahin Hinggil sa Kasaysayan ng Pilipinas",
    "The Contemporary World",
    "Gender and Society",
    "Panitikang Panlipunan",
    "Platform Technologies",
    "Information Management",
    "Object Oriented Programming",
    "Physical Activities towards Health and Fitness I",
    "Understanding the Self",
    "Data Structures and Algorithms",
    "Integrated Programming and Technologies 1",
    "Open Source Technology",
    "Advanced Database System",
    "Multimedia Systems",
    "Physical Activities towards Health and Fitness II",
    "Applied Statistics",
    "System Integration and Architecture 1",
    "Introduction to Human Computer Interaction",
    "Information Assurance and Security 1",
    "Network Fundamentals",
    "System Analysis and Design",
    "Application Development and Emerging Technologies",
    "Methods of Research",
    "Rizal: Life, Works, and Writings",
    "Quantitative Methods (Modeling & Simulation)",
    "Human Computer Interaction 2",
    "Web System and Technologies 2",
    "Information Assurance and Security 2",
    "Network Management",
    "Capstone Project and Research 1",
    "Social and Professional Issues",
    "Integrated Programming and Technologies 2",
    "Systems Integration and Architecture 2",
    "Systems Administration and Maintenance",
    "Capstone Project and Research 2",
    "Practicum (minimum 486 hours)",
    "Discrete Structures I",
    "Web Systems and Technologies",
    "Fitness Exercises",
    "Analytic Geometry",
    "Discrete Structures II",
    "Digital Logic Design",
    "Fundamentals of Information Systems",
    "Physical Activities towards Health and Fitness 1",
    "Calculus",
    "Architecture and Organization",
    "Software Engineering I",
    "Advanced Database Management ",
    "Physical Activities towards Health and Fitness 2",
    "Linear Algebra",
    "Software Engineering II",
    "Operating Systems",
    "Networks and Communication",
    "CS Elective 1 (Computer Graphics and Visual Computing)",
    "Applications Dev't and Emerging ",
    "Life and Works of Rizal",
    "Experimental Statistics",
    "Design and Analysis of Algorithm",
    "Programming Languages",
    "CS Elective 2 (Introduction to Game Development)",
    "IAS Practicum (240 hours)",
    "Human Computer Interaction",
    "Automata Theory and Formal ",
    "Intelligent ",
    "CS Elective 3 (Internet of Things)",
    "Undergraduate Thesis I",
    "Numerical and Symbolic Computation",
    "Undergraduate Thesis II",
    "Art Appreciation",
    "Introdution to Criminology",
    "Introduction to Criminal Justice System",
    "Fundamental of Martial Arts",
    "Institutional Orientation",
    "Theories of Crime Causation",
    "Human Rights Education",
    "Law Enforcement Org and Admin (Inter-agency Approach)",
    "Arnis & Disarming Techniques",
    "Human Behavior & Victimology",
    "Comparative Models in Policing",
    "Intro. to Industrial Security Administration",
    "Fundamentals of Investigation and Intelligence",
    "Specialized Crime Investigation 1 w/ Legal Medicine",
    "Forensic Photography",
    "Criminal Law (Book 1)",
    "First Aid & Water Survival",
    "Professional Conduct & Ethical Std.",
    "Juvenile Del. & Juvenile Justice ",
    "LEOP with Crime Mapping",
    "Specialized Crime Investigation 2",
    "General Chemistry (Organic)",
    "Personal Identification ",
    "Criminal Law (Book 2)",
    "Fundamentals of Markmanship",
    "Understanding Self",
    "World Literature",
    "Forensic Chemistry & ",
    "Questioned Document Examination",
    "Dispute Resolution & Crises/Incidents Mngt.",
    "Special Penal Laws",
    "Traffic Mngt. and Accident Investigatin w/ Driving",
    "Institutional Corrections",
    "Char. Formation, Nationalism & ",
    "Crim. Research 1 (Res. Methods w/ Applied Stat.)",
    "Evidence",
    "Lie Detection Techniques",
    "Fire Protection and Arson Investigation",
    "Vice and Drug Education and Control",
    "Tech. English 2 (Legal Forms)",
    "Non-Institutional Corrections",
    "Char.Formation/Leadership,Decisionmaking,Mngt.&Admin.",
    "Forensic Ballistics",
    "Criminal Procedure & Court Testimony",
    "Intro. to Cybercrime and Digital Forensic Invest.",
    "EnvironmentalLaws & Protection w/ DisasterRiskMitigation",
    "Criminological Research 2 (Thesis Writing&Presentation)",
    "Competency Appraisal 1",
    "Therapeutic ",
    "Internship (OJT 1 & 2) (540 Field Hours)",
    "Competency Appraisal 2",
    "Fundamentals in Lodging Operations",
    "Macro Prespective of Tourism & Hospitality",
    "Risk Management Applied to Safety Security n Sanitation",
    "CWTS/LST/ROTC",
    "Philippine Tourism, Geography and Culture",
    "Micro Prespective of Tourism and Hospitality",
    "Kitchen Essentials & Basic Food Preparation",
    "Food and Beverage Service",
    "Asian Language 1",
    "Applied Business Tools and Technologies (GDS) with Lab",
    "Cost Control",
    "Supply Chain/Logistics Purchasing Management",
    "Bar and Beverage Management with Lab",
    "Front Office Operation",
    "Physical Activities toward Health and Fitness 1",
    "Hospitality Practicum 1",
    "Physical activities toward Health and Fitness 2",
    "Mga Babasahin hinggil sa kasaysayan ng Pilipinas",
    "Kontekstwalisadong komunikasyon sa Filipino",
    "Asian Language 2",
    "Introduction to MICE as applied in Hospitality",
    "Professional Development & Applied Ethics",
    "Tourism and Hospitality Marketing",
    "Sustainable Hospitality Management",
    "Science, Technology World",
    "Legal Aspect in Tourism and Hospitality",
    "Multicultural Diversity Workplace - Tourism/Professional",
    "Enterpreneurship in Tourism and ",
    "Ergonomics&Facilities Planning for Hospitality Industry",
    "Bread and Pastry Production",
    "Research in Hospitality",
    "Strategic management in Tourism and Hospitality",
    "Operations Management in Tourism n Hospitality Industry",
    "Tourism and Hospitality Service Quality Management",
    "PRACTICUM 2- Hotel Operations",
    "Introduction to Psychology",
    "CWTS/ROTC",
    "Babasahin Hinggil sa Kasaysayan ng Pilipinas",
    "Psychological Statistics",
    "Science, Technology, and Society",
    "Biology for Health Sciences",
    "Theories of Personality",
    "General Zoology",
    "Developmental Psychology",
    "Filipino Psychology",
    "Experimental ",
    "General Chemistry with Organic Chemistry",
    "Abnormal Psychology",
    "Psychological Assessment",
    "Cognitive Psychology",
    "Biochemistry for Health Sciences",
    "Field Methods in Psychology",
    "Industrial/Organizational Psychology",
    "Human Anatomy and Physiology",
    "Introduction to ",
    "Physiological/ Biologiocal Psychology",
    "Social Psychology",
    "Introduction to Clinical Psychology",
    "Dalumat ng/sa Filipino",
    "Research in Psychology 1",
    "Research in Psychology ",
    "Retorika/Masining na Pagpapahayag",
    "Practicum in Psychology",
    "Child and Adolescent Learner and Learning Principles",
    "The Teaching Profession",
    "The Teacher n The Community, School Culture, Leadership",
    "CWTS / LTS / ROTC",
    "Institutional Orientation 1",
    "Foundation of Special and Inclusive Education",
    "Facilitating Learner-Centered Teaching",
    "Technology for Teaching and Learning 1",
    "Assessment in Learning 1",
    "The Teacher and The School Curriculum",
    "Trigonometry",
    "Plane and Solid ",
    "Logic and Set Theory",
    "Elementary Statistics and Probability",
    "Assessment in Learning 2",
    "Building n Enhancing New Literacies Across Curriculum",
    "Modern Geometry",
    "Advanced Statistics",
    "Principles and Methods of Teaching Mathematics",
    "Observations of Teaching",
    "Calculus 1 with Analytic Geometry",
    "Number Theory",
    "Problem-Solving, Mathematical Investigations n Modelling",
    "Research in Mathematics",
    "Dalumat Ng/Sa Fiipino",
    "Field Study 2 - Participation and Teaching Assistantship",
    "Calculus 2",
    "Mathematics of Investment",
    "Abstract Algebra",
    "Assessment and Evaluation in Mathematics",
    "Calculus 3",
    "Teaching Internship",
    "Contemporary World",
    "Introduction to Linguistics",
    "Language, Culture and Society",
    "Structure of English",
    "Principles n Theories of Language Acquisition n Learning",
    "Mythology and Folklore",
    "Stylistics and Discourse Analysis",
    "Language Programs and Policies in Multilingual Society",
    "Language Learning Materials Development",
    "Children and Adolescent Literature",
    "Technical Writing",
    "Speech and Theater Arts",
    "Survey of Philippine Literature in English",
    "Survey of Afro-Asian Literature",
    "Teaching and Assessment of Macroskills",
    "Teaching and Assessment of Grammar",
    "Survey of English and American ",
    "Contemporary, Popular, and Emergent Literature",
    "English for Specific Purposes",
    "Teaching and Assessment of Literature Study",
    "Language and Education Research",
    "Literary ",
    "Campus Journalism",
    "Technology for Teaching and Learning 2",
    "Teaching Internship (40 /WK)",
    "Retorika / Masining na Pagpapahayag",
    "Basic Microeconomics",
    "National Service Training Program",
    "Quantitative Techniques in Business",
    "Human Resource Management",
    "Business Law (Obligations and Contracts)",
    "Science Technology and Society",
    "Operations Management",
    "International Trade and Agreements",
    "Consumer Behavior",
    "Market Research",
    "Physical Acitvities towards Health & Fitness I",
    "Good Governance and Social Responsibility",
    "Taxation (Income and Taxation)",
    "Product Management",
    "Retail Management",
    "Advertising",
    "Physical Acitvities towards Health & Fitness II",
    "Rizal's Life and Works",
    "Business Research",
    "Professional Salesmanship",
    "Marketing Management",
    "Special Topics in Marketing Management",
    "Strategic Management",
    "Undergraduate Thesis/EDP (Proposal)",
    "Research/EDP (Final Manuscript)",
    "Practicum Integrated Learning",
] as const;