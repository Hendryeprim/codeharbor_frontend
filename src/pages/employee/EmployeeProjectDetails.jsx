import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../services/api';
import { LivePreviewModal } from '../../components/common/LivePreviewModal';
import {
  FolderGit2,
  Calendar,
  Layers,
  Code2,
  Database,
  CheckCircle2,
  Clock,
  Play,
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Github,
  Globe,
  FileCode,
  FileText,
  AlertCircle,
  X,
  Send,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

export const EmployeeProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Delete Project Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Output Screen Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [activeVersionId, setActiveVersionId] = useState(null);

  const openPreview = (url, title, versionId = null) => {
    if (!url) return;
    setActivePreviewUrl(url);
    setPreviewTitle(title || project?.title || 'Live Project Output');
    setActiveVersionId(versionId);
    setPreviewModalOpen(true);
  };

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  // Upload Form State
  const [file, setFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [readmeContent, setReadmeContent] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Progress Form State
  const [progressValue, setProgressValue] = useState(0);
  const [checkedRequirements, setCheckedRequirements] = useState([]);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await employeeAPI.getProjectById(id);
      if (res.success) {
        setProject(res.project);
        setAssignment(res.assignment);
        setProgressValue(res.project.progress || 0);
        const completed = (res.project.requirements || [])
          .filter((r) => r.isCompleted)
          .map((r) => r.id);
        setCheckedRequirements(completed);
      }
    } catch (err) {
      setError(err.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);
      setError('');
      const res = await employeeAPI.deleteProject(id);
      if (res.success) {
        navigate('/employee/projects', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartProject = async () => {
    try {
      const res = await employeeAPI.startProject(id);
      if (res.success) {
        setActionSuccess('Project started! Status is now In Progress.');
        fetchProjectDetails();
      }
    } catch (err) {
      setError(err.message || 'Failed to start project.');
    }
  };

  const handleUpdateProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProgress(true);
      const res = await employeeAPI.updateProgress(id, {
        progress: progressValue,
        completedRequirements: checkedRequirements,
      });
      if (res.success) {
        setActionSuccess('Project progress and requirement milestones saved!');
        setProgressModalOpen(false);
        fetchProjectDetails();
      }
    } catch (err) {
      setError(err.message || 'Failed to update progress.');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    if (!file && !githubUrl && !liveDemoUrl) {
      setUploadError('Please select a project package file (.zip/.tar/.rar) or provide a GitHub URL.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (githubUrl) formData.append('githubUrl', githubUrl);
      if (liveDemoUrl) formData.append('liveDemoUrl', liveDemoUrl);
      if (readmeContent) formData.append('readmeContent', readmeContent);
      if (documentation) formData.append('documentation', documentation);
      if (notes) formData.append('notes', notes);

      const res = await employeeAPI.uploadSubmission(id, formData);
      if (res.success) {
        setActionSuccess(res.message || 'Project version uploaded and submitted successfully!');
        setUploadModalOpen(false);
        setFile(null);
        setGithubUrl('');
        setLiveDemoUrl('');
        setReadmeContent('');
        await fetchProjectDetails();

        // If an output screen was generated, immediately open it for the employee!
        if (res.version?.liveDemoUrl) {
          openPreview(res.version.liveDemoUrl, `${project?.title || 'Project'} (v${res.version.versionNumber})`, res.version.id);
        }
      }
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const toggleRequirementCheckbox = (reqId) => {
    if (checkedRequirements.includes(reqId)) {
      setCheckedRequirements(checkedRequirements.filter((i) => i !== reqId));
    } else {
      setCheckedRequirements([...checkedRequirements, reqId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00FFC6]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 bg-rose-950/40 border border-rose-800 rounded-3xl text-rose-300 text-sm space-y-3">
        <div className="flex items-center gap-2 font-bold text-base">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>Access Restricted or Not Found</span>
        </div>
        <p>{error || 'Project not found.'}</p>
        <Link to="/employee/projects" className="inline-block text-xs font-bold text-[#00FFC6] underline">
          &larr; Back to My Projects
        </Link>
      </div>
    );
  }

  const submissions = project.submissions || [];
  const latestSubmission = submissions[0] || null;
  const allVersions = latestSubmission?.versions || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Alerts */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/employee/projects" className="hover:text-white transition">My Projects</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-bold truncate">{project.title}</span>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Project Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#140F28] to-[#1E1B4B] border border-[#334155]/80 p-6 sm:p-8 shadow-harbor-lg">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {project.projectType}
              </span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  project.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : project.status === 'REVISION_REQUIRED'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : project.status === 'IN_PROGRESS'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {project.status.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                Priority: {project.priority}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{project.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{project.description}</p>

            {project.objective && (
              <div className="p-3.5 rounded-2xl bg-[#0B0F1A]/70 border border-slate-800 text-xs">
                <p className="text-[10px] uppercase font-mono font-bold text-[#00FFC6] mb-1">Project Objective</p>
                <p className="text-slate-300">{project.objective}</p>
              </div>
            )}
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            {/* Live Output Screen Button (Available as soon as project has any submission) */}
            {allVersions.length > 0 && allVersions[0]?.liveDemoUrl && (
              <button
                type="button"
                onClick={() =>
                  openPreview(
                    allVersions[0].liveDemoUrl,
                    `${project.title} (v${allVersions[0].versionNumber})`,
                    allVersions[0].id
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-2 shadow-neon-glow"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>View Live Output Screen</span>
              </button>
            )}

            {project.status === 'ASSIGNED' && (
              <button
                onClick={handleStartProject}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-2 shadow-neon-glow"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Project</span>
              </button>
            )}

            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-2 shadow-neon-glow"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{allVersions.length > 0 ? 'Upload Revision (v2+)' : 'Upload & Submit Project'}</span>
            </button>

            <button
              onClick={() => setProgressModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-300 font-semibold text-xs hover:border-[#00FFC6] transition flex items-center justify-center gap-2"
            >
              <Clock className="w-3.5 h-3.5 text-[#00FFC6]" />
              <span>Milestone Progress</span>
            </button>

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-400 font-bold text-xs hover:bg-rose-900/60 transition flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete Project</span>
            </button>
          </div>
        </div>

        {/* Progress & Milestones Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Completion Progress</span>
            <span className="font-bold text-[#00FFC6]">{project.progress}% Completed</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications & Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Assigned Technology</p>
          <p className="font-bold text-[#00FFC6] text-sm mt-0.5 flex items-center gap-1.5">
            <Code2 className="w-4 h-4" />
            <span>{project.primarySkill}</span>
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Framework</p>
          <p className="font-semibold text-white text-sm mt-0.5 truncate">{project.framework || 'Standard Library'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Database Architecture</p>
          <p className="font-semibold text-white text-sm mt-0.5 flex items-center gap-1.5 truncate">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>{project.database || 'None'}</span>
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold">Target Due Date</p>
          <p className="font-semibold text-white text-sm mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Open Deadline'}</span>
          </p>
        </div>
      </div>

      {/* Required Features Checklist */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00FFC6]" />
            <span>Required Project Features</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {checkedRequirements.length} of {project.requirements?.length || 0} Complete
          </span>
        </div>

        {project.requirements && project.requirements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {project.requirements.map((req) => {
              const isChecked = checkedRequirements.includes(req.id);
              return (
                <div
                  key={req.id}
                  onClick={() => toggleRequirementCheckbox(req.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-[#00FFC6]/10 border-[#00FFC6]/40 text-white'
                      : 'bg-[#131B2E] border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-[#00FFC6] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <p className={`font-bold ${isChecked ? 'text-[#00FFC6] line-through' : 'text-white'}`}>
                      {req.title}
                    </p>
                    {req.description && <p className="text-[11px] text-slate-400 mt-0.5">{req.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No specific micro-features listed by admin.</p>
        )}
      </div>

      {/* Submission Requirements & Technical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submission Checklist */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00FFC6]" />
            <span>Mandatory Deliverables Checklist</span>
          </h3>
          <div className="space-y-2 text-xs">
            {(project.submissionRequirements || ['Source Code', 'README', 'Database / SQL']).map((req, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#131B2E] border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#00FFC6] shrink-0" />
                <span className="text-slate-200 font-medium">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical & Additional Instructions */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00FFC6]" />
            <span>Technical & Architecture Guidelines</span>
          </h3>
          <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
            {project.technicalRequirements ? (
              <p className="bg-[#131B2E] p-3 rounded-2xl border border-slate-800 whitespace-pre-line">
                {project.technicalRequirements}
              </p>
            ) : (
              <p className="text-slate-500">Standard project architecture guidelines apply.</p>
            )}
            {project.additionalRequirements && (
              <div>
                <p className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">Additional Notes</p>
                <p className="bg-[#131B2E] p-3 rounded-2xl border border-slate-800">{project.additionalRequirements}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Versions & Admin Review History */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00FFC6]" />
          <span>Deliverables & Version History</span>
        </h2>

        {allVersions.length === 0 ? (
          <div className="p-8 text-center bg-[#131B2E] border border-slate-800 rounded-2xl text-xs text-slate-400">
            No submissions uploaded yet. Click "Upload & Submit" when ready to submit your work.
          </div>
        ) : (
          <div className="space-y-4">
            {allVersions.map((v) => {
              const latestExec = v.executions?.[0] || null;
              const latestFeedback = v.feedbacks?.[0] || null;

              return (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-[#131B2E] border border-slate-700/70 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-cyan-950 text-[#00FFC6] border border-cyan-500/40">
                        Version {v.versionNumber}
                      </span>
                      <span className="text-slate-400">
                        Submitted: {new Date(v.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {v.liveDemoUrl && (
                        <button
                          type="button"
                          onClick={() => openPreview(v.liveDemoUrl, `${project.title} (v${v.versionNumber})`, v.id)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-[#00FFC6] text-black font-extrabold flex items-center gap-1.5 font-mono text-[11px] hover:brightness-110 shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>View Output Screen</span>
                        </button>
                      )}
                      {v.githubUrl && (
                        <a
                          href={v.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {v.fileName && (
                    <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                      <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Archive Package: {v.fileName}</span>
                    </div>
                  )}

                  {/* Automated Execution Results if available */}
                  {latestExec && (
                    <div className="p-3.5 rounded-xl bg-[#0B0F1A] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-400 font-bold uppercase">Automated Sandbox Verification</span>
                        <span
                          className={`font-black px-2 py-0.5 rounded ${
                            latestExec.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {latestExec.status}
                        </span>
                      </div>
                      {latestExec.testResults && latestExec.testResults.length > 0 && (
                        <div className="space-y-1">
                          {latestExec.testResults.map((tr) => (
                            <div key={tr.id} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-300">{tr.testName}</span>
                              <span className={tr.status === 'PASS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {tr.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Feedback Box */}
                  {latestFeedback && (
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>Admin Evaluation & Feedback</span>
                        </span>
                        {latestFeedback.overallScore != null && (
                          <span className="text-sm font-black text-[#00FFC6] font-mono">
                            Score: {latestFeedback.overallScore}/100
                          </span>
                        )}
                      </div>
                      {latestFeedback.comments && (
                        <p className="text-slate-300">{latestFeedback.comments}</p>
                      )}
                      {latestFeedback.requiredChanges && (
                        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                          <p className="font-bold text-[10px] uppercase font-mono text-rose-400">Required Changes:</p>
                          <p className="mt-0.5">{latestFeedback.requiredChanges}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Progress Modal */}
      {progressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140F28] border border-[#322659] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-harbor-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Update Project Progress</h3>
              <button onClick={() => setProgressModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-300">Completion Percentage</label>
                  <span className="font-mono text-[#00FFC6] font-bold text-sm">{progressValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full accent-[#00FFC6] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProgressModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProgress}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black hover:brightness-110 shadow-neon-glow"
                >
                  {updatingProgress ? 'Saving...' : 'Save Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Project Submission Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#140F28] border border-[#322659] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-harbor-lg my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Upload Project Submission</h3>
                <p className="text-[11px] text-slate-400">
                  Every submission generates an immutable new version record.
                </p>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* File Upload */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Project Archive Package (.ZIP, .RAR, .TAR.GZ)
                </label>
                <input
                  type="file"
                  accept=".zip,.rar,.tar,.gz,.7z"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="w-full p-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-slate-200 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00FFC6] file:text-black cursor-pointer"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">GitHub Repository Link</label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/developer/repo"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#00FFC6]"
                  />
                </div>
              </div>

              {/* Live Demo URL */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Live Demo URL (Optional)</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#00FFC6]"
                  />
                </div>
              </div>

              {/* Readme content */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">README / Execution Notes</label>
                <textarea
                  rows={3}
                  value={readmeContent}
                  onChange={(e) => setReadmeContent(e.target.value)}
                  placeholder="How to run, prerequisites, and features implemented..."
                  className="w-full p-3 rounded-xl border border-[#322659] bg-[#0A0713] text-white focus:outline-none focus:border-[#00FFC6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0A0713] font-black hover:brightness-110 shadow-neon-glow flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? 'Validating & Uploading...' : 'Upload & Submit Version'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Live Output Screen Modal */}
      <LivePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        previewUrl={activePreviewUrl}
        projectTitle={previewTitle}
        versionId={activeVersionId}
      />

      {/* Delete Project Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#140F28] border border-rose-800/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-800">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Delete Project</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete <strong className="text-white font-mono">"{project?.title}"</strong>? All associated deliverables, version executions, and live preview containers will be removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
