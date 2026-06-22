import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Enable CORS for frontend Vite dev server (port 5173)
app.use(cors());
app.use(express.json());

// In-memory Shared Data Store
let state = {
  students: [
    { name: 'Aria Sterling', email: 'aria.s@university.edu', major: 'CS & AI', score: '94%', status: 'Ready', trend: 'up', verifiedSkillsCount: 18, activeGapsCount: 0 },
    { name: 'Devon Vance', email: 'vance.d@university.edu', major: 'Software Eng.', score: '82.5%', status: 'Ready', trend: 'up', verifiedSkillsCount: 14, activeGapsCount: 2 },
    { name: 'Kelsey Monroe', email: 'monroe.k@university.edu', major: 'Data Science', score: '64%', status: 'Gap Detected', trend: 'down', verifiedSkillsCount: 9, activeGapsCount: 4 },
    { name: 'Liam Sterling', email: 'liam.st@university.edu', major: 'Cybersecurity', score: '89%', status: 'Ready', trend: 'up', verifiedSkillsCount: 16, activeGapsCount: 1 },
    { name: 'Nadia Petrov', email: 'nadia.p@university.edu', major: 'Computer Eng.', score: '58%', status: 'Critical Gap', trend: 'down', verifiedSkillsCount: 7, activeGapsCount: 5 },
  ],
  assessments: [
    { title: 'System Architecture Fundamentals', skill: 'System Design', difficulty: 'Advanced', questions: 20, completions: '84%', avgScore: '78%' },
    { title: 'TypeScript Advanced Type Systems', skill: 'TypeScript', difficulty: 'Medium', questions: 15, completions: '96%', avgScore: '86%' },
    { title: 'React 19 State Management', skill: 'React 19', difficulty: 'Medium', questions: 15, completions: '91%', avgScore: '84%' },
  ],
  remediations: [
    { skill: 'System Design', course: 'System Design Primer', studentsCount: 42, completed: 18, cohort: 'Cohort A' },
    { skill: 'Docker & Kubernetes', course: 'Introduction to Containers', studentsCount: 25, completed: 10, cohort: 'Cohort A' }
  ],
  roadmap: [
    { title: 'Web Fundamentals', desc: 'HTML5, TailwindCSS, & Responsive Layouts', grade: 'A', status: 'Mastered', date: 'Completed Dec 2025' },
    { title: 'Advanced JavaScript & TS', desc: 'Closures, Promises, and Generic Type Safety', grade: 'A-', status: 'Mastered', date: 'Completed Feb 2026' },
    { title: 'System Design & Scalability', desc: 'Load balancers, database sharding, caching layers', grade: '--', status: 'In Progress', date: 'Started Jun 2026' },
    { title: 'DevOps & CI/CD Pipelines', desc: 'Containerization with Docker, deployment scripts, actions', grade: '--', status: 'Locked', date: 'Unlocks after System Design' }
  ],
  settings: {
    autoRemediation: true,
    integrityGuardLevel: 'strict',
    readinessTarget: 85
  }
};

// Log requests
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Endpoint: Fetch complete engine state
app.get('/api/state', (req, res) => {
  res.json(state);
});

// Endpoint: Create/Assign New Assessment
app.post('/api/assessments', (req, res) => {
  const { title, skill, difficulty, questions } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newAssessment = {
    title,
    skill,
    difficulty,
    questions: Number(questions),
    completions: '0%',
    avgScore: '--'
  };
  state.assessments.push(newAssessment);
  res.status(201).json(newAssessment);
});

// Endpoint: Assign Remediation Path
app.post('/api/remediations', (req, res) => {
  const { skill, course, cohort } = req.body;
  if (!skill || !course) return res.status(400).json({ error: 'Skill and course are required' });

  const newRemediation = {
    skill,
    course,
    studentsCount: 28,
    completed: 0,
    cohort: cohort || 'Cohort A'
  };
  state.remediations.push(newRemediation);
  res.status(201).json(newRemediation);
});

// Endpoint: Update AI Settings
app.post('/api/settings', (req, res) => {
  const { autoRemediation, integrityGuardLevel, readinessTarget } = req.body;
  if (autoRemediation !== undefined) state.settings.autoRemediation = autoRemediation;
  if (integrityGuardLevel !== undefined) state.settings.integrityGuardLevel = integrityGuardLevel;
  if (readinessTarget !== undefined) state.settings.readinessTarget = Number(readinessTarget);

  // Automatically sync student statuses in roster based on the new threshold target
  state.students = state.students.map(std => {
    const rawScore = parseFloat(std.score);
    let status = 'Ready';
    if (rawScore < state.settings.readinessTarget) {
      status = rawScore < 60 ? 'Critical Gap' : 'Gap Detected';
    }
    return { ...std, status };
  });

  res.json(state.settings);
});

// Endpoint: Update student progress/scores (from resume parse or quiz pass)
app.post('/api/student/update', (req, res) => {
  const { email, score, verifiedSkillsCount, activeGapsCount } = req.body;
  if (!email) return res.status(400).json({ error: 'Student email is required' });

  const idx = state.students.findIndex(std => std.email === email);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });

  // Update specific student variables
  if (score !== undefined) {
    state.students[idx].score = `${score}%`;
    
    // Dynamically adjust status based on current settings threshold target
    const rawScore = parseFloat(score);
    let status = 'Ready';
    if (rawScore < state.settings.readinessTarget) {
      status = rawScore < 60 ? 'Critical Gap' : 'Gap Detected';
    }
    state.students[idx].status = status;
  }
  
  if (verifiedSkillsCount !== undefined) state.students[idx].verifiedSkillsCount = Number(verifiedSkillsCount);
  if (activeGapsCount !== undefined) state.students[idx].activeGapsCount = Number(activeGapsCount);

  console.log(`[API] Updated Devon Vance profile stats: Score: ${state.students[idx].score}, Status: ${state.students[idx].status}`);
  res.json(state.students[idx]);
});

// Endpoint: Add Roadmap Step
app.post('/api/roadmap', (req, res) => {
  const { title, desc, grade, status, date } = req.body;
  if (!title || !desc) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newStep = {
    title,
    desc,
    grade: grade || '--',
    status: status || 'Locked',
    date: date || ''
  };

  state.roadmap.push(newStep);
  console.log(`[API] Created dynamic roadmap step: ${title}`);
  res.status(201).json(newStep);
});

// Proxy endpoint: Start Assessment
app.post('/api/assessment/start', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3001/api/assessment/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[Proxy Error] start:', err);
    res.status(500).json({ error: 'Failed to connect to backend scoring engine.' });
  }
});

// Proxy endpoint: Get Assessment Questions
app.get('/api/assessment/questions/:assessmentId', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:3001/api/assessment/questions/${req.params.assessmentId}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[Proxy Error] questions:', err);
    res.status(500).json({ error: 'Failed to connect to backend scoring engine.' });
  }
});

// Proxy endpoint: Submit Assessment
app.post('/api/assessment/submit', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3001/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[Proxy Error] submit:', err);
    res.status(500).json({ error: 'Failed to connect to backend scoring engine.' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`[SERVER] SRE backend is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error(`[SERVER] Failed to start server:`, err.message);
  process.exit(1);
});
