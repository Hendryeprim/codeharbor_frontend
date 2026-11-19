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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#334155] rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-6">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00FFC6]/15 text-[#00FFC6] border border-[#00FFC6]/30 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Interactive Output Screen Enabled</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#00FFC6]" />
              <span>Upload Project Deliverable</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your ZIP package or GitHub repo. The system will immediately generate a live output screen for you and Admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Project Selection */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Select Target Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#00FFC6] font-semibold"
            >
              <option value="new">✨ + Upload as a New Project Deliverable</option>
              {assignedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  📌 {p.title} ({p.primaryTechnology} • {p.status})
                </option>
              ))}
            </select>
          </div>

          {/* New Project Details (Only if 'new' is selected) */}
          {selectedProjectId === 'new' && (
            <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 space-y-3 animate-fadeIn">
              <p className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[#00FFC6]" />
                <span>New Project Specifications</span>
              </p>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Employee Management System / E-Commerce API"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Skill</label>
                  <select
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-cyan-300 font-bold focus:outline-none focus:border-[#00FFC6]"
                  >
                    {primarySkillsList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Framework</label>
                  <input
                    type="text"
                    placeholder="e.g. Django, React"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Database</label>
                  <input
                    type="text"
                    placeholder="e.g. PostgreSQL, MySQL"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Method Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="font-bold text-slate-300">Deliverable Source Package</label>
            </div>

            <div className="space-y-3">
              {/* ZIP File Input */}
              <div className="p-3.5 rounded-2xl bg-[#0B0F1A] border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Upload Source ZIP Archive</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">.zip, .tar.gz, .rar</span>
                </div>
                <input
                  type="file"
                  accept=".zip,.rar,.tar,.gz,.7z"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="w-full p-2 rounded-xl border border-slate-700 bg-[#0F172A] text-slate-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00FFC6] file:text-black cursor-pointer"
                />
                {file && (
                  <p className="text-[11px] text-[#00FFC6] mt-1.5 font-mono">
                    ✓ Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* GitHub Link Input */}
              <div className="p-3.5 rounded-2xl bg-[#0B0F1A] border border-slate-800">
                <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-purple-400" />
                  <span>GitHub Repository Link (or alternative)</span>
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/developer/my-project"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-[#0F172A] text-white focus:outline-none focus:border-[#00FFC6] font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Optional Live Demo URL */}
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="External Live Demo URL (optional, e.g. https://my-app.vercel.app)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-[#0B0F1A] text-slate-300 focus:outline-none focus:border-[#00FFC6] text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Execution / Delivery Notes (Optional)</label>
            <textarea
              rows={2}
              value={readmeContent}
              onChange={(e) => setReadmeContent(e.target.value)}
              placeholder="Features implemented, setup prerequisites, API endpoints..."
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#00FFC6]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-neon-glow flex items-center gap-2 transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{submitting ? 'Uploading & Building Output...' : '🚀 Upload & Launch Output Screen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
