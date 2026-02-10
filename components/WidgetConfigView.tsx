
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
  X
} from 'lucide-react';

interface WidgetConfigViewProps {
  type: 'SMART_SEARCH' | 'FAVORITES' | 'PLAYER';
  initialConfig: any;
  onBack: () => void;
  onSave: (config: any) => void;
  onLaunchAdvanced: () => void;
}

const WidgetConfigView: React.FC<WidgetConfigViewProps> = ({ type, initialConfig, onBack, onSave, onLaunchAdvanced }) => {
  const [showCode, setShowCode] = useState(false);
  const [localConfig, setLocalConfig] = useState(initialConfig || { size: 10, type: 'vertical' });
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialConfig || { size: 10, type: 'vertical' }, null, 2));
  const [isValidJson, setIsValidJson] = useState(true);

  // Sync JSON input when local config changes from UI
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

  const updateField = (field: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const getDetails = () => {
    switch (type) {
      case 'SMART_SEARCH':
        return {
          title: 'Smart Search Configuration',
          description: 'Define how users discover content through intelligent search results.',
          icon: Sparkles,
          color: 'indigo'
        };
      case 'FAVORITES':
        return {
          title: 'Favorites Page Layout',
          description: 'Configure the display of personalized video collections.',
          icon: Heart,
          color: 'rose'
        };
      case 'PLAYER':
        return {
          title: 'Video Player Experience',
          description: 'Customize the playback interface and interaction defaults.',
          icon: PlayCircle,
          color: 'blue'
        };
      default:
        return {
          title: 'Widget Settings',
          description: 'Adjust the component properties.',
          icon: Settings2,
          color: 'slate'
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  const layouts = [
    { id: 'vertical', label: 'Vertical List', icon: List, desc: 'Single column feed' },
    { id: 'grid', label: 'Grid', icon: LayoutGrid, desc: 'Responsive multi-column' },
    { id: 'carousel', label: 'Carousel', icon: GalleryHorizontal, desc: 'Horizontal slider' },
    { id: 'thumbnail', label: 'Thumbnails Only', icon: ImageIcon, desc: 'Compact gallery view' },
  ];

  return (
    <div className="min-h-full bg-slate-50 animate-in fade-in duration-500 flex flex-col">
      {/* Top Navigation */}
      <nav className="px-8 py-4 border-b bg-white flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">Return to Builder</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(localConfig)}
            className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-6">
              <div className={`w-16 h-16 rounded-2xl bg-${details.color}-600 flex items-center justify-center text-white shadow-lg`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="space-y-1 pt-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{details.title}</h1>
                <p className="text-slate-500">{details.description}</p>
              </div>
            </div>
            
            <button 
              onClick={onLaunchAdvanced}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm flex items-center space-x-2 text-sm"
            >
              <Wrench className="w-4 h-4" />
              <span>Advanced Configuration</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Layout Selector */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Presentation Layout
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {layouts.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => updateField('type', l.id)}
                    className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center group ${
                      localConfig.type === l.id 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-4 rounded-xl mb-4 transition-colors ${
                      localConfig.type === l.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 group-hover:text-slate-600'
                    }`}>
                      <l.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`block font-bold text-sm ${localConfig.type === l.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {l.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight block mt-1">
                        {l.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Preferences */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                <Settings2 className="w-4 h-4 mr-2" />
                Display Preferences
              </h3>
              <div className="max-w-xl">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Max Presentations to Show</label>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-mono font-bold text-sm">
                        {localConfig.size || 0}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={localConfig.size || 10} 
                      onChange={(e) => updateField('size', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>1 PRESENTATION</span>
                      <span>100 PRESENTATIONS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Info Box */}
          <div className="p-6 bg-slate-100/50 rounded-3xl border border-slate-200 flex items-start space-x-4">
            <div className="p-2 bg-white rounded-lg text-slate-400">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">Visual Sync</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Settings adjusted above are automatically reflected in the Widget Code. 
                Manual changes to the code below will update the visual controls when valid.
              </p>
            </div>
          </div>

          {/* Custom Code Section */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <button 
              onClick={() => setShowCode(!showCode)}
              className="flex items-center space-x-2 text-slate-400 hover:text-slate-600 transition-colors px-2 group"
            >
              <Code2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">
                {showCode ? 'Hide' : 'Show'} Custom Configuration Code
              </span>
              {showCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCode && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <div className={`bg-[#0f172a] rounded-[2rem] border-2 p-8 shadow-2xl relative transition-colors ${!isValidJson ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-slate-800'}`}>
                  <div className="absolute top-6 right-8 flex items-center space-x-3">
                    {!isValidJson && (
                      <div className="flex items-center space-x-2 text-red-400 text-[10px] font-bold uppercase animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        <span>Invalid JSON Payload</span>
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">portal_widget_config.json</span>
                  </div>
                  
                  <textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    spellCheck={false}
                    className="w-full h-48 bg-transparent border-none focus:ring-0 font-mono text-sm text-indigo-200 resize-none leading-relaxed"
                  />

                  <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-medium">
                      Developers can manually edit or paste configuration JSON here.
                    </p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(jsonInput);
                      }}
                      className="text-[10px] font-black text-indigo-400 hover:text-indigo-200 transition-colors uppercase tracking-widest px-4 py-2 bg-indigo-500/10 rounded-lg"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
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
