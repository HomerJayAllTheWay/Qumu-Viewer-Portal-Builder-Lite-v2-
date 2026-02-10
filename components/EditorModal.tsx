
import React, { useState } from 'react';
import { X, Save, Type, FileText, PlaySquare, Code, Eye, ChevronLeft, MonitorPlay } from 'lucide-react';
import { PageElement, ElementType, SectionKey } from '../types';
import ReactQuill from 'react-quill';

interface EditorModalProps {
  section: SectionKey;
  element: PageElement | null;
  onSave: (element: PageElement) => void;
  onClose: () => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ section, element, onSave, onClose }) => {
  const [selectedType, setSelectedType] = useState<ElementType | null>(element?.type || null);
  
  const [formData, setFormData] = useState<PageElement>(element || {
    id: Math.random().toString(36).substr(2, 9),
    type: 'HTML',
    title: '',
    content: '',
    widgetType: 'PLAYER'
  });

  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onSave({ ...formData, type: selectedType });
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'link', 'blockquote', 'code-block'
  ];

  const renderTypeSelection = () => (
    <div className="p-12 flex flex-col items-center justify-center flex-1 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">Select Element Type</h3>
        <p className="text-slate-500">Choose the type of content you want to add to the {section === 'playerPage' ? 'Player Page' : section}.</p>
      </div>
      
      <div className={`grid grid-cols-1 ${section === 'playerPage' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 w-full max-w-2xl`}>
        <button
          onClick={() => setSelectedType('HTML')}
          className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 transition-all flex flex-col items-center space-y-4 text-center"
        >
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Type className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">HTML</h4>
            <p className="text-xs text-slate-500">Rich text and custom HTML</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedType('MARKDOWN')}
          className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 transition-all flex flex-col items-center space-y-4 text-center"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">Markdown</h4>
            <p className="text-xs text-slate-500">Simple text formatting</p>
          </div>
        </button>

        {section !== 'playerPage' && (
          <button
            onClick={() => setSelectedType('WIDGET')}
            className="group p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 transition-all flex flex-col items-center space-y-4 text-center"
          >
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MonitorPlay className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800">Qumu Video</h4>
              <p className="text-xs text-slate-500">Embed Studio video content</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 h-[85vh]">
        
        <div className="flex items-center justify-between px-8 py-6 border-b shrink-0">
          <div className="flex items-center space-x-3">
            {!element && selectedType && (
              <button 
                onClick={() => setSelectedType(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 mr-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {selectedType ? `${element ? 'Edit' : 'New'} ${selectedType === 'WIDGET' ? 'Qumu Video' : selectedType}` : 'Add New Element'}
              </h3>
              <p className="text-sm text-slate-500">Section: {section === 'playerPage' ? 'Player Page' : section}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {!selectedType ? renderTypeSelection() : (
          <>
            <form onSubmit={handleSubmit} className="p-8 flex-1 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Internal Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sales Training Playlist"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              {selectedType === 'WIDGET' ? (
                <div className="p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                    <MonitorPlay className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">Configure Qumu Video Data</h4>
                    <p className="text-slate-500 max-w-sm mx-auto">Click the save button below, then use the gear icon in the editor to define your presentation source.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      {selectedType === 'HTML' ? 'HTML Editor' : 'Markdown Content'}
                    </label>
                    {selectedType === 'HTML' && (
                      <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setEditMode('visual')} className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold ${editMode === 'visual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Visual</button>
                        <button type="button" onClick={() => setEditMode('code')} className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold ${editMode === 'code' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Code</button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    {selectedType === 'HTML' && editMode === 'visual' ? (
                      <div className="min-h-[350px]">
                        <ReactQuill theme="snow" value={formData.content} onChange={(c) => setFormData(p => ({ ...p, content: c }))} modules={quillModules} className="h-[300px]" />
                      </div>
                    ) : (
                      <textarea required rows={12} className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 font-mono text-sm" value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} />
                    )}
                  </div>
                </div>
              )}
            </form>

            <div className="px-8 py-6 bg-slate-50 border-t shrink-0 flex justify-end space-x-3">
              <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
              <button onClick={handleSubmit} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transition-all flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Element</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorModal;
