import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import {
  UploadCloud,
  X,
  Github,
  Globe,
  FileCode,
  FileText,
  AlertCircle,
  Code2,
  Database,
  Sparkles,
  Layers,
  FolderGit2,
} from 'lucide-react';

export const UploadProjectModal = ({ isOpen, onClose, onSuccess, defaultProjectId = '' }) => {
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId || 'new');
  const [title, setTitle] = useState('');
  const [primarySkill, setPrimarySkill] = useState('Python');
  const [framework, setFramework] = useState('');
  const [database, setDatabase] = useState('PostgreSQL');
  const [description, setDescription] = useState('');

  // Source options
  const [uploadType, setUploadType] = useState('zip'); // 'zip' | 'github' | 'both'
  const [file, setFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const primarySkillsList = [
    'Python',
    'Java',
    'SQL',
    'Database',
    'Data Analyst',
    'Django',
    'Flask',
    'FastAPI',
    'React',
    'Node.js',
    'Full Stack',
    'Machine Learning',
    'Other',
  ];

  useEffect(() => {
    if (isOpen) {
      setError('');
      // Fetch employee's assigned projects for dropdown
      employeeAPI.getProjects().then((res) => {
        if (res.success && res.projects) {
          setAssignedProjects(res.projects);
          if (defaultProjectId) {
            setSelectedProjectId(defaultProjectId);
          } else if (res.projects.length > 0) {
            setSelectedProjectId(res.projects[0].id);
          } else {
            setSelectedProjectId('new');
          }
        }
      }).catch(() => {});
    }
  }, [isOpen, defaultProjectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file && !githubUrl.trim() && !liveDemoUrl.trim()) {
      setError('Please select a project package file (.zip) or provide a GitHub repository URL.');
      return;
    }

    if (selectedProjectId === 'new' && !title.trim() && !file) {
      setError('Please provide a Project Name.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (githubUrl.trim()) formData.append('githubUrl', githubUrl.trim());
      if (liveDemoUrl.trim()) formData.append('liveDemoUrl', liveDemoUrl.trim());
      if (readmeContent.trim()) formData.append('readmeContent', readmeContent.trim());

      if (selectedProjectId === 'new') {
        formData.append('title', title.trim() || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Project Deliverable'));
        formData.append('primarySkill', primarySkill);
        if (framework.trim()) formData.append('framework', framework.trim());
        if (database.trim()) formData.append('database', database.trim());
        if (description.trim()) formData.append('description', description.trim());

        const res = await employeeAPI.uploadDirectProject(formData);
        if (res.success) {
          onClose();
          if (onSuccess) onSuccess(res);
        } else {
          setError(res.message || 'Upload failed.');
        }
      } else {
        const res = await employeeAPI.uploadSubmission(selectedProjectId, formData);
        if (res.success) {
          onClose();
          if (onSuccess) onSuccess(res);
        } else {
          setError(res.message || 'Upload failed.');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to upload project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#334155] rounded-2xl max-w-xl w-full max-h-[95vh] flex flex-col p-3.5 sm:p-5 shadow-2xl my-auto">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0EA5E9]/20 to-[#00FFC6]/20 border border-[#00FFC6]/30 flex items-center justify-center text-[#00FFC6] shrink-0">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white">Upload Project Deliverable</h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#00FFC6]/15 text-[#00FFC6] border border-[#00FFC6]/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  Live Output
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2 shrink-0 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden mt-2">
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 text-xs">
            {/* Target Project Selection */}
            <div>
              <label className="block font-bold text-slate-300 mb-1 text-[11px]">Select Target Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#00FFC6] font-semibold text-xs"
              >
                <option value="new">✨ + Upload as a New Project Deliverable</option>
                {assignedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    📌 {p.title} ({p.primaryTechnology} • {p.status})
                  </option>
                ))}
              </select>
            </div>

            {/* New Project Specifications (if 'new') */}
            {selectedProjectId === 'new' && (
              <div className="p-2.5 rounded-xl bg-[#070A12] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span className="flex items-center gap-1 text-[#00FFC6]">
                    <FolderGit2 className="w-3 h-3" />
                    New Project Specifications
                  </span>
                  <span className="text-slate-500">* Required</span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Project Name (e.g. Employee Portal)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6] text-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-700 bg-[#0F172A] text-cyan-300 font-bold focus:outline-none focus:border-[#00FFC6] text-xs"
                  >
                    {primarySkillsList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Framework"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Database"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6] text-xs"
                  />
                </div>
              </div>
            )}

            {/* Deliverable Source Package - Compact */}
            <div className="p-2.5 rounded-xl bg-[#0B0F1A] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deliverable Package Source</span>
                </span>
                <span className="text-[9px] text-slate-500 font-mono">ZIP Archive or GitHub Link</span>
              </div>

              {/* ZIP Input Row */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".zip,.rar,.tar,.gz,.7z"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="w-full p-1.5 rounded-lg border border-slate-700 bg-[#0F172A] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#00FFC6] file:text-black cursor-pointer text-xs"
                />
              </div>
              {file && (
                <p className="text-[10px] text-[#00FFC6] font-mono truncate">
                  ✓ Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}

              {/* GitHub Link Row */}
              <div className="relative">
                <Github className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="GitHub Repository URL (e.g. https://github.com/user/project)"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6] font-mono text-[11px]"
                />
              </div>

              {/* Optional Demo URL Row */}
              <div className="relative">
                <Globe className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="External Live Demo URL (optional)"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#0F172A] text-slate-300 focus:outline-none focus:border-[#00FFC6] text-[11px]"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1 text-[11px]">Execution / Delivery Notes (Optional)</label>
              <textarea
                rows={2}
                value={readmeContent}
                onChange={(e) => setReadmeContent(e.target.value)}
                placeholder="Setup instructions, credentials, or features..."
                className="w-full p-2 rounded-lg border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#00FFC6] text-xs resize-none"
              />
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-neon-glow flex items-center gap-1.5 transition"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{submitting ? 'Uploading & Building...' : '🚀 Upload & Launch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
