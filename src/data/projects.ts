export interface Project {
  title: string;
  type: string;
  description: string;
  tech: string[];
}

export const projects: Project[] = [
  {
    title: 'ShedSkin: Python-to-C++ Transpiler Optimization',
    type: 'Compilers',
    description:
      'Implemented escape analysis–based stack allocation optimization in ShedSkin, a Python-to-C++ transpiler, reducing runtime by 95–98% for heap-allocated tuples and class instances.',
    tech: ['C++', 'Python', 'Compiler Design', 'Static Analysis'],
  },
  {
    title: 'MoinMoin Wiki Engine',
    type: 'Open Source',
    description:
      'Implemented scoped subitem search feature enabling hierarchical queries via custom prefix syntax. Extended Flask search route and integrated with Whoosh indexing.',
    tech: ['Python', 'Flask', 'Whoosh', 'pytest', 'GitHub Actions'],
  },
  {
    title: 'CoScribe: Personal Lecture Transcriber',
    type: 'Honors Capstone',
    description:
      'Developed a Chrome extension integrating with UMich lecture capture to provide concise lecture summaries using OpenAI API, with auto-generated study aids.',
    tech: ['JavaScript', 'HTML/CSS', 'Chrome Extensions', 'OpenAI API'],
  },
  {
    title: 'Semantic Segmentation for Motorcyclist Safety',
    type: 'Computer Vision',
    description:
      'Designed a semantic segmentation system to identify hazards in real-time from dashcam footage using DeepLabV3 with ResNet101.',
    tech: ['Python', 'PyTorch', 'DeepLabV3', 'OpenCV'],
  },
  {
    title: 'Psychiatric Hospital Staffing Tool',
    type: 'Research',
    description:
      'Developed a staffing tool to expedite scheduling of 100+ staff at psychiatric hospitals in Michigan. Built an optimization library using C++ and CPLEX.',
    tech: ['C++', 'CPLEX', 'Excel VBA', 'Optimization'],
  },
  {
    title: '"Bunny Frog" 2D Platformer Game',
    type: 'Game Dev',
    description:
      'Developed a mobile 2D platformer with 10+ levels using Godot Editor, including custom pixel art characters and intuitive menu design.',
    tech: ['Godot', 'GDScript', 'Pixel Art', 'Game Design'],
  },
];
