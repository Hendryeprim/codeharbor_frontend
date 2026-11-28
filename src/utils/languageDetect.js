/**
 * Automatically detect programming language metadata from a filename or fallback skill.
 */
export const detectLanguageInfo = (filename = '', fallbackSkill = 'python') => {
  const lower = String(filename || '').toLowerCase().trim();
  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.')) : '';

  const map = {
    '.py': { id: 'python', label: 'Python', runPrefix: 'python', badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
    '.js': { id: 'javascript', label: 'JavaScript', runPrefix: 'node', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    '.mjs': { id: 'javascript', label: 'JavaScript', runPrefix: 'node', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    '.cjs': { id: 'javascript', label: 'JavaScript', runPrefix: 'node', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    '.jsx': { id: 'javascript', label: 'React JSX', runPrefix: 'node', badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
    '.ts': { id: 'typescript', label: 'TypeScript', runPrefix: 'node', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    '.tsx': { id: 'typescript', label: 'React TSX', runPrefix: 'node', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    '.java': { id: 'java', label: 'Java', runPrefix: 'java', badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
    '.sql': { id: 'sql', label: 'SQL', runPrefix: 'sql', badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
    '.html': { id: 'html', label: 'HTML', runPrefix: '', badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
    '.css': { id: 'css', label: 'CSS', runPrefix: '', badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
    '.json': { id: 'json', label: 'JSON', runPrefix: '', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    '.md': { id: 'markdown', label: 'Markdown', runPrefix: '', badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
    '.txt': { id: 'text', label: 'Text', runPrefix: '', badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
    '.yml': { id: 'yaml', label: 'YAML', runPrefix: '', badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    '.yaml': { id: 'yaml', label: 'YAML', runPrefix: '', badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  };

  if (ext && map[ext]) return map[ext];

  const fb = String(fallbackSkill || 'python').toLowerCase();
  if (fb.includes('java')) return map['.java'];
  if (fb.includes('sql')) return map['.sql'];
  if (fb.includes('js') || fb.includes('node')) return map['.js'];
  return map['.py'];
};

/**
 * Resolve a terminal command:
 * - clear/cls -> clear output
 * - filename or "python file.py" matching workspace file -> run file
 * - pip / git / cd / pwd / python -m / shell commands -> execute in real workspace shell
 */
export const resolveTerminalCommand = (rawInput, files = []) => {
  const trimmed = String(rawInput || '').trim();
  if (!trimmed) return { type: 'empty' };

  const lower = trimmed.toLowerCase();
  if (lower === 'clear' || lower === 'cls') return { type: 'clear' };

  // Shell built-ins, pip, git, flags, or redirections go straight to real workspace shell
  const shellPrefixes = [
    'pip ', 'pip3 ', 'git ', 'cd ', 'cd', 'pwd', 'ls', 'dir', 'mkdir ', 'rmdir ',
    'touch ', 'cat ', 'type ', 'echo ', 'rm ', 'del ', 'cp ', 'mv ', 'which ', 'where ',
  ];
  if (
    lower === 'pip' ||
    lower === 'pip3' ||
    lower === 'git' ||
    shellPrefixes.some((p) => lower === p.trim() || lower.startsWith(p)) ||
    /[>|&]/.test(trimmed) ||
    /\s-[a-zA-Z]/.test(trimmed)
  ) {
    return { type: 'shell', command: trimmed };
  }

  // Strip known runner prefixes: python, python3, node, java, sql, run
  const parts = trimmed.split(/\s+/);
  const runners = new Set(['python', 'python3', 'py', 'node', 'java', 'javac', 'sql', 'sqlite3', 'run']);
  let candidate = trimmed;
  if (parts.length >= 2 && runners.has(parts[0].toLowerCase())) {
    candidate = parts.slice(1).join(' ').replace(/^["']|["']$/g, '');
  } else {
    candidate = candidate.replace(/^["']|["']$/g, '');
  }

  const normCandidate = candidate.replace(/\\/g, '/').replace(/^\.\//, '');
  const exactMatch = files.find(
    (f) => (f.path || f.filename || '').replace(/\\/g, '/') === normCandidate
  );
  if (exactMatch) {
    return { type: 'run', file: exactMatch, command: trimmed };
  }

  const baseMatch = files.find((f) => {
    const p = (f.path || f.filename || '').replace(/\\/g, '/');
    const base = p.split('/').pop();
    return p.toLowerCase() === normCandidate.toLowerCase() || base.toLowerCase() === normCandidate.toLowerCase();
  });

  if (baseMatch) {
    return { type: 'run', file: baseMatch, command: trimmed };
  }

  // Fallback to real workspace shell so commands like "python --version" or newly created files work
  return { type: 'shell', command: trimmed };
};
