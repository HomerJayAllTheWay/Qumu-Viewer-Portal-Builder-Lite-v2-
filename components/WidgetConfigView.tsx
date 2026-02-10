
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Settings2, 
  Code2, 
  Sparkles, 
  Heart, 
  PlayCircle, 
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  GalleryHorizontal,
  Image as ImageIcon,
  Save,
  Wrench,
  AlertCircle,
  X,
  Database,
  Search,
  Hash,
  MonitorPlay
} from 'lucide-react';
import { QumuVideoConfig, QumuVideoSourceType } from '../types';

interface WidgetConfigViewProps {
  type: 'SMART_SEARCH' | 'FAVORITES' | 'PLAYER';
  initialConfig: QumuVideoConfig;
  onBack: () => void;
  onSave: (config: QumuVideoConfig) => void;
  onLaunchAdvanced: () => void;
}

const SMART_SEARCH_QUERIES = [
  { label: 'Most Recent Videos', value: 'recent:all' },
  { label: 'Trending Presentations', value: 'trending:all' },
  { label: 'Engineering Category', value: 'category:Engineering' },
  { label: 'Sales & Marketing', value: 'category:Sales' },
  { label: 'Employee Onboarding', value: 'tags:onboarding' },
  { label: 'Executive Townhalls', value: 'tags:townhall' },
];

const WidgetConfigView: React.FC<WidgetConfigViewProps> = ({ type, initialConfig, onBack, onSave, onLaunchAdvanced }) => {
  const [showCode, setShowCode] = useState(false);
  const [localConfig, setLocalConfig] = useState<QumuVideoConfig>(initialConfig || { 
    sourceType: 'SEARCH', 
    searchQuery: 'recent:all',
    displayType: 'GRID',
    size: 10 
  });
  
  const [jsonInput, setJsonInput] = useState(JSON.stringify(localConfig, null, 2));
  const [isValidJson, setIsValidJson] = useState(true);

  useEffect(() => {
    setJsonInput(JSON.stringify(localConfig, null, 2));
  }, [localConfig]);

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      setLocalConfig(parsed);
      setIsValidJson(true);
    } catch (e) {
      setIsValidJson(false);
    }
  };

  const updateField = (field: keyof QumuVideoConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const layouts = [
    { id: 'PLAYER', label: 'Single Player', icon: PlayCircle, desc: 'Featured single playback' },
    { id: 'GRID', label: 'Grid', icon: LayoutGrid, desc: 'Responsive gallery' },
    { id: 'CAROUSEL', label: 'Carousel', icon: GalleryHorizontal, desc: 'Horizontal slider' },
    { id: 'VERTICAL', label: 'Vertical List', icon: List, desc: 'Detailed side-by-side' },
  ];

  const sourceModes: { id: QumuVideoSourceType; label: string; icon: any }[] = [
    { id: 'SINGLE', label: 'Single Presentation', icon: MonitorPlay },
    { id: 'SEARCH', label: 'Smart Search', icon: Search },
    { id: 'LIST', label: 'List of GUIDs', icon: Hash },
  ];

  return (
    <div className="min-h-full bg-slate-50 animate-in fade-in duration-500 flex flex-col">
      <nav className="px-8 py-4 border-b bg-white flex items-center justify-between sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors group">
          <div className="p-1.5 rounded-lg group-hover:bg-indigo-50"><ChevronLeft className="w-5 h-5" /></div>
          <span className="font-bold text-sm">Return to Builder</span>
        </button>
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
          <button onClick={() => onSave(localConfig)} className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg"><MonitorPlay className="w-8 h-8" /></div>
              <div className="space-y-1 pt-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Qumu Video Configuration</h1>
                <p className="text-slate-500">Define the source data and presentation layout for this video element.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Source Selection Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center"><Database className="w-4 h-4 mr-2" />Content Source</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {sourceModes.map(mode => (
                  <button key={mode.id} onClick={() => updateField('sourceType', mode.id)} className={`flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${localConfig.sourceType === mode.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                    <mode.icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in duration-300">
                {localConfig.sourceType === 'SINGLE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400">Presentation GUID</label>
                      <input type="text" className="w-full px-4 py-3 border rounded-xl bg-white font-mono text-sm" placeholder="e.g. 12345-abcde-67890" value={localConfig.singleGuid || ''} onChange={(e) => updateField('singleGuid', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400">Presentation Alias</label>
                      <input type="text" className="w-full px-4 py-3 border rounded-xl bg-white font-mono text-sm" placeholder="e.g. welcome-video" value={localConfig.singleAlias || ''} onChange={(e) => updateField('singleAlias', e.target.value)} />
                    </div>
                  </div>
                )}

                {localConfig.sourceType === 'SEARCH' && (
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-slate-400">Smart Search Query</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 border rounded-xl bg-white appearance-none font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500" value={localConfig.searchQuery || ''} onChange={(e) => updateField('searchQuery', e.target.value)}>
                        {SMART_SEARCH_QUERIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-slate-500 italic">Select a predefined query or edit the JSON below for complex search criteria.</p>
                  </div>
                )}

                {localConfig.sourceType === 'LIST' && (
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-slate-400">List of Presentation GUIDs</label>
                    <textarea rows={5} className="w-full px-4 py-4 border rounded-xl bg-white font-mono text-sm resize-none" placeholder="11111-aaaaa-22222&#10;33333-bbbbb-44444&#10;55555-ccccc-66666" value={localConfig.guidList || ''} onChange={(e) => updateField('guidList', e.target.value)} />
                    <p className="text-xs text-slate-500">Add one Presentation GUID per line.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Layout Selector Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center"><LayoutGrid className="w-4 h-4 mr-2" />Display Format</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {layouts.map((l) => (
                  <button key={l.id} onClick={() => updateField('displayType', l.id as any)} className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center group ${localConfig.displayType === l.id ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                    <div className={`p-4 rounded-xl mb-4 transition-colors ${localConfig.displayType === l.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 group-hover:text-slate-600'}`}><l.icon className="w-6 h-6" /></div>
                    <span className={`block font-bold text-sm ${localConfig.displayType === l.id ? 'text-indigo-900' : 'text-slate-800'}`}>{l.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight block mt-1">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-200">
            <button onClick={() => setShowCode(!showCode)} className="flex items-center space-x-2 text-slate-400 hover:text-slate-600 transition-colors px-2 group">
              <Code2 className="w-4 h-4 group-hover:scale-110" />
              <span className="text-xs font-black uppercase tracking-widest">{showCode ? 'Hide' : 'Show'} Advanced JSON Configuration</span>
              {showCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showCode && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <div className={`bg-[#0f172a] rounded-[2rem] border-2 p-8 shadow-2xl relative transition-colors ${!isValidJson ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-slate-800'}`}>
                  {!isValidJson && <div className="absolute top-6 right-8 text-red-400 text-[10px] font-bold uppercase animate-pulse">Invalid JSON</div>}
                  <textarea value={jsonInput} onChange={(e) => handleJsonChange(e.target.value)} spellCheck={false} className="w-full h-48 bg-transparent border-none focus:ring-0 font-mono text-sm text-indigo-200 resize-none leading-relaxed" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfigView;
