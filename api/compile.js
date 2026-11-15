// Vercel Serverless Function: High-Speed Sandboxed C Compilation & Execution Engine
// Powered by GCC (C11/C99) with full stdin support for scanf, getchar, fgets, and more

export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { code, stdin = '' } = req.body || {};

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'Code is required as a string.',
      stdout: '',
      stderr: 'Error: No source code provided to compiler.',
      status: 'error',
      executionTimeMs: 0
    });
  }

  if (code.length > 65536) {
    return res.status(413).json({
      error: 'Payload too large.',
      stdout: '',
      stderr: 'Error: Code exceeds maximum allowed size (64KB).',
      status: 'error',
      executionTimeMs: 0
    });
  }

  const startTime = Date.now();

  // Tier 1: Judge0 CE Ultra-fast Execution Engine
  try {
    const judgeCtrl = new AbortController();
    const judgeTimeout = setTimeout(() => judgeCtrl.abort(), 7000);

    const judgeRes = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: 50, // C (GCC 9.2.0)
        stdin: typeof stdin === 'string' ? stdin : ''
      }),
      signal: judgeCtrl.signal
    });

    clearTimeout(judgeTimeout);

    if (judgeRes.ok) {
      const data = await judgeRes.json();
      const endTime = Date.now();
      const stdout = data.stdout || '';
      const stderr = (data.stderr || data.compile_output || data.message || '').trim();
      const isAccepted = data.status?.id === 3;

      return res.status(200).json({
        stdout: stdout,
        stderr: stderr,
        status: isAccepted ? 'success' : 'error',
        executionTimeMs: Math.max(12, Math.round(data.time ? parseFloat(data.time) * 1000 : endTime - startTime)),
        memoryKb: data.memory || null,
        compiler: 'GCC 9.2.0 (C11 Standard)'
      });
    }
  } catch {
    // Judge0 failed or timed out, seamlessly proceed to Tier 2 (Wandbox GCC)
  }

  // Tier 2: Wandbox GCC 13.2 High-Fidelity Linux Sandbox
  try {
    const wandboxCtrl = new AbortController();
    const wandboxTimeout = setTimeout(() => wandboxCtrl.abort(), 8000);

    const wandboxRes = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        compiler: 'gcc-13.2.0-c',
        code: code,
        stdin: typeof stdin === 'string' ? stdin : ''
      }),
      signal: wandboxCtrl.signal
    });

    clearTimeout(wandboxTimeout);

    if (wandboxRes.ok) {
      const data = await wandboxRes.json();
      const endTime = Date.now();
      const stdout = data.program_output || '';
      const stderr = (data.compiler_error || data.compiler_message || data.program_error || '').trim();
      const isSuccess = data.status === '0' && (!stderr || !stderr.includes('error:'));

      return res.status(200).json({
        stdout: stdout,
        stderr: stderr,
        status: isSuccess ? 'success' : 'error',
        executionTimeMs: endTime - startTime,
        compiler: 'GCC 13.2.0'
      });
    }
  } catch (err) {
    const duration = Date.now() - startTime;
    const isTimeout = err?.name === 'AbortError' || duration >= 7500;

    return res.status(200).json({
      stdout: '',
      stderr: isTimeout 
        ? '⏱️ Execution Timed Out: Program execution exceeded time limit. Check for infinite loops or missing inputs for scanf.'
        : `Execution error: ${err?.message || 'Remote sandbox unreachable'}`,
      status: 'error',
      executionTimeMs: duration
    });
  }

  return res.status(500).json({
    stdout: '',
    stderr: 'All remote compiler backends unavailable.',
    status: 'error',
    executionTimeMs: Date.now() - startTime
  });
}
