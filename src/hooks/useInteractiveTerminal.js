import { useState, useCallback } from 'react';
import { employeeCurriculumAPI } from '../services/api';
import { detectLanguageInfo } from '../utils/languageDetect';

export const useInteractiveTerminal = ({ taskId, onRequirementsUpdated } = {}) => {
  const [running, setRunning] = useState(false);
  const [terminalSessionId, setTerminalSessionId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [envStatus, setEnvStatus] = useState(null);
  const [envLoading, setEnvLoading] = useState(false);
  const [creatingVenv, setCreatingVenv] = useState(false);
  const [cwd, setCwd] = useState('');

  const refreshEnv = useCallback(
    async (files = []) => {
      if (!taskId) return;
      try {
        setEnvLoading(true);
        const payload = files.map((f) => ({
          filename: f.path || f.filename,
          content: f.content ?? '',
        }));
        const res = await employeeCurriculumAPI.getEnvStatus(taskId, payload);
        if (res.success) {
          setEnvStatus(res);
        }
      } catch (err) {
        console.warn('Env status check warning:', err.message);
      } finally {
        setEnvLoading(false);
      }
    },
    [taskId]
  );

  const createVenv = useCallback(
    async (files = []) => {
      if (!taskId) return;
      try {
        setCreatingVenv(true);
        const payload = files.map((f) => ({
          filename: f.path || f.filename,
          content: f.content ?? '',
        }));
        const res = await employeeCurriculumAPI.createVenv(taskId, 'venv', payload);
        if (res.success) {
          setEnvStatus(res);
          setExecutionResult({
            stdout: `${res.message || 'Virtual environment created and activated.'}\n`,
            stderr: '',
            executionTimeMs: 0,
            exitCode: 0,
            success: true,
            detectedLanguage: 'Python',
            command: 'python -m venv venv',
          });
        }
      } catch (err) {
        setExecutionResult({
          stdout: '',
          stderr: err.message || 'Failed to create virtual environment.',
          executionTimeMs: 0,
          exitCode: 1,
          success: false,
          command: 'python -m venv venv',
        });
      } finally {
        setCreatingVenv(false);
      }
    },
    [taskId]
  );

  const runSession = useCallback(
    async ({
      files = [],
      code = '',
      entryFile = 'main.py',
      rawCommand = '',
      skillSlug = 'python',
      commandLabel = '',
    }) => {
      const cmdDisplay =
        commandLabel ||
        rawCommand ||
        `${detectLanguageInfo(entryFile, skillSlug).runPrefix || 'run'} ${entryFile}`.trim();

      try {
        setRunning(true);
        setTerminalSessionId(null);
        setExecutionResult({
          stdout: '',
          stderr: '',
          executionTimeMs: 0,
          exitCode: 0,
          success: true,
          detectedLanguage: rawCommand ? 'Shell' : detectLanguageInfo(entryFile, skillSlug).label,
          command: cmdDisplay,
        });

        const mappedFiles = files.map((f) => ({
          filename: f.path || f.filename,
          content: f.content ?? '',
        }));

        const startRes = await employeeCurriculumAPI.startTerminal(taskId, {
          code,
          projectFiles: mappedFiles,
          entryFile,
          rawCommand,
        });

        if (!startRes.success || !startRes.sessionId) {
          throw new Error(startRes.message || 'Failed to start terminal session.');
        }

        if (startRes.cwd !== undefined) setCwd(startRes.cwd);
        if (startRes.venv) {
          setEnvStatus((prev) => (prev ? { ...prev, venv: startRes.venv } : { venv: startRes.venv, summary: { totalRequired: 0, installed: 0, missing: 0, conflicts: 0 } }));
        }

        setTerminalSessionId(startRes.sessionId);
        setExecutionResult((prev) => ({
          ...(prev || {}),
          detectedLanguage: startRes.detectedLanguage || prev?.detectedLanguage,
        }));

        await employeeCurriculumAPI.streamTerminal(taskId, startRes.sessionId, {
          onStdout: (chunk) => {
            setExecutionResult((prev) => ({
              ...(prev || {}),
              stdout: (prev?.stdout || '') + chunk,
            }));
          },
          onStderr: (chunk) => {
            setExecutionResult((prev) => ({
              ...(prev || {}),
              stderr: (prev?.stderr || '') + chunk,
            }));
          },
          onExit: (info) => {
            setExecutionResult((prev) => ({
              ...(prev || {}),
              executionTimeMs: info?.executionTimeMs ?? 0,
              exitCode: info?.exitCode ?? 0,
              success: (info?.exitCode ?? 0) === 0,
            }));
            if (info?.cwd !== undefined) setCwd(info.cwd);
            if (info?.venv) {
              setEnvStatus((prev) => (prev ? { ...prev, venv: info.venv } : prev));
            }
            if (info?.requirementsContent !== undefined) {
              onRequirementsUpdated?.(info.requirementsContent);
            }
            if (info?.refreshDeps) {
              refreshEnv(files);
            }
            setTerminalSessionId(null);
            setRunning(false);
          },
        });
      } catch (err) {
        setExecutionResult((prev) => ({
          stdout: prev?.stdout || '',
          stderr: (prev?.stderr || '') + (err.message || 'Execution error occurred.'),
          executionTimeMs: 0,
          exitCode: 1,
          success: false,
          command: cmdDisplay,
        }));
      } finally {
        setTerminalSessionId(null);
        setRunning(false);
      }
    },
    [taskId, refreshEnv, onRequirementsUpdated]
  );

  const sendInput = useCallback(
    async (inputStr) => {
      if (!terminalSessionId) return;
      setExecutionResult((prev) => ({
        ...(prev || {}),
        stdout: (prev?.stdout || '') + `${inputStr}\n`,
      }));
      try {
        await employeeCurriculumAPI.sendTerminalInput(taskId, terminalSessionId, inputStr);
      } catch (err) {
        setExecutionResult((prev) => ({
          ...(prev || {}),
          stderr: (prev?.stderr || '') + `\n[Input Error]: ${err.message}`,
        }));
      }
    },
    [taskId, terminalSessionId]
  );

  const stopProcess = useCallback(async () => {
    if (!terminalSessionId) return;
    try {
      await employeeCurriculumAPI.stopTerminal(taskId, terminalSessionId);
    } catch {}
    setTerminalSessionId(null);
    setRunning(false);
  }, [taskId, terminalSessionId]);

  const clearOutput = useCallback(() => setExecutionResult(null), []);

  return {
    running,
    terminalSessionId,
    executionResult,
    setExecutionResult,
    envStatus,
    envLoading,
    creatingVenv,
    cwd,
    refreshEnv,
    createVenv,
    runSession,
    sendInput,
    stopProcess,
    clearOutput,
  };
};
