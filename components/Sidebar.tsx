
import React from 'react';
import { SectionKey } from '../types';
import { 
  LayoutTemplate, 
  Menu as MenuIcon, 
  Layout, 
  Columns, 
  PanelBottom, 
  ChevronRight,
  Palette,
  Settings,
  PlaySquare
} from 'lucide-react';

interface SidebarProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}

const SECTIONS: { key: SectionKey; label: string; icon: any }[] = [
  { key: 'portal', label: 'General Settings', icon: Settings },
  { key: 'header', label: 'Header', icon: Layout },
  { key: 'menu', label: 'Navigation Menu', icon: MenuIcon },
  { key: 'main', label: 'Main Body Content', icon: Columns },
  { key: 'playerPage', label: 'Player Page', icon: PlaySquare },
  { key: 'footer', label: 'Footer Section', icon: PanelBottom },
  { key: 'settings', label: 'Page Styles', icon: Palette },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="w-72 bg-slate-900 text-slate-400 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">Qumu</span>
            <span className="text-xs text-slate-500 font-medium">STUDIO PORTAL</span>
          </div>
        </div>

        <nav className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">General</p>
          {SECTIONS.filter(s => s.key === 'portal').map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all mb-4 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="font-medium">{section.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-300" />}
              </button>
            );
          })}

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Structure</p>
          {SECTIONS.filter(s => ['header', 'menu', 'main', 'playerPage', 'footer'].includes(s.key)).map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="font-medium">{section.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-300" />}
              </button>
            );
          })}

          <div className="pt-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Design</p>
            {SECTIONS.filter(s => s.key === 'settings').map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  onClick={() => onSectionChange(section.key)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="font-medium">{section.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-300" />}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="mt-auto p-6"></div>
    </div>
  );
};

export default Sidebar;
