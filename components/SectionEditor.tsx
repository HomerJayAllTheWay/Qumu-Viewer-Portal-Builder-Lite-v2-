
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Type,
  FileText,
  PlaySquare,
  Edit2,
  Box,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Settings2,
  Image as ImageIcon,
  Type as FontIcon,
  Maximize,
  Minus,
  Pointer,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock,
  MessageSquare,
  Heart,
  Star,
  Activity,
  UploadCloud,
  ExternalLink,
  Home,
  Link as LinkIcon,
  Sparkles,
  Search as SearchIcon,
  Wrench,
  Volume2,
  VolumeX,
  Repeat,
  PlayCircle,
  Subtitles,
  Code2,
  AlertCircle,
  Info,
  Layout
} from 'lucide-react';
import { PortalConfig, SectionKey, PageElement, MenuItem, ElementType, HeaderSettings, FooterSettings, MenuSettings, PageSettings, TypographySettings, PortalFunctionalSettings, BreakpointKey, MenuItemType } from '../types';

interface SectionEditorProps {
  section: SectionKey;
  config: PortalConfig;
  onUpdateSection: (section: SectionKey, items: any[]) => void;
  onUpdateHeaderSettings?: (settings: HeaderSettings) => void;
  onUpdateFooterSettings?: (settings: FooterSettings) => void;
  onUpdateMenuSettings?: (settings: MenuSettings) => void;
  onUpdatePortalSettings?: (settings: PortalFunctionalSettings) => void;
  onUpdatePageSettings?: (settings: PageSettings) => void;
  onAddElement: (type: ElementType | null) => void;
  onEditElement: (el: PageElement) => void;
  onConfigureWidget?: (type: 'SMART_SEARCH' | 'FAVORITES' | 'PLAYER', data: any, sourceItem: any) => void;
}

const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Georgia', 'system-ui', 'monospace'];
const WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi-Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra-Bold', value: '800' },
  { label: 'Black', value: '900' },
];

const BREAKPOINTS: { key: BreakpointKey; label: string; tip: string }[] = [
  { key: 'sm', label: 'Small', tip: '640px - Best for compact portfolios.' },
  { key: 'md', label: 'Medium', tip: '768px - Standard tablet-friendly width.' },
  { key: 'lg', label: 'Large', tip: '1024px - Traditional desktop layout.' },
  { key: 'xl', label: 'X-Large', tip: '1280px - Modern widescreen standard.' },
  { key: '2xl', label: '2K', tip: '1536px - Ultra-widescreen layout.' },
  { key: 'full', label: 'Full', tip: '100% - Stretches to fill the viewport.' },
];

const SectionEditor: React.FC<SectionEditorProps> = ({ 
  section, 
  config, 
  onUpdateSection, 
  onUpdateHeaderSettings,
  onUpdateFooterSettings,
  onUpdateMenuSettings,
  onUpdatePortalSettings,
  onUpdatePageSettings,
  onAddElement,
  onEditElement,
  onConfigureWidget
}) => {
  const [openStyleGroup, setOpenStyleGroup] = useState<string | null>('layout');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPlayerCode, setShowPlayerCode] = useState(false);
  const [playerJsonInput, setPlayerJsonInput] = useState('');
  const [isPlayerJsonValid, setIsPlayerJsonValid] = useState(true);
  
  const items = !['settings', 'portal'].includes(section) ? config[section as Exclude<SectionKey, 'settings' | 'portal'>] : [];

  // Initialize JSON input for player defaults
  useEffect(() => {
    const playerDefaults = {
      autoPlay: config.portalSettings.playerAutoPlay,
      loop: config.portalSettings.playerLoop,
      muted: config.portalSettings.playerMuted,
      showCaptions: config.portalSettings.playerShowCaptions,
    };
    setPlayerJsonInput(JSON.stringify(playerDefaults, null, 2));
  }, [config.portalSettings]);

  const handlePlayerJsonChange = (val: string) => {
    setPlayerJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      setIsPlayerJsonValid(true);
      // Map back to settings
      if (onUpdatePortalSettings) {
        onUpdatePortalSettings({
          ...config.portalSettings,
          playerAutoPlay: !!parsed.autoPlay,
          playerLoop: !!parsed.loop,
          playerMuted: !!parsed.muted,
          playerShowCaptions: !!parsed.showCaptions,
        });
      }
    } catch (e) {
      setIsPlayerJsonValid(false);
    }
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items as any[]];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onUpdateSection(section, newItems);
  };

  const handleDelete = (id: string) => {
    onUpdateSection(section, (items as any[]).filter((item: any) => item.id !== id));
  };

  const updateHeaderSetting = (field: keyof HeaderSettings, value: any) => {
    if (onUpdateHeaderSettings) {
      onUpdateHeaderSettings({ ...config.headerSettings, [field]: value });
    }
  };

  const updateFooterSetting = (field: keyof FooterSettings, value: any) => {
    if (onUpdateFooterSettings) {
      onUpdateFooterSettings({ ...config.footerSettings, [field]: value });
    }
  };

  const updateMenuSetting = (field: keyof MenuSettings, value: any) => {
    if (onUpdateMenuSettings) {
      onUpdateMenuSettings({ ...config.menuSettings, [field]: value });
    }
  };

  const updatePortalSetting = (field: keyof PortalFunctionalSettings, value: any) => {
    if (onUpdatePortalSettings) {
      onUpdatePortalSettings({ ...config.portalSettings, [field]: value });
    }
  };

  const updatePageSetting = (path: string, value: any) => {
    if (!onUpdatePageSettings) return;
    const newSettings = { ...config.pageSettings };
    const parts = path.split('.');
    let current: any = newSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onUpdatePageSettings(newSettings);
  };

  const addMenuItem = (type: MenuItemType) => {
    let newItem: MenuItem;
    const id = Math.random().toString(36).substr(2, 9);
    
    switch (type) {
      case 'HOME':
        newItem = { id, label: 'Home', url: '/', type: 'HOME', visible: true };
        break;
      case 'SMART_SEARCH':
        newItem = { id, label: 'Search Results', url: '/search', type: 'SMART_SEARCH', visible: true, searchQuery: 'recent:all' };
        break;
      case 'FAVORITES':
        newItem = { id, label: 'My Favorites', url: '/favorites', type: 'FAVORITES', visible: true };
        break;
      default:
        newItem = { id, label: 'New Custom Link', url: 'https://', type: 'CUSTOM', visible: true };
    }
    
    onUpdateSection('menu', [...(items as MenuItem[]), newItem]);
    setShowAddMenu(false);
  };

  const renderPlayerSettingsBlock = () => {
    const p = config.portalSettings;
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Player Interaction Settings</h3>
              <p className="text-xs text-slate-500">Global behavior for the video playback interface.</p>
            </div>
          </div>
          <button 
            onClick={() => window.open('https://qumu.com/widget-creator', '_blank')}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm flex items-center space-x-1.5 text-[10px] uppercase tracking-wider"
          >
            <Wrench className="w-3 h-3" />
            <span>Advanced Configuration</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('playerAutoPlay', !p.playerAutoPlay)}>
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <PlaySquare className={`w-5 h-5 ${p.playerAutoPlay ? 'text-indigo-600' : 'text-slate-300'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-bold text-slate-800">Auto-play Videos</span>
                <input type="checkbox" checked={p.playerAutoPlay} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Start playing video automatically when a page loads.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('playerLoop', !p.playerLoop)}>
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Repeat className={`w-5 h-5 ${p.playerLoop ? 'text-indigo-600' : 'text-slate-300'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-bold text-slate-800">Loop Playback</span>
                <input type="checkbox" checked={p.playerLoop} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Restart video content immediately after it reaches the end.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('playerMuted', !p.playerMuted)}>
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              {p.playerMuted ? <VolumeX className="w-5 h-5 text-indigo-600" /> : <Volume2 className="w-5 h-5 text-slate-300" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-bold text-slate-800">Mute by Default</span>
                <input type="checkbox" checked={p.playerMuted} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Start all videos with the audio muted. Recommended for auto-play.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('playerShowCaptions', !p.playerShowCaptions)}>
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Subtitles className={`w-5 h-5 ${p.playerShowCaptions ? 'text-indigo-600' : 'text-slate-300'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-bold text-slate-800">Enable Captions</span>
                <input type="checkbox" checked={p.playerShowCaptions} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Automatically show closed captions if available for the video content.</span>
            </div>
          </div>
        </div>

        {/* Custom Code Section for Player Defaults */}
        <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setShowPlayerCode(!showPlayerCode)}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-600 transition-colors px-2 group"
          >
            <Code2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {showPlayerCode ? 'Hide' : 'Show'} Custom Configuration Code
            </span>
            {showPlayerCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPlayerCode && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className={`bg-[#0f172a] rounded-[2rem] border-2 p-8 shadow-2xl relative transition-colors ${!isPlayerJsonValid ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-slate-800'}`}>
                <div className="absolute top-6 right-8 flex items-center space-x-3">
                  {!isPlayerJsonValid && (
                    <div className="flex items-center space-x-2 text-red-400 text-[10px] font-bold uppercase animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      <span>Invalid JSON</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">portal_player_defaults.json</span>
                </div>
                
                <textarea
                  value={playerJsonInput}
                  onChange={(e) => handlePlayerJsonChange(e.target.value)}
                  spellCheck={false}
                  className="w-full h-40 bg-transparent border-none focus:ring-0 font-mono text-sm text-indigo-200 resize-none leading-relaxed"
                />

                <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-medium">
                    Directly edit player property values in the schema above.
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(playerJsonInput);
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
    );
  };

  if (section === 'portal') {
    const p = config.portalSettings;
    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-500">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Portal Title</label>
              <input 
                type="text" 
                value={p.title} 
                onChange={(e) => updatePortalSetting('title', e.target.value)}
                className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. Sales Onboarding Portal"
              />
              <p className="text-xs text-slate-400">The display name of your portal in browser tabs and search results.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Alias (Friendly URL)</label>
              <div className="flex items-center">
                <span className="bg-slate-100 px-3 py-2 border border-r-0 rounded-l-xl text-slate-400 text-sm font-mono">/portal/</span>
                <input 
                  type="text" 
                  value={p.alias} 
                  onChange={(e) => updatePortalSetting('alias', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-r-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                  placeholder="marketing-videos"
                />
              </div>
              <p className="text-xs text-slate-400">A clean, memorable URL path for your portal.</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center">
                <Lock className="w-3 h-3 mr-2" />
                Access & Security
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('isPublic', !p.isPublic)}>
                <div className={`mt-1 w-10 h-6 rounded-full relative transition-colors ${p.isPublic ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${p.isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">Public Access</span>
                  <span className="text-xs text-slate-500">Anyone with the link can view. Making the portal public allows access without logging in.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('restrictInternal', !p.restrictInternal)}>
                <div className={`mt-1 w-10 h-6 rounded-full relative transition-colors ${p.restrictInternal ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${p.restrictInternal ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-bold text-slate-800">Restrict to Internal Users</span>
                  <span className="text-xs text-slate-500">Only users with an IP address approved by the Qumu Admin will be able to view presentations.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center">
              <Activity className="w-3 h-3 mr-2" />
              Portal Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('allowCreation', !p.allowCreation)}>
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <UploadCloud className={`w-5 h-5 ${p.allowCreation ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-800">Allow Content Creation</span>
                    <input type="checkbox" checked={p.allowCreation} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Creators will be able to upload new videos and add them directly to this portal.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('enableComments', !p.enableComments)}>
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <MessageSquare className={`w-5 h-5 ${p.enableComments ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-800">Enable Comments</span>
                    <input type="checkbox" checked={p.enableComments} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Enable registered users to add comments. Guest viewers will be able to read comments.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('enableLikes', !p.enableLikes)}>
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <Heart className={`w-5 h-5 ${p.enableLikes ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-800">Enable Likes</span>
                    <input type="checkbox" checked={p.enableLikes} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Allow registered users to Like videos.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => updatePortalSetting('enableFavorites', !p.enableFavorites)}>
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <Star className={`w-5 h-5 ${p.enableFavorites ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-800">Enable Favorites</span>
                    <input type="checkbox" checked={p.enableFavorites} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Allow registered users to mark their favorite videos to find them easily later.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors col-span-1 md:col-span-2" onClick={() => updatePortalSetting('showViewCounts', !p.showViewCounts)}>
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <Eye className={`w-5 h-5 ${p.showViewCounts ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-800">Show View Counts</span>
                    <input type="checkbox" checked={p.showViewCounts} readOnly className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Show the number of views within the portal to all viewers.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSectionSettings = (type: 'header' | 'footer' | 'menu') => {
    let s: HeaderSettings | FooterSettings | MenuSettings;
    let updateFn: (field: any, value: any) => void;
    
    if (type === 'header') {
      s = config.headerSettings;
      updateFn = updateHeaderSetting;
    } else if (type === 'footer') {
      s = config.footerSettings;
      updateFn = updateFooterSetting;
    } else {
      s = config.menuSettings;
      updateFn = updateMenuSetting;
    }

    const isHeader = type === 'header';
    const isMenu = type === 'menu';

    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Global {type.charAt(0).toUpperCase() + type.slice(1)} Settings</h3>
              <p className="text-xs text-slate-500">Configure visual and functional properties of the {type}.</p>
            </div>
          </div>
          <button 
            onClick={() => updateFn('visible', !s.visible)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              s.visible ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{s.visible ? `${type.charAt(0).toUpperCase() + type.slice(1)} Visible` : `${type.charAt(0).toUpperCase() + type.slice(1)} Hidden`}</span>
          </button>
        </div>

        <div className={`grid grid-cols-1 ${isHeader ? 'md:grid-cols-2' : ''} gap-8 transition-opacity duration-300 ${s.visible ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="space-y-6">
            <div className={`grid ${isMenu ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Background</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={s.backgroundColor} onChange={(e) => updateFn('backgroundColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-100" />
                  <input type="text" value={s.backgroundColor} onChange={(e) => updateFn('backgroundColor', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-mono w-16" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={s.textColor} onChange={(e) => updateFn('textColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-100" />
                  <input type="text" value={s.textColor} onChange={(e) => updateFn('textColor', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-mono w-16" />
                </div>
              </div>
              {isMenu && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Hover Text</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={(s as MenuSettings).hoverColor} onChange={(e) => updateFn('hoverColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-100" />
                    <input type="text" value={(s as MenuSettings).hoverColor} onChange={(e) => updateFn('hoverColor', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-mono w-16" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Vertical Padding</label>
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                {(['compact', 'normal', 'spacious'] as const).map(p => (
                  <button key={p} onClick={() => updateFn('padding', p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${s.padding === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Text Alignment</label>
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                {(['left', 'center', 'right'] as const).map(align => (
                  <button key={align} onClick={() => updateFn('justification', align)} className={`p-2 rounded-lg transition-all ${s.justification === align ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {align === 'left' && <AlignLeft className="w-4 h-4" />}
                    {align === 'center' && <AlignCenter className="w-4 h-4" />}
                    {align === 'right' && <AlignRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isHeader && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Elements & Features</label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Show Logo</span>
                      <span className="text-[10px] text-slate-400">Display organization branding</span>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-indigo-600" checked={(s as HeaderSettings).showLogo} onChange={(e) => updateFn('showLogo', e.target.checked)} />
                  </label>
                  {(s as HeaderSettings).showLogo && (
                    <div className="ml-4 pl-4 border-l-2 border-indigo-50 space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Logo Image URL</label>
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="https://example.com/logo.png" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono" value={(s as HeaderSettings).logoUrl} onChange={(e) => updateFn('logoUrl', e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-50">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Header Search Bar</span>
                      <span className="text-[10px] text-slate-400">Enable user discovery</span>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-indigo-600" checked={(s as HeaderSettings).showSearch} onChange={(e) => updateFn('showSearch', e.target.checked)} />
                  </label>
                  {(s as HeaderSettings).showSearch && (
                    <div className="ml-4 pl-4 border-l-2 border-indigo-50 space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-indigo-600" checked={(s as HeaderSettings).limitSearchToPortal} onChange={(e) => updateFn('limitSearchToPortal', e.target.checked)} />
                        <span className="text-xs font-medium text-slate-600">Limit to Portal content only</span>
                      </label>
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-between cursor-pointer group pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Fixed Header (Sticky)</span>
                    <span className="text-[10px] text-slate-400">Keep visible while scrolling</span>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-indigo-600" checked={(s as HeaderSettings).isSticky} onChange={(e) => updateFn('isSticky', e.target.checked)} />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (section === 'settings') {
    const s = config.pageSettings;

    const renderTypographyEditor = (key: keyof PageSettings, label: string) => {
      const typo = s[key] as TypographySettings;
      return (
        <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{label}</span>
            <div className="w-8 h-8 rounded bg-white border border-slate-200" style={{ backgroundColor: typo.color }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Font Family</label>
                <select className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg" value={typo.fontFamily} onChange={(e) => updatePageSetting(`${key}.fontFamily`, e.target.value)}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Weight</label>
                <select className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg" value={typo.fontWeight} onChange={(e) => updatePageSetting(`${key}.fontWeight`, e.target.value)}>
                  {WEIGHTS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Size (px/rem)</label>
                <input type="text" className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg" value={typo.fontSize} onChange={(e) => updatePageSetting(`${key}.fontSize`, e.target.value)} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Color</label>
                <input type="color" className="w-full h-8 p-1 bg-white border border-slate-200 rounded-lg" value={typo.color} onChange={(e) => updatePageSetting(`${key}.color`, e.target.value)} />
             </div>
          </div>
        </div>
      );
    };

    const StyleGroup = ({ id, label, icon: Icon, children }: any) => {
      const isOpen = openStyleGroup === id;
      return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <button onClick={() => setOpenStyleGroup(isOpen ? null : id)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-slate-800">{label}</span>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          {isOpen && <div className="p-6 border-t border-slate-100 bg-white space-y-6 animate-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
      );
    };

    return (
      <div className="space-y-4 pb-20">
        <StyleGroup id="layout" label="Global Layout" icon={Maximize}>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Content Max Width</label>
                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-wider">
                  {BREAKPOINTS.find(b => b.key === s.contentMaxWidth)?.label}
                </span>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl overflow-hidden">
                {BREAKPOINTS.map(b => (
                  <button 
                    key={b.key} 
                    onClick={() => updatePageSetting('contentMaxWidth', b.key)}
                    className={`flex-1 py-2 text-xs font-bold transition-all rounded-xl ${
                      s.contentMaxWidth === b.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 italic">
                {BREAKPOINTS.find(b => b.key === s.contentMaxWidth)?.tip}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Page Background</label>
                <div className="flex items-center space-x-3">
                  <input type="color" value={s.backgroundColor} onChange={(e) => updatePageSetting('backgroundColor', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-100" />
                  <input type="text" value={s.backgroundColor} onChange={(e) => updatePageSetting('backgroundColor', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono w-full" />
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Viewport Backdrop</p>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Content Background</label>
                <div className="flex items-center space-x-3">
                  <input type="color" value={s.contentBackgroundColor} onChange={(e) => updatePageSetting('contentBackgroundColor', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-100" />
                  <input type="text" value={s.contentBackgroundColor} onChange={(e) => updatePageSetting('contentBackgroundColor', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono w-full" />
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Main Container Box</p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-8">
              <label className="text-sm font-bold text-slate-700">Element Vertical Gap</label>
              <div className="flex items-center space-x-4">
                <input type="range" min="0" max="120" step="4" className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={s.elementGap} onChange={(e) => updatePageSetting('elementGap', parseInt(e.target.value))} />
                <span className="w-12 text-right font-mono font-bold text-indigo-600">{s.elementGap}px</span>
              </div>
              <p className="text-xs text-slate-400">Controls the spacing between elements in the main content area.</p>
            </div>
          </div>
        </StyleGroup>

        <StyleGroup id="typography" label="Typography" icon={FontIcon}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderTypographyEditor('h1', 'Heading 1')}
            {renderTypographyEditor('h2', 'Heading 2')}
            {renderTypographyEditor('h3', 'Heading 3')}
            {renderTypographyEditor('h4', 'Heading 4')}
            {renderTypographyEditor('h5', 'Heading 5')}
            {renderTypographyEditor('h6', 'Heading 6')}
            {renderTypographyEditor('paragraph', 'Paragraphs')}
          </div>
        </StyleGroup>

        <StyleGroup id="elements" label="Dividers & Buttons" icon={Pointer}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                <h4 className="flex items-center space-x-2 font-bold text-slate-800"><Minus className="w-4 h-4" /><span>Divider (HR)</span></h4>
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl">
                   <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Weight (px)</label><input type="number" className="w-full p-2 border" value={s.divider.weight} onChange={(e) => updatePageSetting('divider.weight', parseInt(e.target.value))} /></div>
                   <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Color</label><input type="color" className="w-full h-8 p-1" value={s.divider.color} onChange={(e) => updatePageSetting('divider.color', e.target.value)} /></div>
                </div>
             </div>
             <div className="space-y-6">
                <h4 className="flex items-center space-x-2 font-bold text-slate-800"><Box className="w-4 h-4" /><span>Button Global Styles</span></h4>
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Background</label><input type="color" className="w-full h-8 p-1" value={s.button.backgroundColor} onChange={(e) => updatePageSetting('button.backgroundColor', e.target.value)} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Hover Color</label><input type="color" className="w-full h-8 p-1" value={s.button.hoverBackgroundColor} onChange={(e) => updatePageSetting('button.hoverBackgroundColor', e.target.value)} /></div>
                    </div>
                </div>
             </div>
           </div>
        </StyleGroup>
      </div>
    );
  }

  if (section === 'menu') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {renderSectionSettings('menu')}
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Navigation Items</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{config.menu.length} Items</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12 text-center">Icon</th>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">Link / Config</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(items as MenuItem[]).map((item) => {
                const isHome = item.type === 'HOME';
                const isCustom = item.type === 'CUSTOM';
                const isSearch = item.type === 'SMART_SEARCH';
                const isFavs = item.type === 'FAVORITES';

                return (
                  <tr key={item.id} className={`transition-colors ${item.visible ? 'hover:bg-slate-50' : 'bg-slate-50/50 grayscale opacity-60'}`}>
                    <td className="px-6 py-4">
                      <div className="flex justify-center text-slate-400">
                        {isHome && <Home className="w-4 h-4" />}
                        {isCustom && <LinkIcon className="w-4 h-4" />}
                        {isSearch && <Sparkles className="w-4 h-4" />}
                        {isFavs && <Heart className="w-4 h-4" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={item.label} 
                        onChange={(e) => { 
                          const newItems = (items as MenuItem[]).map(i => i.id === item.id ? { ...i, label: e.target.value } : i); 
                          onUpdateSection(section, newItems); 
                        }} 
                        className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-800 p-0" 
                      />
                      <p className="text-[10px] text-slate-400 uppercase font-black">{item.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {isCustom ? (
                          <input 
                            type="text" 
                            value={item.url} 
                            onChange={(e) => { 
                              const newItems = (items as MenuItem[]).map(i => i.id === item.id ? { ...i, url: e.target.value } : i); 
                              onUpdateSection(section, newItems); 
                            }} 
                            className="flex-1 bg-slate-100/50 border-none rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 text-slate-500 font-mono text-xs" 
                          />
                        ) : isSearch ? (
                          <div className="flex-1 flex items-center space-x-2 bg-slate-100/50 rounded px-2 py-1">
                            <SearchIcon className="w-3 h-3 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Search Query / Criteria"
                              value={item.searchQuery || ''} 
                              onChange={(e) => { 
                                const newItems = (items as MenuItem[]).map(i => i.id === item.id ? { ...i, searchQuery: e.target.value } : i); 
                                onUpdateSection(section, newItems); 
                              }} 
                              className="w-full bg-transparent border-none focus:ring-0 text-slate-500 font-mono text-xs p-0" 
                            />
                          </div>
                        ) : (
                          <span className="flex-1 text-[10px] text-slate-400 italic">Automatic Link: {item.url}</span>
                        )}

                        {(isSearch || isFavs) && onConfigureWidget && (
                          <button 
                            onClick={() => onConfigureWidget(isSearch ? 'SMART_SEARCH' : 'FAVORITES', { size: 10, type: 'vertical' }, item)}
                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Configure Page Settings"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {
                            const newItems = (items as MenuItem[]).map(i => i.id === item.id ? { ...i, visible: !i.visible } : i);
                            onUpdateSection(section, newItems);
                          }}
                          className={`p-2 rounded-lg transition-colors ${item.visible ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50' : 'text-indigo-600 bg-indigo-50'}`}
                        >
                          {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 relative">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center space-x-2 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              <span>Add Navigation Item</span>
            </button>

            {showAddMenu && (
              <div className="absolute left-6 right-6 bottom-full mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 grid grid-cols-2 md:grid-cols-4 gap-2 animate-in slide-in-from-bottom-2">
                <button onClick={() => addMenuItem('HOME')} className="flex flex-col items-center p-4 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100">
                  <Home className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Home</span>
                </button>
                <button onClick={() => addMenuItem('CUSTOM')} className="flex flex-col items-center p-4 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100">
                  <LinkIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Custom URL</span>
                </button>
                <button onClick={() => addMenuItem('SMART_SEARCH')} className="flex flex-col items-center p-4 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100">
                  <Sparkles className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Smart Search</span>
                </button>
                <button onClick={() => addMenuItem('FAVORITES')} className="flex flex-col items-center p-4 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100">
                  <Heart className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Favorites</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {(section === 'header' || section === 'footer') && renderSectionSettings(section)}
      
      {/* If we are on the Player Page, render the Player Settings at the top */}
      {section === 'playerPage' && renderPlayerSettingsBlock()}

      <div className="grid grid-cols-1 gap-4">
        {/* Header for the page content list */}
        {section === 'playerPage' && (
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Additional Page Content</h3>
              <p className="text-xs text-slate-500">Manage HTML and Markdown elements displayed below the player.</p>
            </div>
          </div>
        )}

        {(items as PageElement[]).map((item, index) => (
          <div key={item.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition-all flex items-center space-x-5">
            <div className="flex flex-col space-y-1 text-slate-300 group-hover:text-slate-400">
               <button onClick={() => handleReorder(index, 'up')} className="hover:text-indigo-600"><ArrowUp className="w-4 h-4" /></button>
               <button onClick={() => handleReorder(index, 'down')} className="hover:text-indigo-600"><ArrowDown className="w-4 h-4" /></button>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'HTML' ? 'bg-orange-50 text-orange-600' : item.type === 'MARKDOWN' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
              {item.type === 'HTML' && <Type className="w-6 h-6" />}
              {item.type === 'MARKDOWN' && <FileText className="w-6 h-6" />}
              {item.type === 'WIDGET' && <PlaySquare className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
              <p className="text-xs text-slate-400 uppercase font-black tracking-tighter">{item.type}</p>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.type === 'WIDGET' && onConfigureWidget && (
                <button 
                  onClick={() => onConfigureWidget('PLAYER', { size: 10, type: 'vertical' }, item)}
                  className="p-2.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Configure Widget"
                >
                  <Wrench className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => onEditElement(item)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"><Edit2 className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
        <button onClick={() => onAddElement(null)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center space-x-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold"><Plus className="w-5 h-5" /><span>Add Element to {section === 'playerPage' ? 'Player Page' : section}</span></button>
      </div>
    </div>
  );
};

export default SectionEditor;
