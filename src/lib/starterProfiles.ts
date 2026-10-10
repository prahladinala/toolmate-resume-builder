import { ResumeData } from "@/types/resume";

export interface StarterProfile {
  id: string;
  roleTitle: string;
  category: string;
  badge: string;
  description: string;
  data: ResumeData;
}

export const STARTER_PROFILES: StarterProfile[] = [
  {
    id: "senior-swe",
    roleTitle: "Senior Full-Stack Engineer",
    category: "Engineering",
    badge: "Most Popular",
    description:
      "High-impact tech profile emphasizing system design, distributed systems, latency reduction, and modern cloud architecture.",
    data: {
      personalInfo: {
        firstName: "Alex",
        lastName: "Chen",
        email: "alex.chen.eng@gmail.com",
        phone: "+1 (555) 382-9410",
        location: "San Francisco, CA",
        title: "Senior Full-Stack Software Engineer",
        linkedin: "https://linkedin.com/in/alexchen-eng",
        github: "https://github.com/alexchen-dev",
        website: "https://alexchen.dev",
      },
      summary:
        "Senior Full-Stack Engineer with 6+ years of experience architecting high-scale web platforms and distributed microservices. Proven track record reducing API latency by 45%, scaling systems to 3M+ monthly active users, and mentoring 8+ engineers across agile squads. Passionate about TypeScript, React, Next.js, and cloud-native Kubernetes infrastructure.",
      experience: [
        {
          id: "exp-swe-1",
          company: "CloudScale Systems",
          role: "Senior Full-Stack Engineer",
          startDate: "2023-01",
          endDate: "",
          current: true,
          description:
            "• Spearheaded migration of legacy monolith to Next.js and NestJS microservices, improving Core Web Vitals by 58% and slashing page load times from 3.2s to 950ms.\n• Architected asynchronous event pipeline using Apache Kafka and Redis cluster, processing over 15M daily telemetry events with 99.99% uptime.\n• Mentored 6 mid-level engineers, instituted automated CI/CD security linting, and decreased staging deployment failures by 40%.\n• Collaborated with product and design leads to ship high-throughput billing engine supporting $4.2M in annual recurring revenue.",
        },
        {
          id: "exp-swe-2",
          company: "Apex Digital Solutions",
          role: "Full-Stack Software Engineer",
          startDate: "2020-06",
          endDate: "2022-12",
          current: false,
          description:
            "• Engineered real-time collaboration dashboard using React, TypeScript, and WebSocket subscriptions, boosting weekly active team usage by 34%.\n• Designed and maintained RESTful and GraphQL APIs on PostgreSQL and AWS Lambda, serving 45,000+ requests per minute.\n• Implemented automated Jest and Playwright end-to-end testing suites, increasing total test coverage from 42% to 88%.\n• Optimized heavy relational database queries and indexed foreign keys, reducing p95 database response times by 320ms.",
        },
      ],
      projects: [
        {
          id: "proj-swe-1",
          name: "OmniFlow Cloud Automation",
          description:
            "Open-source visual workflow automation builder with real-time DAG execution and sandbox worker nodes.",
          technologies: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Go",
            "Docker",
            "PostgreSQL",
          ],
          github: "https://github.com/alexchen-dev/omniflow",
          url: "https://omniflow.io",
        },
        {
          id: "proj-swe-2",
          name: "CachePulse Distributed Monitor",
          description:
            "Lightweight observability daemon for tracking multi-region Redis key eviction rates and memory fragmentation.",
          technologies: ["Node.js", "Redis", "Prometheus", "Grafana", "Docker"],
          github: "https://github.com/alexchen-dev/cachepulse",
        },
      ],
      education: [
        {
          id: "edu-swe-1",
          degree: "B.S. in Computer Science",
          institution: "University of California, Berkeley",
          startDate: "2016-09",
          endDate: "2020-05",
          current: false,
          score: "3.85 / 4.0 GPA",
        },
      ],
      skills: [
        { id: "s-1", name: "TypeScript", category: "Languages" },
        { id: "s-2", name: "JavaScript", category: "Languages" },
        { id: "s-3", name: "Python", category: "Languages" },
        { id: "s-4", name: "Go", category: "Languages" },
        { id: "s-5", name: "React", category: "Frameworks & Libraries" },
        { id: "s-6", name: "Next.js", category: "Frameworks & Libraries" },
        { id: "s-7", name: "Node.js", category: "Frameworks & Libraries" },
        { id: "s-8", name: "Tailwind CSS", category: "Frameworks & Libraries" },
        { id: "s-9", name: "PostgreSQL", category: "Databases & Tools" },
        { id: "s-10", name: "Redis", category: "Databases & Tools" },
        { id: "s-11", name: "Docker", category: "Cloud & DevOps" },
        { id: "s-12", name: "Kubernetes", category: "Cloud & DevOps" },
        {
          id: "s-13",
          name: "AWS (S3, Lambda, ECS)",
          category: "Cloud & DevOps",
        },
        {
          id: "s-14",
          name: "CI/CD & GitHub Actions",
          category: "Cloud & DevOps",
        },
      ],
      customSections: [],
    },
  },
  {
    id: "product-manager",
    roleTitle: "Product Manager (Growth & SaaS)",
    category: "Product & Strategy",
    badge: "High Impact",
    description:
      "Results-driven product profile focused on customer discovery, conversion funnels, sprint velocity, and monetization.",
    data: {
      personalInfo: {
        firstName: "Sarah",
        lastName: "Jenkins",
        email: "sarah.jenkins.pm@outlook.com",
        phone: "+1 (555) 724-1189",
        location: "New York, NY",
        title: "Product Manager | SaaS & Monetization",
        linkedin: "https://linkedin.com/in/sarahjenkins-pm",
        website: "https://sarahjenkins.co",
      },
      summary:
        "Customer-obsessed Product Manager with 5+ years of experience steering zero-to-one B2B SaaS solutions and self-serve onboarding funnels. Championed product experiments that increased free-to-paid conversion by 28% and drove $3.5M in incremental annual contract value (ACV). Adept at data synthesis, user research, and cross-functional leadership.",
      experience: [
        {
          id: "exp-pm-1",
          company: "VentureStack SaaS",
          role: "Senior Product Manager",
          startDate: "2022-03",
          endDate: "",
          current: true,
          description:
            "• Spearheaded redesign of multi-tier self-serve onboarding funnel, boosting user signup completion rate from 41% to 67%.\n• Defined quarterly OKRs and managed sprint backlogs across 2 distributed engineering squads (14 engineers, 2 UX designers).\n• Conducted 50+ qualitative customer interviews and launched enterprise workspace controls, securing 12 Fortune 500 pilots.\n• Executed rigorous A/B testing framework on pricing paywalls, increasing net dollar retention (NDR) from 104% to 118%.",
        },
        {
          id: "exp-pm-2",
          company: "Beacon Health Tech",
          role: "Associate Product Manager",
          startDate: "2019-08",
          endDate: "2022-02",
          current: false,
          description:
            "• Shipped mobile patient scheduling workflow used by over 120,000 monthly patients, reducing clinic no-show rates by 22%.\n• Partnered with data science team to build predictive cancellation algorithms, recovering an estimated $850K in lost provider hours.\n• Authored comprehensive PRDs, user stories, and acceptance criteria while maintaining 95% on-time sprint delivery.",
        },
      ],
      projects: [
        {
          id: "proj-pm-1",
          name: "SaaS PLG Playbook & Framework",
          description:
            "Curated open framework analyzing product-led growth mechanics, churn indicators, and activation milestones across 50 top B2B tools.",
          technologies: [
            "Product Analytics",
            "Mixpanel",
            "Figma",
            "Amplitude",
            "SQL",
          ],
          url: "https://plgplaybook.com",
        },
      ],
      education: [
        {
          id: "edu-pm-1",
          degree: "B.A. in Economics & Cognitive Science",
          institution: "Columbia University",
          startDate: "2015-09",
          endDate: "2019-05",
          current: false,
          score: "3.90 / 4.0 GPA",
        },
      ],
      skills: [
        {
          id: "s-pm-1",
          name: "Product Strategy & Roadmapping",
          category: "Product Management",
        },
        {
          id: "s-pm-2",
          name: "A/B Testing & Experimentation",
          category: "Product Management",
        },
        {
          id: "s-pm-3",
          name: "Customer Discovery & User Research",
          category: "Product Management",
        },
        {
          id: "s-pm-4",
          name: "Mixpanel & Amplitude",
          category: "Analytics & Tools",
        },
        {
          id: "s-pm-5",
          name: "SQL Data Modeling",
          category: "Analytics & Tools",
        },
        { id: "s-pm-6", name: "Figma Prototyping", category: "Design & UX" },
        {
          id: "s-pm-7",
          name: "Agile Scrum & Sprint Planning",
          category: "Methodologies",
        },
        { id: "s-pm-8", name: "Jira & Linear", category: "Analytics & Tools" },
      ],
      customSections: [],
    },
  },
  {
    id: "data-scientist",
    roleTitle: "Data Scientist & AI/ML Engineer",
    category: "AI & Data Science",
    badge: "In-Demand",
    description:
      "ML & analytical profile highlighting deep learning models, LLM fine-tuning, production pipelines, and business ROI.",
    data: {
      personalInfo: {
        firstName: "Marcus",
        lastName: "Vance",
        email: "marcus.vance.ai@gmail.com",
        phone: "+1 (555) 890-4421",
        location: "Seattle, WA",
        title: "Senior Data Scientist | Machine Learning & LLMs",
        linkedin: "https://linkedin.com/in/marcusvance-ai",
        github: "https://github.com/marcusvance-ml",
      },
      summary:
        "Senior Data Scientist and Machine Learning Engineer with 5+ years of experience architecting end-to-end predictive models and LLM agent pipelines in production. Experienced deploying PyTorch, scikit-learn, and vector search systems handling millions of daily inference requests. Decreased customer churn by 18% via ensemble uplift modeling.",
      experience: [
        {
          id: "exp-ds-1",
          company: "Nexus AI Labs",
          role: "Senior Machine Learning Engineer",
          startDate: "2022-05",
          endDate: "",
          current: true,
          description:
            "• Architected Retrieval-Augmented Generation (RAG) assistant using LangChain, pgvector, and Claude 3.5, cutting support ticket resolution time by 48%.\n• Trained custom gradient-boosted decision trees (LightGBM) to forecast enterprise churn, preserving $2.1M in annual contracts.\n• Deployed model inference containers on AWS SageMaker and Triton Inference Server, achieving p99 latency <45ms at 800 req/sec.\n• Designed automated data validation pipelines with Great Expectations, eliminating dirty training data incidents.",
        },
        {
          id: "exp-ds-2",
          company: "FinMetrics Global",
          role: "Data Scientist",
          startDate: "2019-10",
          endDate: "2022-04",
          current: false,
          description:
            "• Built real-time credit fraud anomaly detection pipeline analyzing $400M in transactional volume with 96.2% precision.\n• Developed automated feature store in Snowflake and dbt, reducing feature engineering time for new models from 3 weeks to 2 days.\n• Conducted statistical cohort analysis and Monte Carlo simulations presented directly to executive leadership.",
        },
      ],
      projects: [
        {
          id: "proj-ds-1",
          name: "DocuSense RAG Engine",
          description:
            "Open-source multimodal RAG pipeline for extracting, parsing, and reasoning over complex financial filings (10-K/10-Q).",
          technologies: [
            "Python",
            "PyTorch",
            "Hugging Face",
            "ChromaDB",
            "FastAPI",
          ],
          github: "https://github.com/marcusvance-ml/docusense",
        },
      ],
      education: [
        {
          id: "edu-ds-1",
          degree: "M.S. in Machine Learning & Statistics",
          institution: "University of Washington",
          startDate: "2017-09",
          endDate: "2019-06",
          current: false,
          score: "3.92 / 4.0 GPA",
        },
      ],
      skills: [
        { id: "s-ds-1", name: "Python", category: "Languages" },
        { id: "s-ds-2", name: "SQL", category: "Languages" },
        { id: "s-ds-3", name: "R", category: "Languages" },
        {
          id: "s-ds-4",
          name: "PyTorch & TensorFlow",
          category: "Frameworks & Libraries",
        },
        {
          id: "s-ds-5",
          name: "Scikit-Learn & LightGBM",
          category: "Frameworks & Libraries",
        },
        { id: "s-ds-6", name: "LangChain & Vector DBs", category: "AI & LLMs" },
        {
          id: "s-ds-7",
          name: "Snowflake & dbt",
          category: "Databases & Tools",
        },
        {
          id: "s-ds-8",
          name: "Docker & AWS SageMaker",
          category: "Cloud & DevOps",
        },
      ],
      customSections: [],
    },
  },
  {
    id: "fresher-cs",
    roleTitle: "New Graduate / Junior Engineer",
    category: "Entry Level & Student",
    badge: "Fresher Friendly",
    description:
      "Designed for recent grads and college seniors emphasizing capstone projects, internships, hackathons, and core CS fundamentals.",
    data: {
      personalInfo: {
        firstName: "Jordan",
        lastName: "Taylor",
        email: "jordan.taylor.cs@gmail.com",
        phone: "+1 (555) 419-7703",
        location: "Austin, TX",
        title: "Software Engineering Graduate",
        linkedin: "https://linkedin.com/in/jordantaylor-cs",
        github: "https://github.com/jordantaylor-cs",
      },
      summary:
        "Driven Computer Science graduate with hands-on internship experience in full-stack web development and cloud infrastructure. Strong foundation in algorithms, data structures, and REST API development. Winner of HackTX 2024 (Best Developer Tool) and contributor to open-source developer tooling.",
      experience: [
        {
          id: "exp-fr-1",
          company: "CivicTech Labs",
          role: "Software Engineering Intern",
          startDate: "2024-05",
          endDate: "2024-08",
          current: false,
          description:
            "• Developed responsive search dashboard using React, TypeScript, and Tailwind CSS, increasing search query speed by 25%.\n• Built REST endpoints with Node.js and Express to query municipal transit APIs, serving 5,000+ daily student commuters.\n• Authored comprehensive unit tests using Vitest achieving 85% branch coverage on core routing modules.\n• Participated in daily standups and sprint reviews, learning Git pull request best practices and code review workflows.",
        },
      ],
      projects: [
        {
          id: "proj-fr-1",
          name: "StudySync Peer Collaboration Hub",
          description:
            "Real-time study group planner with shared whiteboard canvas, markdown notes, and WebRTC audio rooms.",
          technologies: [
            "React",
            "TypeScript",
            "Node.js",
            "Socket.io",
            "MongoDB",
          ],
          github: "https://github.com/jordantaylor-cs/studysync",
          url: "https://studysync-demo.vercel.app",
        },
        {
          id: "proj-fr-2",
          name: "CampusBite Food Pantry Tracker",
          description:
            "Mobile-first web app helping university students find open food pantries with real-time stock notifications.",
          technologies: ["Next.js", "Tailwind CSS", "Supabase", "PostgreSQL"],
          github: "https://github.com/jordantaylor-cs/campusbite",
        },
      ],
      education: [
        {
          id: "edu-fr-1",
          degree: "B.S. in Computer Science (Dean's Honor List)",
          institution: "University of Texas at Austin",
          startDate: "2021-08",
          endDate: "2025-05",
          current: false,
          score: "3.82 / 4.0 GPA",
        },
      ],
      skills: [
        {
          id: "s-fr-1",
          name: "JavaScript / TypeScript",
          category: "Languages",
        },
        { id: "s-fr-2", name: "Python", category: "Languages" },
        { id: "s-fr-3", name: "Java", category: "Languages" },
        {
          id: "s-fr-4",
          name: "React & Next.js",
          category: "Frameworks & Libraries",
        },
        {
          id: "s-fr-5",
          name: "Node.js & Express",
          category: "Frameworks & Libraries",
        },
        {
          id: "s-fr-6",
          name: "PostgreSQL & MongoDB",
          category: "Databases & Tools",
        },
        { id: "s-fr-7", name: "Git & GitHub", category: "Databases & Tools" },
        {
          id: "s-fr-8",
          name: "Data Structures & Algorithms",
          category: "Core CS",
        },
      ],
      customSections: [],
    },
  },
];
