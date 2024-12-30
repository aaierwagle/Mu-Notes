 // semesterData.ts
interface Chapter {
    name: string;
}

interface Subject {
    name: string;
    teacher: string;
    chapters: Chapter[];
}

interface SemesterSubjects {
    semester: string;
    subjects: Subject[];
}

export const SemestersData: SemesterSubjects[] = [
    {
        semester: "1st Semester",
        subjects: [
            {
                name: "C Programming", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to C Programming" },
                    { name: "Data Types in C" },
                    { name: "Control Structures" },
                    { name: "Functions and Arrays" }
                ]
            },
            {
                name: "Digital Logic", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Boolean Algebra" },
                    { name: "Logic Gates" },
                    { name: "Karnaugh Maps" },
                    { name: "Combinational Circuits" }
                ]
            },
            {
                name: "Introduction to Information Technology", 
                teacher: "ABCD", 
                chapters: [
                    { name: "What is IT?" },
                    { name: "Types of Computers" },
                    { name: "Computer Hardware" },
                    { name: "Software Basics" }
                ]
            },
            {
                name: "Mathematics I", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Linear Algebra" },
                    { name: "Calculus I" },
                    { name: "Vectors and Matrices" },
                    { name: "Differential Equations" }
                ]
            },
            {
                name: "Physics", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Mechanics" },
                    { name: "Thermodynamics" },
                    { name: "Optics" },
                    { name: "Electromagnetism" }
                ]
            }
        ]
    },
    {
        semester: "2nd Semester",
        subjects: [
            {
                name: "Discrete Structures", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Sets and Relations" },
                    { name: "Functions and Graphs" },
                    { name: "Combinatorics" },
                    { name: "Boolean Functions" }
                ]
            },
            {
                name: "Mathematics II", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Calculus II" },
                    { name: "Complex Numbers" },
                    { name: "Probability" },
                    { name: "Differential Equations" }
                ]
            },
            {
                name: "Microprocessor", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to Microprocessor" },
                    { name: "Intel 8085 Microprocessor" },
                    { name: "Assembly Language Programming" },
                    { name: "Memory and I/O Interfacing" }
                ]
            },
            {
                name: "Object Oriented Programming", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to OOP" },
                    { name: "Classes and Objects" },
                    { name: "Inheritance and Polymorphism" },
                    { name: "Abstraction and Encapsulation" }
                ]
            },
            {
                name: "Statistics I", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Descriptive Statistics" },
                    { name: "Probability Distributions" },
                    { name: "Inferential Statistics" },
                    { name: "Hypothesis Testing" }
                ]
            }
        ]
    },
    {
        semester: "3rd Semester",
        subjects: [
            {
                name: "Computer Architecture", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Basic Computer Organization" },
                    { name: "CPU Design" },
                    { name: "Memory Hierarchy" },
                    { name: "Input/Output Systems" }
                ]
            },
            {
                name: "Computer Graphics", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Basic Graphics Algorithms" },
                    { name: "2D Transformations" },
                    { name: "3D Graphics" },
                    { name: "Visible Surface Determination" }
                ]
            },
            {
                name: "Data Structures and Algorithms", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Arrays and Linked Lists" },
                    { name: "Stacks and Queues" },
                    { name: "Trees and Graphs" },
                    { name: "Sorting and Searching Algorithms" }
                ]
            },
            {
                name: "Numerical Method", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Roots of Equations" },
                    { name: "Interpolation" },
                    { name: "Numerical Integration" },
                    { name: "Numerical Solutions of Differential Equations" }
                ]
            },
            {
                name: "Statistics II", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Correlation and Regression" },
                    { name: "Analysis of Variance" },
                    { name: "Multivariate Analysis" },
                    { name: "Time Series Analysis" }
                ]
            }
        ]
    },
    {
        semester: "4th Semester",
        subjects: [
            {
                name: "Artificial Intelligence", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to AI" },
                    { name: "Search Algorithms" },
                    { name: "Knowledge Representation" },
                    { name: "Machine Learning" }
                ]
            },
            {
                name: "Computer Networks", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Network Models" },
                    { name: "Transmission Media" },
                    { name: "Network Protocols" },
                    { name: "Routing and Switching" }
                ]
            },
            {
                name: "Database Management System", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Database Models" },
                    { name: "Normalization" },
                    { name: "SQL Queries" },
                    { name: "Transaction Management" }
                ]
            },
            {
                name: "Operating Systems", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Process Management" },
                    { name: "Memory Management" },
                    { name: "File Systems" },
                    { name: "Operating System Security" }
                ]
            },
            {
                name: "Theory of Computation", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Finite Automata" },
                    { name: "Context-Free Grammars" },
                    { name: "Turing Machines" },
                    { name: "Decidability" }
                ]
            }
        ]
    },
    {
        semester: "5th Semester",
        subjects: [
            {
                name: "Cryptography", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to Cryptography" },
                    { name: "Classical Cryptosystems" },
                    { name: "Public-Key Cryptography" },
                    { name: "Cryptographic Protocols" }
                ]
            },
            {
                name: "Design and Analysis of Algorithms", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Divide and Conquer" },
                    { name: "Greedy Algorithms" },
                    { name: "Dynamic Programming" },
                    { name: "Graph Algorithms" }
                ]
            },
            {
                name: "Image Processing", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Image Representation" },
                    { name: "Image Enhancement" },
                    { name: "Image Segmentation" },
                    { name: "Morphological Processing" }
                ]
            },
            {
                name: "System Analysis and Design", 
                teacher: "ABCD", 
                chapters: [
                    { name: "System Development Life Cycle" },
                    { name: "Feasibility Study" },
                    { name: "Data Flow Diagrams" },
                    { name: "Entity-Relationship Diagrams" }
                ]
            },
            {
                name: "Simulation and Modelling", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to Simulation" },
                    { name: "Monte Carlo Simulation" },
                    { name: "Queuing Models" },
                    { name: "Discrete Event Simulation" }
                ]
            },
            {
                name: "Web Technology", 
                teacher: "ABCD", 
                chapters: [
                    { name: "HTML and CSS" },
                    { name: "JavaScript" },
                    { name: "Server-Side Programming" },
                    { name: "Web Security" }
                ]
            }
        ]
    },
    {
        semester: "6th Semester",
        subjects: [
            {
                name: "Software Engineering", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Software Development Life Cycle" },
                    { name: "Requirements Analysis" },
                    { name: "System Design" },
                    { name: "Testing and Maintenance" }
                ]
            },
            {
                name: "Compiler Design and Construction", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Lexical Analysis" },
                    { name: "Syntax Analysis" },
                    { name: "Semantic Analysis" },
                    { name: "Code Optimization" }
                ]
            },
            {
                name: "E-Governance", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to E-Governance" },
                    { name: "E-Governance Models" },
                    { name: "Digital Governance Tools" },
                    { name: "Challenges in E-Governance" }
                ]
            },
            {
                name: "Net Centric Computing", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Networking Fundamentals" },
                    { name: "Web Services" },
                    { name: "Cloud Computing" },
                    { name: "Distributed Systems" }
                ]
            },
            {
                name: "Technical Writing", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Types of Technical Writing" },
                    { name: "Documenting Technical Information" },
                    { name: "Writing for the Web" },
                    { name: "Editing and Proofreading" }
                ]
            },
            {
                name: "E-Commerce (Elective II)", 
                teacher: "ABCD", 
                chapters: [
                    { name: "Introduction to E-Commerce" },
                    { name: "E-Commerce Business Models" },
                    { name: "E-Commerce Technologies" },
                    { name: "Online Payment Systems" }
                ]
            }
        ]
    }
];
