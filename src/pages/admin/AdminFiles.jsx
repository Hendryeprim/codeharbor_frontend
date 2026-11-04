import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FolderArchive, Upload, Image, FileCode, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Zap } from 'lucide-react';

export const AdminFiles = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [selectedZipFile, setSelectedZipFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [uploadingZip, setUploadingZip] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [zipSuccess, setZipSuccess] = useState('');
  const [imgSuccess, setImgSuccess] = useState('');
  const [zipError, setZipError] = useState('');
  const [imgError, setImgError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await adminAPI.getProducts();
      if (res.products) {
        setProducts(res.products);
        if (res.products.length > 0) setSelectedProductId(res.products[0].id);
      }
    };
    fetchProducts();
  }, []);

  const handleZipUpload = async (e) => {
    e.preventDefault();
    if (!selectedZipFile || !selectedProductId) return;

    setUploadingZip(true);
    setZipSuccess('');
    setZipError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedZipFile);
      formData.append('productId', selectedProductId);
      formData.append('version', version);

      const res = await adminAPI.uploadProjectFile(formData);
      if (res.success) {
        setZipSuccess(`Uploaded "${res.file.originalName}" to secure private storage!`);
        setSelectedZipFile(null);
      }
    } catch (err) {
      setZipError(err.message || 'Failed to upload archive');
    } finally {
      setUploadingZip(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImageFile) return;

    setUploadingImg(true);
    setImgSuccess('');
    setImgError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImageFile);

      const res = await adminAPI.uploadImage(formData);
      if (res.success) {
        setImgSuccess(`Image uploaded successfully: ${res.url}`);
        setSelectedImageFile(null);
      }
    } catch (err) {
      setImgError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
          Secure Vault & Asset Distribution
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          File & Asset Management
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Upload protected project source code archives to private storage vaults and public showcase screenshots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Private ZIP File */}
        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl p-6 sm:p-8 border border-[#322659]/60 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#E2E8F0]">Private Project Archive Vault</h3>
              <p className="text-xs text-[#C0C7D1]/60">Strictly stored outside public web directory with encrypted tokens</p>
            </div>
          </div>

          {zipSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{zipSuccess}</span>
            </div>
          )}

          {zipError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{zipError}</span>
            </div>
          )}

          <form onSubmit={handleZipUpload} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#C0C7D1] mb-1">Target Project</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] focus:outline-none focus:border-[#A855F7]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#C0C7D1] mb-1">Package Version</label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#E2E8F0] font-mono focus:outline-none focus:border-[#A855F7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#C0C7D1] mb-1">Archive File (.zip, .tar.gz)</label>
              <input
                type="file"
                required
                accept=".zip,.tar,.gz,.7z"
                onChange={(e) => setSelectedZipFile(e.target.files[0])}
                className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#C0C7D1] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#A855F7] file:to-[#0A84FF] file:text-white cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={uploadingZip || !selectedZipFile}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-bold transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadingZip ? 'Encrypting & Vaulting...' : 'Upload Project Archive'}</span>
            </button>
          </form>
        </div>

        {/* Upload Public Image / Screenshot */}
        <div className="bg-gradient-to-br from-[#140F28] to-[#0E0A1C] rounded-2xl p-6 sm:p-8 border border-[#322659]/60 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30 flex items-center justify-center font-bold">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#E2E8F0]">Public Preview Screenshot</h3>
              <p className="text-xs text-[#C0C7D1]/60">Stored in public uploads for fast CDN product showcases</p>
            </div>
          </div>

          {imgSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2 break-all">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{imgSuccess}</span>
            </div>
          )}

          {imgError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{imgError}</span>
            </div>
          )}

          <form onSubmit={handleImageUpload} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#C0C7D1] mb-1">Image File (JPG, PNG, WEBP)</label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setSelectedImageFile(e.target.files[0])}
                className="w-full px-3 py-2 rounded-xl border border-[#322659]/80 bg-[#0E0A1C] text-[#C0C7D1] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1C1636] file:text-[#A855F7] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={uploadingImg || !selectedImageFile}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#0A84FF] hover:shadow-purple-glow text-white font-bold transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadingImg ? 'Uploading Screenshot...' : 'Upload Image'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
