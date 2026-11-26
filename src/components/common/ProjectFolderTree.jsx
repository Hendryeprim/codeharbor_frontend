import React, { useMemo, useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode2,
  ChevronRight,
  ChevronDown,
  Download,
  Loader2,
  Trash2,
} from 'lucide-react';

/**
 * Build a nested tree structure from flat file paths like "src/utils/calc.py"
 */
const buildTree = (files) => {
  const root = { name: '', path: '', type: 'folder', children: {} };

  for (const file of files) {
    const filePath = (file.path || file.filename || '').replace(/\\/g, '/').replace(/^\/+/, '');
    if (!filePath) continue;
    const parts = filePath.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join('/');

      if (isFile) {
        current.children[part] = {
          name: part,
          path: filePath,
          type: 'file',
          file,
        };
      } else {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: currentPath,
            type: 'folder',
            children: {},
          };
        }
        current = current.children[part];
      }
    }
  }

  const sortNodes = (childrenObj) => {
    return Object.values(childrenObj)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((node) =>
        node.type === 'folder' ? { ...node, items: sortNodes(node.children) } : node
      );
  };

  return sortNodes(root.children);
};

const TreeNode = ({ node, depth, activeFile, onSelectFile, onDeleteFile, expandedFolders, toggleFolder }) => {
  if (node.type === 'folder') {
    const isExpanded = expandedFolders[node.path] ?? depth < 2;
    return (
      <div>
        <button
          type="button"
          onClick={() => toggleFolder(node.path)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className="w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-lg text-left text-xs font-mono text-slate-300 hover:bg-slate-800/70 hover:text-white transition"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="truncate font-semibold">{node.name}</span>
        </button>
        {isExpanded && (
          <div>
            {node.items.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
                onDeleteFile={onDeleteFile}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = activeFile === node.path;
  return (
    <div
      style={{ paddingLeft: `${depth * 12 + 22}px` }}
      onClick={() => onSelectFile(node.path)}
      className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer text-xs font-mono transition ${
        isActive
          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
          : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
        <span className="truncate">{node.name}</span>
      </div>
      {onDeleteFile && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFile(node.path);
          }}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-0.5 shrink-0"
          title="Delete file"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export const ProjectFolderTree = ({
  files = [],
  activeFile = '',
  onSelectFile,
  onDeleteFile,
  onDownloadZip,
  downloadingZip = false,
  loadingRepo = false,
  repoError = '',
  title = 'Project Folder',
}) => {
  const tree = useMemo(() => buildTree(files), [files]);
  const [expandedFolders, setExpandedFolders] = useState({});

  // Auto-expand folders containing the activeFile
  useEffect(() => {
    if (!activeFile) return;
    const parts = activeFile.split('/');
    if (parts.length <= 1) return;
    setExpandedFolders((prev) => {
      const next = { ...prev };
      for (let i = 1; i < parts.length; i++) {
        next[parts.slice(0, i).join('/')] = true;
      }
      return next;
    });
  }, [activeFile]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !(prev[folderPath] ?? true),
    }));
  };

  return (
    <div className="rounded-3xl bg-[#0F172A] border border-[#334155]/80 overflow-hidden shadow-harbor-sm">
      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between gap-2 bg-[#070A12]/60">
        <div className="flex items-center gap-2 min-w-0">
          <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-white truncate">{title}</span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {files.length}
          </span>
        </div>

        {onDownloadZip && (
          <button
            type="button"
            onClick={onDownloadZip}
            disabled={downloadingZip || files.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold transition disabled:opacity-50 shrink-0"
            title="Download full folder as .zip"
          >
            {downloadingZip ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download ZIP</span>
          </button>
        )}
      </div>

      <div className="p-2 max-h-[340px] overflow-y-auto space-y-0.5">
        {loadingRepo ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Loading repository files...</span>
          </div>
        ) : repoError ? (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[11px]">
            {repoError}
          </div>
        ) : tree.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs font-mono">
            No files in folder
          </div>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              depth={0}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              onDeleteFile={onDeleteFile}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))
        )}
      </div>
    </div>
  );
};
