import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employeeCurriculumAPI } from '../../services/api';
import {
  Code2,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Terminal,
  AlertCircle,
  FolderGit2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const EmployeeSkillTracks = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('BASIC');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await employeeCurriculumAPI.getMySkills();
        if (res.success && res.skills) {
          setSkills(res.skills);
          if (res.skills.length > 0) {
            setSelectedSkill(res.skills[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load assigned skills.');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if (!selectedSkill) return;

    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        const res = await employeeCurriculumAPI.getSkillTasks(selectedSkill.slug, selectedLevel);
        if (res.success) {
          setTasks(res.tasks || []);
        }
      } catch (err) {
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [selectedSkill, selectedLevel]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00FFC6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-rose-950/40 border border-rose-800 rounded-3xl text-rose-300 text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl space-y-3">
        <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
        <h3 className="text-base font-bold text-white">No Skills Assigned Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your administrator has not yet assigned any technical skill tracks to your profile. Please contact your manager or administrator.
        </p>
      </div>
    );
  }

  const levelsConfig = [
    {
      key: 'BASIC',
      name: 'Basic',
      desc: 'Foundational syntax, operations & standard algorithms',
      info: selectedSkill?.levels?.BASIC,
    },
    {
      key: 'INTERMEDIATE',
      name: 'Intermediate',
      desc: 'Object-oriented patterns, parsing, structures & modular design',
      info: selectedSkill?.levels?.INTERMEDIATE,
    },
    {
      key: 'ADVANCED',
      name: 'Advanced',
      desc: 'Complete project-level architecture, multi-file execution & UI preview',
      info: selectedSkill?.levels?.ADVANCED,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00FFC6] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Curriculum & Learning Path</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Skill-Based Task Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Complete and submit tasks for each level sequentially. Once an administrator approves all required tasks in your current level, the next level unlocks automatically!
        </p>
      </div>

      {/* 1. Assigned Skills Selector */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
          My Assigned Skills ({skills.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {skills.map((s) => {
            const isSelected = selectedSkill?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSkill(s);
                  setSelectedLevel('BASIC');
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#0EA5E9]/20 to-[#00FFC6]/15 border-[#00FFC6] shadow-neon-glow'
                    : 'bg-[#0F172A] border-[#334155]/80 hover:border-slate-500 hover:bg-[#131B2E]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? 'bg-[#00FFC6] text-black font-black' : 'bg-slate-800 text-cyan-400'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
                    {s.unlockedLevel}
                  </span>
                </div>
                <p className="text-sm font-black text-white truncate">{s.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {s.levels?.BASIC?.taskCount + s.levels?.INTERMEDIATE?.taskCount + s.levels?.ADVANCED?.taskCount} tasks total
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Three-Level Unlock System for Selected Skill */}
      {selectedSkill && (
        <div className="space-y-6">
          <div className="border-t border-[#334155]/60 pt-6">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>{selectedSkill.name}</span>
              <span className="text-slate-500 font-normal">—</span>
              <span className="text-sm text-cyan-300 font-semibold">3-Level Progression Path</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedSkill.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levelsConfig.map((lvl) => {
              const isUnlocked = lvl.info?.isUnlocked;
              const isCompleted = lvl.info?.status === 'COMPLETED';
              const isSelected = selectedLevel === lvl.key;

              return (
                <div
                  key={lvl.key}
                  onClick={() => {
                    if (isUnlocked) setSelectedLevel(lvl.key);
                  }}
                  className={`p-5 rounded-3xl border transition-all relative ${
                    isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                  } ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#131B2E] to-[#0F172A] border-[#00FFC6] shadow-neon-glow'
                      : isUnlocked
                      ? 'bg-[#0F172A] border-[#334155] hover:border-slate-500'
                      : 'bg-[#0B0F19] border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-400">
                      Level: {lvl.name}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#00FFC6] bg-[#00FFC6]/10 px-2.5 py-0.5 rounded-full border border-[#00FFC6]/30">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white">{lvl.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{lvl.desc}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{lvl.info?.taskCount || 0} Tasks</span>
                    {isUnlocked ? (
                      <span className="text-xs font-bold text-[#00FFC6] flex items-center gap-1">
                        <span>{isSelected ? 'Viewing Tasks' : 'Click to View'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Unlocks after approval</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Tasks List for Selected Level */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>
                    {selectedSkill.name} — {selectedLevel} Level Tasks ({tasks.length})
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Write code in the editor, run with live execution output, and submit for Admin review.
                </p>
              </div>
            </div>

            {tasksLoading ? (
              <div className="min-h-[25vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-8 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
                No active tasks found in {selectedLevel} level for {selectedSkill.name}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => {
                  const sub = task.mySubmission;
                  const isApproved = sub?.status === 'APPROVED';
                  const isPending = sub?.status === 'PENDING_REVIEW';
                  const isRejected = sub?.status === 'REJECTED';

                  const workspaceUrl =
                    selectedLevel === 'ADVANCED'
                      ? `/employee/skills/${selectedSkill.slug}/advanced/${task.id}`
                      : `/employee/skills/${selectedSkill.slug}/tasks/${task.id}`;

                  return (
                    <div
                      key={task.id}
                      className="p-5 rounded-3xl bg-[#0F172A] border border-[#334155] hover:border-slate-500 transition-all flex flex-col justify-between space-y-4 shadow-harbor-sm"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              task.difficulty === 'EASY'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : task.difficulty === 'MEDIUM'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {task.difficulty}
                          </span>

                          {isApproved ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approved ✓</span>
                            </span>
                          ) : isPending ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>Pending Review</span>
                            </span>
                          ) : isRejected ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                              <AlertCircle className="w-3 h-3" />
                              <span>Revisions Needed</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500 font-bold">
                              Not Started
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-black text-white">{task.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2">{task.description}</p>

                        {task.githubRepoUrl && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="truncate">{task.githubRepoUrl}</span>
                          </div>
                        )}

                        {isRejected && sub?.adminComment && (
                          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-[11px] text-rose-300">
                            <strong>Admin Correction:</strong> {sub.adminComment}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {selectedLevel === 'ADVANCED' ? 'Multi-file Project' : 'In-browser Editor'}
                        </span>
                        <Link
                          to={workspaceUrl}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-neon-glow hover:brightness-110 transition"
                        >
                          <span>{isApproved ? 'View Workspace' : isRejected ? 'Edit & Resubmit' : isPending ? 'View Submission' : 'Open Workspace'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
