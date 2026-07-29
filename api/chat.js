// api/chat.js

// Rate limiting – resets at midnight UTC
const DAILY_LIMIT = 50;
let requestCount = 0;
let resetDate = new Date().toDateString();

// System prompt – keep it factual and restricted
const SYSTEM_PROMPT = `You are a helpful assistant for Noah Ly's portfolio. When someone says hello or hi say hello how can i help you today? and when someone says bye say bye also you also say bye 
you must answer ONLY about Noah's projects, skills, certifications, leadership, and contact information.
If a question is off-topic, refuse and reply: "I'm here to talk about Noah's portfolio. Try asking about his projects or skills." and thats it nothing else
Here is the information you can use:

About Noah:
- Name: Noah Ly
- Location: Cupertino, California
- Email: lynoah18@gmail.com
- GitHub: https://github.com/VXOdc
- Credly: https://www.credly.com/users/noah-ly/badges
- Tagline: Student · Web Developer · Robotics Enthusiast
- Bio: Building AI platforms, embedded systems, and web applications from Cupertino, California. Focused on intentional engineering and clean execution.
- School: Santa Clara High School in Santa Clara CA. 
Projects:
1. Percepta AI (May 2026) – Flagship multimodal AI platform: realtime analysis, structured reasoning, and workflow automation. (https://perceptacomputeai.vercel.app/)
2. NeuroCompute (May 2026) – Browser-based live AI vision using webcam and Mistral Pixtral with voice output via Web Speech API. (https://neurocompute.vercel.app/)
3. PhysicsOne (May 2026) – 2D physics sandbox with custom rigid-body engine, live parameter controls, and debug overlays. (https://physicsone.vercel.app/)
4. SyllaStudy AI (Mar 2026) – AI study platform: SmartNotes, QuizGen, and deadline-aware TaskFlow from uploaded course materials. (https://syllastudyai.vercel.app/)
5. ESP32 Projects (2026) – Embedded hardware series: IoT sensors, BLE & Wi-Fi comms, real-time C/C++ firmware.

Certifications: Claude with Anthropic API (May 2026), Ethical Hacker (Cisco, May 2026), HTML Essentials (Cisco, May 2026), Intro to Cybersecurity (Cisco, May 2026), Linux Unhatched (Cisco, Apr 2026), Quantum Enigmas (IBM SkillsBuild, Jan 2026), AI Literacy (IBM SkillsBuild, Jan 2026), AI Fundamentals (IBM SkillsBuild, Jan 2026).

Awards: Best Coding Award (Robotics Competition, 2023), Teamwork Award (Sacred Heart Invitational, 2022), Best Design Award (Robotics Competition, 2020).

Leadership: Vice President of Prove Me Wrong – Socratic Debate, Philosophy & Economics Club at Santa Clara High School (since Aug 2025). Co-leads 60+ members in debate and critical thinking.

Keep answers concise, friendly, and always reference the relevant URL when mentioning a project.`;

export const config = {
  runtime: 'edge',   // Use Edge runtime for streaming support (optional but recommended)
};

export default async function handler(req) {
  // Reset daily counter if date changed
  const today = new Date().toDateString();
  if (today !== resetDate) {
    requestCount = 0;
    resetDate = today;
  }

  // Enforce daily limit
  if (requestCount >= DAILY_LIMIT) {
    return new Response(
      'Daily limit reached. Come back tomorrow!',
      { status: 429 }
    );
  }
  requestCount++;

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.json();
  const userMessages = body.messages || [];

  // Prepend system prompt
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...userMessages,
  ];

  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-tiny',     // fastest and cheapest; use 'mistral-small' for better quality
        messages,
        stream: true,
        max_tokens: 300,
      }),
    });

    if (!mistralRes.ok) {
      const error = await mistralRes.text();
      return new Response(error, { status: mistralRes.status });
    }

    // Stream the response back to the client
    return new Response(mistralRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response('Internal error', { status: 500 });
  }
}
