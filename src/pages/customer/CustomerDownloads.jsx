import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../../services/api';
import { Download, FileArchive, Clock, Loader2, ArrowRight } from 'lucide-react';

export const CustomerDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoading(true);
        const res = await customerAPI.getMyDownloads();
        if (res.downloads) setDownloads(res.downloads);
      } catch (err) {
        console.error('Failed to load downloads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const handleReDownload = async (d) => {
    try {
      setDownloadingId(d.id);
      await customerAPI.downloadFreeFile(d.file.id, d.file.originalName);
    } catch (err) {
      alert(err.message || 'Error downloading file');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 text-[#E2E8F0]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Download Center
        </h1>
        <p className="text-xs text-[#C0C7D1] mt-1">
          Access your authorized source packages, revision archives, and download history.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C084FC]" />
        </div>
      ) : downloads.length > 0 ? (
        <div className="bg-[#140F28] rounded-3xl border border-[#322659] overflow-hidden shadow-harbor-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0A1C] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#322659]">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Archive Filename</th>
                  <th className="px-6 py-4">Version</th>
                  <th className="px-6 py-4">Downloaded At</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#322659]/60 text-slate-300">
                {downloads.map((d) => (
                  <tr key={d.id} className="hover:bg-[#1C1636]/60 transition">
                    <td className="px-6 py-4 font-bold text-white">
                      <Link to={`/projects/${d.product.slug}`} className="hover:text-[#A855F7]">
                        {d.product.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FileArchive className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                      <span className="font-mono text-slate-300">{d.file.originalName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-[#0E0A1C] border border-[#322659] font-mono text-[10px] text-[#C084FC]">
                        v{d.file.version || '1.0.0'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(d.downloadedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleReDownload(d)}
                        disabled={downloadingId === d.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] text-white font-extrabold text-[11px] transition shadow-purple-glow hover:brightness-110"
                      >
                        {downloadingId === d.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>Re-download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#140F28] rounded-3xl p-12 text-center border border-[#322659] max-w-md mx-auto">
          <Download className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Downloads Recorded</h3>
          <p className="text-xs text-slate-400 mb-6">
            You haven't initiated any file downloads yet. Explore our free templates to download starter code.
          </p>
          <Link
            to="/projects?isFree=true"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#C084FC] text-white text-xs font-bold uppercase tracking-wider"
          >
            Find Free Templates
          </Link>
        </div>
      )}
    </div>
  );
};
