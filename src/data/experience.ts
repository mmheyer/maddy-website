export interface ExperienceEntry {
  role: string;
  organization: string;
  location: string;
  dates: string;
  highlights: string[];
}

export interface ExperienceCategory {
  label: string;
  entries: ExperienceEntry[];
}

export const experience: ExperienceCategory[] = [
  {
    label: 'Industry',
    entries: [
      {
        role: 'Computer Science Intern',
        organization: 'Electric Outdoors',
        location: 'Ann Arbor, MI',
        dates: 'May 2025 – Jul 2025',
        highlights: [
          'Developed and optimized C++/Python AI-powered embedded systems for sustainable IoT devices',
          'Contributed to full-stack web and mobile development, accelerating UX/UI improvements',
        ],
      },
      {
        role: 'Data Analytics & AI Intern',
        organization: 'DENSO',
        location: 'Southfield, MI',
        dates: 'May 2024 – Aug 2024',
        highlights: [
          'Built predictive models to forecast machine cycle times and optimize maintenance schedules',
          'Designed dashboards to visualize real-time metrics and production trends',
        ],
      },
      {
        role: 'Data Science Intern',
        organization: 'Greenshoes – Ann Arbor Spark',
        location: 'Ann Arbor, MI',
        dates: 'Jun 2022 – Aug 2022',
        highlights: [
          'Developed discrete event simulation models using SimPy for hospital patient flow optimization',
          'Automated data preprocessing workflows for simulation inputs',
        ],
      },
    ],
  },
  {
    label: 'Research',
    entries: [
      {
        role: 'Software Developer',
        organization: 'UMich CHEPS – Center for Healthcare Engineering & Patient Safety',
        location: 'Ann Arbor, MI',
        dates: 'May 2023 – Present',
        highlights: [
          'Built optimization library in C++ and CPLEX for hospital resource allocation',
          'Developed staffing tool for scheduling 100+ staff at Michigan psychiatric hospitals',
        ],
      },
      {
        role: 'Research Assistant',
        organization: 'UMich THInC Lab',
        location: 'Ann Arbor, MI',
        dates: 'Feb 2022 – Jul 2023',
        highlights: [
          'Modeled eye-tracking data in R to assess interruption impacts on operator performance',
          'Enhanced UAV simulation software for human-computer interaction studies',
        ],
      },
    ],
  },
  {
    label: 'Teaching',
    entries: [
      {
        role: 'GSI – EECS 489 (Computer Networks)',
        organization: 'University of Michigan',
        location: 'Ann Arbor, MI',
        dates: 'Aug 2025 – Present',
        highlights: [
          'Led weekly labs and office hours for 100+ students on socket programming and protocols',
          'Created supplemental materials on TCP flow control and congestion management',
        ],
      },
      {
        role: 'IA – ENGR 100 (Intro Engineering)',
        organization: 'University of Michigan',
        location: 'Ann Arbor, MI',
        dates: 'Jan 2023 – Apr 2023',
        highlights: [
          'Mentored 20 students in designing wind turbines generating up to 3W of power',
          'Facilitated hands-on lab sessions and developed instructional video tutorials',
        ],
      },
    ],
  },
];
