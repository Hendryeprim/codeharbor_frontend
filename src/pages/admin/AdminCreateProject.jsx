import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import {
  FolderPlus,
  ArrowLeft,
  Users,
  Code2,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminCreateProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedEmpId = searchParams.get('employeeId') || '';

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('Real-Time Project');
  const [framework, setFramework] = useState('Django');
  const [database, setDatabase] = useState('PostgreSQL');
  const [frontend, setFrontend] = useState('React');
  const [difficulty, setDifficulty] = useState('Medium');
  const [priority, setPriority] = useState('High');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [objective, setObjective] = useState('');
  const [technicalRequirements, setTechnicalRequirements] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Dynamic Required Features
  const [requirements, setRequirements] = useState([
    { title: 'User Authentication & JWT Security' },
    { title: 'CRUD Operations & Filtering' },
    { title: 'Responsive Dashboard' },
    { title: 'REST API Documentation & Endpoints' },
  ]);
  const [newRequirementText, setNewRequirementText] = useState('');

  // Submission Requirements Checkboxes
  const defaultSubmissions = [
    'Source Code',
    'README',
    'Database / SQL',
    'Screenshots',
    'GitHub URL',
    'Live Demo URL',
    'Documentation',
    'Test Cases',
    'Project Report',
  ];
  const [selectedSubmissionReqs, setSelectedSubmissionReqs] = useState([
    'Source Code',
    'README',
    'Database / SQL',
    'Screenshots',
    'GitHub URL',
    'Documentation',
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const projectTypesList = [
    'Mini Project',
    'Full Project',
    'Real-Time Project',
    'Assignment',
    'Assessment',
    'Training Project',
    'Practice Project',
  ];

  // Load active employees list
  useEffect(() => {
    const loadEmps = async () => {
      try {
        setLoadingEmployees(true);
        const res = await adminPortalAPI.getEmployees({ status: 'ACTIVE' });
        if (res.success && res.employees) {
          setEmployees(res.employees);

          // If preselected
          if (preselectedEmpId) {
            const found = res.employees.find((e) => e.id === preselectedEmpId || e.employeeId === preselectedEmpId);
            if (found) setSelectedEmployee(found);
          } else if (res.employees.length > 0) {
            setSelectedEmployee(res.employees[0]);
          }
        }
      } catch (err) {
        setError('Failed to load employee list.');
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmps();
  }, [preselectedEmpId]);

  // Handle employee dropdown selection - AUTO LOADS Primary Skill directly from EmployeeProfile
  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    const found = employees.find((emp) => emp.id === empId);
    setSelectedEmployee(found || null);
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (!newRequirementText.trim()) return;
    setRequirements([...requirements, { title: newRequirementText.trim() }]);
    setNewRequirementText('');
  };

  const handleRemoveRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const toggleSubmissionReq = (item) => {
    if (selectedSubmissionReqs.includes(item)) {
      setSelectedSubmissionReqs(selectedSubmissionReqs.filter((i) => i !== item));
    } else {
      setSelectedSubmissionReqs([...selectedSubmissionReqs, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedEmployee) {
      setError('Please select an employee to assign this project.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title,
        description,
        projectType,
        employeeProfileId: selectedEmployee.id, // Primary skill auto-resolved on backend from profile!
        framework,
        database,
        frontend,
        difficulty,
        priority,
        startDate,
        dueDate: dueDate || null,
        objective,
        requirements,
        technicalRequirements,
        additionalRequirements,
        submissionRequirements: selectedSubmissionReqs,
      };

      const res = await adminPortalAPI.createProject(payload);
      if (res.success) {
        setSuccess(res.message || 'Project created and assigned successfully!');
        setTimeout(() => {
          navigate('/admin/managed-projects');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to create and assign project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/managed-projects"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <FolderPlus className="w-6 h-6 text-purple-400" />
            <span>Create & Assign Technical Project</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Define requirements, technology stack, and assign directly to a qualified engineer.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Step 1: Employee Assignment & Auto-Loaded Skill Card */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>1. Assign Employee & Auto-Load Primary Skill</span>
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Auto-Mapping
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Select Qualified Employee <span className="text-rose-400">*</span>
              </label>
              {loadingEmployees ? (
                <div className="text-slate-500">Loading employees...</div>
              ) : (
                <select
                  value={selectedEmployee?.id || ''}
                  onChange={handleEmployeeSelect}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7] font-semibold"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId}) — {emp.primarySkill} ({emp.designation})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Auto-Loaded Profile Details (Rule 9 & 43) */}
            <div className="p-3.5 rounded-2xl bg-[#131B2E] border border-cyan-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400">
                  Auto-Loaded From Employee Profile
                </span>
                <span className="text-[10px] font-mono font-bold text-[#00FFC6]">Verified Profile</span>
              </div>

              {selectedEmployee ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">Employee ID</p>
                    <p className="font-bold text-white font-mono">{selectedEmployee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">Primary Skill</p>
                    <p className="font-black text-[#00FFC6] font-mono flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{selectedEmployee.primarySkill}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">Name</p>
                    <p className="font-semibold text-white">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">Designation</p>
                    <p className="font-semibold text-slate-300 truncate">{selectedEmployee.designation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">No employee selected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Project Classification & Tech Stack */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>2. Project Classification & Technology Stack</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Employee Management System"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Project Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              >
                {projectTypesList.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Framework</label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g. Django, Spring Boot, FastAPI, Flask"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Database</label>
              <input
                type="text"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                placeholder="e.g. PostgreSQL, MySQL, SQLite"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Frontend (Optional)</label>
              <input
                type="text"
                value={frontend}
                onChange={(e) => setFrontend(e.target.value)}
                placeholder="e.g. React, Next.js, HTML/Tailwind"
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div className="col-span-full">
              <label className="block font-bold text-slate-300 mb-1">
                Project Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of the project scope..."
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div className="col-span-full">
              <label className="block font-bold text-slate-300 mb-1">Project Objective</label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Build an employee management system with authentication, CRUD operations, attendance tracking and reporting."
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Dynamic Required Features Checklist */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Dynamic Required Features</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              {requirements.length} Feature Modules Defined
            </span>
          </div>

          {/* List of current requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requirements.map((req, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#131B2E] border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">{req.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(i)}
                  className="p-1 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add requirement input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirementText}
              onChange={(e) => setNewRequirementText(e.target.value)}
              placeholder="e.g. Export Reports to PDF, Role-based Middleware..."
              className="flex-1 p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Requirement</span>
            </button>
          </div>
        </div>

        {/* Step 4: Submission Requirements Selection */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>4. Mandatory Deliverable Items Checklist</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {defaultSubmissions.map((item) => {
              const isChecked = selectedSubmissionReqs.includes(item);
              return (
                <div
                  key={item}
                  onClick={() => toggleSubmissionReq(item)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 ${
                    isChecked
                      ? 'bg-purple-950/40 border-purple-500/60 text-white font-bold'
                      : 'bg-[#131B2E] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded text-purple-500 focus:ring-0 cursor-pointer"
                  />
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 5: Technical Requirements & Guidelines */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#334155] space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>5. Technical Guidelines & Sandbox Config</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Technical Requirements</label>
              <textarea
                rows={3}
                value={technicalRequirements}
                onChange={(e) => setTechnicalRequirements(e.target.value)}
                placeholder="Specify PEP8, Docker, unit tests with 80% coverage, specific libraries..."
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Additional Requirements / Notes</label>
              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Special testing notes or client-specific deliverables..."
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-[#0B0F1A] text-white focus:outline-none focus:border-[#A855F7]"
              />
            </div>
          </div>
        </div>

        {/* Form Submission Button */}
        <div className="pt-2 flex justify-end gap-3">
          <Link
            to="/admin/managed-projects"
            className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white font-black uppercase tracking-wider text-xs hover:brightness-110 shadow-purple-glow flex items-center gap-2 transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{submitting ? 'Creating Project & Notifying Employee...' : 'Assign Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
