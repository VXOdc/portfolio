export const IMGS = {
  syllastudy: 'https://i.ibb.co/PvvGMxcX/Screenshot-2026-05-04-202056.png',
  physicsone: 'https://i.postimg.cc/PfFBWs1s/Screenshot-2026-05-16-at-11-46-42-AM.png',
  neurocompute: 'https://i.postimg.cc/3JH2xk0C/Screenshot-2026-05-17-at-3-06-03-PM.png',
  percepta: 'https://i.postimg.cc/MZYL0RDn/Screenshot-2026-07-29-at-11-12-18-AM.png',
};

export const PROFILE = {
  name: 'Noah Ly',
  email: 'lynoah18@gmail.com',
  github: 'https://github.com/VXOdc',
  credly: 'https://www.credly.com/users/noah-ly/badges',
  location: 'Cupertino, California',
  tagline: 'Student · Web Developer · Robotics Enthusiast',
  bio: 'Building AI platforms, embedded systems, and web applications from Cupertino, California. Focused on intentional engineering and clean execution.',
};

export const PROJECTS = [
  {
    id: 'percepta',
    title: 'Percepta AI',
    date: 'May 2026',
    url: 'https://perceptacomputeai.vercel.app/',
    flagship: true,
    description: 'Flagship multimodal AI platform — realtime analysis, structured reasoning, and workflow automation.',
    features: [
      { label: 'Multimodal AI', detail: 'Processes visual and text inputs through integrated reasoning pipelines.' },
      { label: 'Realtime Analysis', detail: 'Generates structured outputs instantly in the browser.' },
      { label: 'Workflow Engine', detail: 'Scalable AI-powered productivity and automation system.' },
    ],
    image: IMGS.percepta,
    tags: ['Multimodal AI', 'Realtime Analysis', 'Workflow Engine'],
  },
  {
    id: 'neuro',
    title: 'NeuroCompute',
    date: 'May 2026',
    url: 'https://neurocompute.vercel.app/',
    flagship: false,
    description: 'Real-time AI vision system running in the browser. Captures live webcam frames and runs them through a multimodal vision model.',
    features: [
      { label: 'Live Vision', detail: 'Continuous webcam analysis via Mistral Pixtral.' },
      { label: 'Adaptive Pipeline', detail: 'Dynamic JPEG compression based on rolling latency.' },
      { label: 'Voice Output', detail: 'Scene descriptions spoken through Web Speech API.' },
    ],
    image: IMGS.neurocompute,
    tags: ['Live Vision', 'Adaptive Pipeline', 'Voice Output'],
  },
  {
    id: 'physics',
    title: 'PhysicsOne',
    date: 'May 2026',
    url: 'https://physicsone.vercel.app/',
    flagship: false,
    description: 'Browser-based 2D physics sandbox for building, tuning, and inspecting motion in real time.',
    features: [
      { label: 'Custom Engine', detail: 'Rigid bodies, gravity, rotation, and impulse-based collision.' },
      { label: 'Live Controls', detail: 'Gravity, friction, bounciness, and presets update instantly.' },
      { label: 'Debug View', detail: 'Velocity vectors, collision points, and simulation stats.' },
    ],
    image: IMGS.physicsone,
    tags: ['Custom Engine', 'Live Controls', 'Debug View'],
  },
  {
    id: 'sylla',
    title: 'SyllaStudy AI',
    date: 'Mar 2026',
    url: 'https://syllastudyai.vercel.app/',
    flagship: false,
    description: 'AI-powered study platform that transforms course materials into structured study systems.',
    features: [
      { label: 'SmartNotes', detail: 'AI-generated notes from any uploaded source.' },
      { label: 'QuizGen', detail: 'Adaptive quizzes built from your own content.' },
      { label: 'TaskFlow', detail: 'Deadline-aware study planning.' },
    ],
    image: IMGS.syllastudy,
    tags: ['SmartNotes', 'QuizGen', 'TaskFlow'],
  },
  {
    id: 'esp32',
    title: 'ESP32 Projects',
    date: '2026',
    url: null,
    flagship: false,
    description: 'Embedded hardware series: IoT sensor integration, BLE and Wi-Fi comms, real-time firmware in C/C++.',
    features: [],
    image: null,
    tags: ['C/C++', 'ESP-IDF', 'IoT', 'BLE'],
  },
];

export const CERTS = [
  { title: 'Claude with Anthropic API', issuer: 'Anthropic', date: 'May 2026', icon: 'https://i.ibb.co/cXKCktj6/certificate-8d9a96h8oe2k-1780019970.jpg', verify: 'https://verify.skilljar.com/c/8d9a96h8oe2k' },
  { title: 'Ethical Hacker', issuer: 'Cisco', date: 'May 2026', icon: 'https://i.ibb.co/M5ZrfvFZ/Screenshot-2026-05-25-at-3-37-06-PM-removebg-preview.png' },
  { title: 'HTML Essentials', issuer: 'Cisco', date: 'May 2026', icon: 'https://i.ibb.co/TxCGhNRG/Screenshot-2026-05-25-at-3-37-12-PM-removebg-preview.png' },
  { title: 'Introduction to Cybersecurity', issuer: 'Cisco', date: 'May 2026', icon: 'https://i.ibb.co/4n5VKVtS/Screenshot-2026-05-25-at-3-38-41-PM-removebg-preview.png' },
  { title: 'Linux Unhatched', issuer: 'Cisco', date: 'Apr 2026', icon: 'https://i.ibb.co/GQZ5JVjV/Screenshot-2026-05-25-at-3-37-30-PM-removebg-preview.png' },
  { title: 'Quantum Enigmas', issuer: 'IBM SkillsBuild', date: 'Jan 2026', icon: 'https://i.ibb.co/ksywtf4K/Screenshot-2026-05-25-at-3-37-38-PM.png' },
  { title: 'AI Literacy', issuer: 'IBM SkillsBuild', date: 'Jan 2026', icon: 'https://i.ibb.co/zHx04HtG/Screenshot-2026-05-25-at-3-37-00-PM.png' },
  { title: 'AI Fundamentals', issuer: 'IBM SkillsBuild', date: 'Jan 2026', icon: 'https://i.ibb.co/Q3KNZr6J/Screenshot-2026-05-25-at-3-36-22-PM.png' },
];

export const AWARDS = [
  { title: 'Best Coding Award', context: 'Robotics Competition', year: '2023' },
  { title: 'Teamwork Award', context: 'Sacred Heart Invitational', year: '2022' },
  { title: 'Best Design Award', context: 'Robotics Competition', year: '2020' },
];

export const LEADERSHIP = [
  {
    role: 'Vice President',
    org: 'Prove Me Wrong — Socratic Debate, Philosophy & Economics Club',
    period: 'Aug 2025',
    desc: 'Co-lead a 60+ member debate club focused on Socratic discussion and open debate around politics, philosophy, ethics, and economics.',
    skills: ['Leadership', 'Public Speaking', 'Civics', 'Economics', 'Debate'],
  },
];

export const MARQUEE_ITEMS = [
  'AI Platforms',
  'Web Development',
  'Embedded Systems',
  'Robotics',
  'React',
  'Python',
  'C/C++',
  'Cupertino',
  'Open to Collaborations',
];

export const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#certs', label: 'Certs' },
  { href: '#awards', label: 'Awards' },
  { href: '#leadership', label: 'Leadership' },
  { href: '#contact', label: 'Contact' },
];
