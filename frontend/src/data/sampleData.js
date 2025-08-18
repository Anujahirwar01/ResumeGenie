// Sample analysis data for testing the dashboard
export const sampleAnalysisData = {
  overallScore: 77,
  userName: "Anuj Ahirwar",
  greeting: "Good evening, Anuj.",
  welcomeMessage: "Welcome to your resume review.",
  topFixes: [
    { 
      name: "Readability", 
      score: 7, 
      priority: "high", 
      description: "Improve text formatting and structure for better readability",
      suggestions: [
        "Use bullet points consistently",
        "Reduce paragraph length",
        "Improve section spacing"
      ]
    },
    { 
      name: "Communication", 
      score: 6, 
      priority: "medium", 
      description: "Enhance communication skills demonstration",
      suggestions: [
        "Add communication achievements",
        "Include collaboration examples",
        "Highlight presentation skills"
      ]
    },
    { 
      name: "Summary", 
      score: 6, 
      priority: "medium", 
      description: "Strengthen professional summary section",
      suggestions: [
        "Add quantified achievements",
        "Include relevant keywords",
        "Tailor to target role"
      ]
    },
    { 
      name: "Leadership", 
      score: 0, 
      priority: "low", 
      description: "Add leadership experience and examples",
      suggestions: [
        "Include team leadership roles",
        "Add project management experience",
        "Highlight mentoring activities"
      ]
    },
    { 
      name: "Teamwork", 
      score: 0, 
      priority: "low", 
      description: "Demonstrate collaborative work experience",
      suggestions: [
        "Add cross-functional projects",
        "Include team achievements",
        "Highlight collaborative tools"
      ]
    }
  ],
  resumeData: {
    name: "Anuj Ahirwar",
    email: "anujahirwar77010@gmail.com",
    phone: "+91 7987456215",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "India",
    summary: "Full Stack Developer with expertise in frontend and backend development, experienced in creating applications and implementing innovative technical solutions. Passionate about building scalable web applications and working with modern technologies.",
    skills: {
      languages: ["Java", "JavaScript", "Python", "TypeScript"],
      frontend: ["React.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Next.js"],
      backend: ["Node.js", "Express.js", "MongoDB", "Mongoose", "RESTful APIs", "GraphQL"],
      tools: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Docker", "AWS"]
    },
    experience: [
      {
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        duration: "2023 - Present",
        points: [
          "Developed and maintained web applications serving 10,000+ users",
          "Improved system performance by 40% through code optimization",
          "Led a team of 3 developers on critical projects",
          "Implemented CI/CD pipelines reducing deployment time by 60%"
        ]
      },
      {
        title: "Frontend Developer",
        company: "InnovateHub",
        duration: "2022 - 2023",
        points: [
          "Built responsive web interfaces using React.js and Tailwind CSS",
          "Collaborated with cross-functional teams in Agile environment",
          "Optimized application performance reducing load time by 35%",
          "Mentored junior developers and conducted code reviews"
        ]
      }
    ],
    projects: [
      {
        name: "StackZone - Real Time Q&A Platform With AI Support",
        githubLink: "GitHub Link",
        tech: "React.js, Node.js, Express.js, MongoDB, OpenAI API",
        points: [
          "Developed full-stack Q&A platform with AI-powered answer generation, supporting 100+ registered users.",
          "Integrated OpenAI API to provide beginner-friendly answers, addressing unanswered questions by 60%",
          "Engineered secure user authentication with JWT and session management, reducing security vulnerabilities by 40%",
          "Built scalable RESTful API backend with MongoDB, optimized for 500+ concurrent requests",
          "Enhanced component-based front-end with React.js and Tailwind CSS, improving development efficiency by 25%"
        ]
      },
      {
        name: "CodeMate AI - Real Time Collaborative Coding Platform",
        githubLink: "GitHub Link", 
        tech: "Socket.io, React.js, Node.js, OpenAI API",
        points: [
          "Built with Socket.io, enabling 10+ developers to simultaneously edit code with <50ms latency and 99.9% real-time synchronization.",
          "Features OpenAI API integration for 85% faster code optimization through intelligent suggestions and debugging assistance",
          "Implements JWT-based authentication with HTTP-only cookies, providing 256-bit encryption and supporting 100+ concurrent users",
          "Incorporates real-time chat interface processing 500+ messages per second, improving team coordination by 75%"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "Indian Institute of Technology",
        year: "2024",
        gpa: "8.5/10"
      }
    ],
    certifications: [
      "AWS Certified Developer Associate",
      "Google Cloud Professional Developer",
      "MongoDB Certified Developer"
    ]
  },
  atsAnalysis: {
    keywords: {
      found: ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
      missing: ["TypeScript", "AWS", "Docker", "Kubernetes", "Machine Learning"],
      density: 3.2
    },
    formatting: {
      score: 85,
      issues: ["Inconsistent bullet points", "Missing section headers"],
      strengths: ["Clean layout", "Proper margins", "Readable fonts"]
    },
    content: {
      score: 78,
      strengths: ["Quantified achievements", "Relevant experience", "Technical skills"],
      improvements: ["Add more soft skills", "Include certifications", "Expand summary"]
    }
  },
  recommendations: [
    {
      category: "Keywords",
      priority: "High",
      title: "Add Missing Technical Keywords",
      description: "Include TypeScript, AWS, and Docker in your skills section to match more job requirements.",
      impact: "Could improve ATS matching by 25%"
    },
    {
      category: "Formatting", 
      priority: "Medium",
      title: "Standardize Bullet Points",
      description: "Use consistent bullet point styles throughout your resume for better readability.",
      impact: "Improves professional appearance"
    },
    {
      category: "Content",
      priority: "Medium", 
      title: "Expand Professional Summary",
      description: "Add 2-3 more sentences highlighting your key achievements and career goals.",
      impact: "Better first impression for recruiters"
    }
  ]
};

export default sampleAnalysisData;
