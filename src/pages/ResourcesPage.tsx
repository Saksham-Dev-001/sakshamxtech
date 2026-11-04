import React, { useState } from 'react';
import { 
  FolderDown, 
  Search, 
  Download, 
  FileText, 
  Check, 
  Filter, 
  FileCode, 
  Sparkles,
  ExternalLink,
  Plus,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { ResourceEditorModal } from './admin/ContentEditorModals';
import { ResourceItem } from '../types';
import { getTodayISODate } from '../utils/realTime';

interface ResourcesPageProps {
  navigate: (path: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = () => {
  const { resources, addResource, updateResource, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  // Inline Admin Modal State
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: ResourceItem | null;
  }>({
    isOpen: false,
    data: null,
  });

  const handleOpenNewModal = () => {
    setEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditModal = (res: ResourceItem) => {
    setEditorModal({
      isOpen: true,
      data: res,
    });
  };

  const handleSaveModal = (data: Partial<ResourceItem>) => {
    if (editorModal.data && editorModal.data.id) {
      updateResource(editorModal.data.id, data);
    } else {
      addResource({
        title: data.title || 'Resource Title',
        description: data.description || '',
        category: data.category || 'Cheat Sheet',
        format: data.format || 'PDF',
        fileSize: data.fileSize || '2.0 MB',
        downloadUrl: data.downloadUrl || '#',
        previewImageUrl: data.previewImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        tags: data.tags || ['Notes', 'PDF'],
        publishedDate: getTodayISODate(),
      });
    }
    setEditorModal({ isOpen: false, data: null });
  };

  const categories = ['All', 'Cheat Sheet', 'Roadmap', 'PDF Notes', 'Lab Guide'];

  const filtered = resources.filter((res) => {
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  const handleDownload = (id: string, title: string) => {
    trackEvent('download', title);
    const item = resources.find((r) => r.id === id);
    if (item) {
      updateResource(id, { downloadsCount: item.downloadsCount + 1 });
    }
    setDownloadedIds((prev) => [...prev, id]);

    // Create synthetic text download if URL is placeholder
    const blob = new Blob([`SakshamXTech Educational Resource: ${title}\nCategory: ${item?.category}\nPlatform: https://sakshamxtech.dev\n\nEnjoy learning and keep building!`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <SEOHead
        title="Programming PDFs, Cheat Sheets & Notes | SakshamXTech"
        description="Download free curated C programming cheat sheets, Google Cloud Arcade lab handbooks, and DSA interview roadmaps."
      />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-950 dark:border-teal-500/40 dark:text-teal-300 text-xs font-bold mb-3">
          <FolderDown className="w-3.5 h-3.5" />
          <span>Curated Learning Material</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          PDF Notes, Roadmaps & Cheat Sheets
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Download high-resolution reference handbooks, DSA topic roadmaps, and terminal cheat sheets prepared by SakshamXTech.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cheat sheets, notes, or topics..."
              maxLength={120}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((res) => {
          const isDownloaded = downloadedIds.includes(res.id);

          return (
            <div
              key={res.id}
              className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 bg-white dark:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm desktop-card-interactive"
            >
              <div>
                <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-teal-500/10 via-slate-100 to-indigo-500/10 dark:from-teal-950/40 dark:via-slate-900 dark:to-indigo-950/40 mb-4 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative">
                  {res.previewImageUrl ? (
                    <img
                      src={res.previewImageUrl}
                      alt={res.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none -z-0">
                    <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-1 opacity-70" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">{res.format} Handbook</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-bold text-teal-600 dark:text-teal-400">{res.category}</span>
                  <span>{res.fileSize}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-3">
                  <span>{res.downloadsCount.toLocaleString()} downloads</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">{res.format}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(res)}
                      className="py-2 px-3 text-xs font-bold rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/60 text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      title="Edit resource"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDownload(res.id, res.title)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                      isDownloaded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/40'
                        : 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL INLINE ADMIN RESOURCE STUDIO MODAL */}
      {editorModal.isOpen && (
        <ResourceEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};
