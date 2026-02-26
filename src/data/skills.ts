export interface SkillCategory {
  label: string;
  icon: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    label: 'Languages',
    icon: 'code',
    skills: [
      'Java',
      'Python',
      'C/C++',
      'SQL',
      'JavaScript',
      'HTML/CSS',
      'R',
      'Bash',
      'MATLAB',
    ],
  },
  {
    label: 'Frameworks',
    icon: 'layers',
    skills: ['React', 'Flask', 'TensorFlow', 'Hadoop', 'MapReduce'],
  },
  {
    label: 'Tools',
    icon: 'terminal',
    skills: [
      'Git',
      'GitHub',
      'Google Cloud Platform',
      'AWS',
      'VS Code',
      'Jira',
      'Docker',
    ],
  },
  {
    label: 'Data & ML',
    icon: 'chart',
    skills: [
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Scikit-Learn',
      'PyTorch',
      'OpenCV',
      'Beautiful Soup',
    ],
  },
];
