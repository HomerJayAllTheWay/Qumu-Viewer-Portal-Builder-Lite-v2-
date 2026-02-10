
import React, { useState, useMemo } from 'react';
import { X, Monitor, Smartphone, Tablet, Search, LayoutTemplate, Home, PlayCircle, MessageSquare } from 'lucide-react';
import { PortalConfig, PageElement, TypographySettings, BreakpointKey } from '../types';

interface PreviewProps {
  config: PortalConfig;
  onClose: () => void;
}

const BREAKPOINT_MAP: Record<BreakpointKey, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

const Preview: React.FC<PreviewProps> = ({ config, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [previewPage, setPreviewPage] = useState<'home' | 'player'>('home');

  const typographyToCSS = (typo: TypographySettings) => `
    font-family: ${typo.fontFamily};
    font-size: ${typo.fontSize};
    font-weight: ${typo.fontWeight};
    color: ${typo.color};
    line-height: ${typo.lineHeight};
  `;

  const dynamicStyles = useMemo(() => {
    const s = config.pageSettings;
    const m = config.menuSettings;
    return `
      #preview-root h1 { ${typographyToCSS(s.h1)} }
      #preview-root h2 { ${typographyToCSS(s.h2)} }
      #preview-root h3 { ${typographyToCSS(s.h3)} }
      #preview-root h4 { ${typographyToCSS(s.h4)} }
      #preview-root h5 { ${typographyToCSS(s.h5)} }
      #preview-root h6 { ${typographyToCSS(s.h6)} }
      #preview-root p, #preview-root .prose p { ${typographyToCSS(s.paragraph)} }
      #preview-root a { 
        ${typographyToCSS(s.link)}
        text-decoration: ${s.link.underline ? 'underline' : 'none'};
      }
      #preview-root a:hover { color: ${s.link.hoverColor}; }
      
      #preview-root nav a { color: ${m.textColor}; transition: color 0.2s; }
      #preview-root nav a:hover { color: ${m.hoverColor}; }

      #preview-root hr {
        height: ${s.divider.weight}px;
        background-color: ${s.divider.color};
        border: none;
      }
      #preview-root button.portal-btn {
        font-family: ${s.button.fontFamily};
        font-size: ${s.button.fontSize};
        color: ${s.button.color};
        background-color: ${s.button.backgroundColor};
        border-radius: ${s.button.borderRadius}px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        transition: all 0.2s;
      }
      #preview-root button.portal-btn:hover {
        background-color: ${s.button.hoverBackgroundColor};
      }
      #preview-root .content-section {
        gap: ${s.elementGap}px;
      }
    `;
  }, [config.pageSettings, config.menuSettings]);

  const renderElements = (elements: PageElement[]) => {
    return elements.map(el => {
      if (el.type === 'HTML') return <div key={el.id} dangerouslySetInnerHTML={{ __html: el.content }} className="prose max-w-none" />;
      if (el.type === 'MARKDOWN') return <div key={el.id} className="prose max-w-none whitespace-pre-wrap">{el.content}</div>;
      if (el.type === 'WIDGET') {
        return (
          <div key={el.id} className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white space-y-4 overflow-hidden relative group">
             <img src={`https://picsum.photos/seed/${el.id}/800/450`} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="Video" />
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-4 group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
                <h5 className="font-bold text-lg tracking-tight">Qumu {el.widgetType} Widget</h5>
             </div>
          </div>
        );
      }
      return null;
    });
  };

  const getContainerStyle = () => {
    const isFull = config.pageSettings.contentMaxWidth === 'full';
    return {
      maxWidth: isFull ? '100%' : BREAKPOINT_MAP[config.pageSettings.contentMaxWidth],
      margin: '0 auto',
      width: '100%',
      minHeight: '100%',
      backgroundColor: config.pageSettings.contentBackgroundColor,
    };
  };

  const getPaddingClass = (padding: string) => {
    switch(padding) {
      case 'compact': return 'py-4 px-8';
      case 'spacious': return 'py-12 px-8';
      default: return 'p-8';
    }
  };

  const getMenuPaddingClass = (padding: string) => {
    switch(padding) {
      case 'compact': return 'py-2 px-8';
      case 'spacious': return 'py-8 px-8';
      default: return 'py-4 px-8';
    }
  };

  const visibleMenuItems = useMemo(() => {
    return config.menu.filter(item => item.visible);
  }, [config.menu]);

  return (
    <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-50">
        <div className="flex items-center space-x-6">
          <span className="font-black text-2xl tracking-tighter text-indigo-600 italic">PORTAL PREVIEW</span>
          
          <div className="flex bg-slate-100 p-1 rounded-xl space-x-1">
            <button 
              onClick={() => setPreviewPage('home')} 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${previewPage === 'home' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal Home</span>
            </button>
            <button 
              onClick={() => setPreviewPage('player')} 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${previewPage === 'player' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Player Page</span>
            </button>
          </div>

          <div className="w-px h-6 bg-slate-200" />

          <div className="flex bg-slate-100 p-1 rounded-xl space-x-1">
            <button onClick={() => setDevice('desktop')} className={`p-2 rounded-lg ${device === 'desktop' ? 'bg-white shadow-sm' : ''}`}><Monitor className="w-4 h-4" /></button>
            <button onClick={() => setDevice('tablet')} className={`p-2 rounded-lg ${device === 'tablet' ? 'bg-white shadow-sm' : ''}`}><Tablet className="w-4 h-4" /></button>
            <button onClick={() => setDevice('mobile')} className={`p-2 rounded-lg ${device === 'mobile' ? 'bg-white shadow-sm' : ''}`}><Smartphone className="w-4 h-4" /></button>
          </div>
        </div>
        <button onClick={onClose} className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold flex items-center space-x-2">
          <X className="w-4 h-4" />
          <span>Exit Preview</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center transition-all duration-300" style={{ backgroundColor: config.pageSettings.backgroundColor }}>
        <div 
          id="preview-root"
          className={`shadow-2xl transition-all duration-300 overflow-y-auto flex flex-col rounded-b-lg relative h-fit min-h-full ${device === 'mobile' ? 'max-w-[375px]' : device === 'tablet' ? 'max-w-[768px]' : ''}`}
          style={getContainerStyle()}
        >
          {config.headerSettings.visible && (
            <header className={`${config.headerSettings.isSticky ? 'sticky top-0 z-40' : 'relative z-10'} border-b`} style={{ backgroundColor: config.headerSettings.backgroundColor, color: config.headerSettings.textColor }}>
               <div className={`${getPaddingClass(config.headerSettings.padding)} flex flex-col items-${config.headerSettings.justification === 'center' ? 'center' : config.headerSettings.justification === 'left' ? 'start' : 'end'}`}>
                 {(config.headerSettings.showLogo || config.headerSettings.showSearch) && (
                   <div className="w-full flex items-center justify-between mb-4">
                     {config.headerSettings.showLogo && (config.headerSettings.logoUrl ? <img src={config.headerSettings.logoUrl} className="h-8" /> : <LayoutTemplate className="w-8 h-8" />)}
                     {config.headerSettings.showSearch && (
                       <div className="relative max-w-xs w-full">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                         <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-full border border-current opacity-50" disabled />
                       </div>
                     )}
                   </div>
                 )}
                 <div className="w-full">{renderElements(config.header)}</div>
               </div>
            </header>
          )}

          {config.menuSettings.visible && (
            <nav className="z-30 transition-all duration-200" style={{ backgroundColor: config.menuSettings.backgroundColor }}>
               <ul className={`flex flex-wrap items-center ${getMenuPaddingClass(config.menuSettings.padding)} justify-${config.menuSettings.justification === 'center' ? 'center' : config.menuSettings.justification === 'left' ? 'start' : 'end'} space-x-8`}>
                 {visibleMenuItems.map(item => (
                   <li key={item.id}><a href={item.url} className="text-sm font-bold uppercase tracking-widest">{item.label}</a></li>
                 ))}
               </ul>
            </nav>
          )}

          <main className="flex-1 p-8 flex flex-col content-section">
            {previewPage === 'home' ? (
              <>
                {renderElements(config.main)}
                <div className="flex justify-center mt-8">
                  <button className="portal-btn">Standard Portal Button</button>
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Main Player Placeholder */}
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                  <img src="https://picsum.photos/seed/player-bg/1920/1080" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video Placeholder" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full border-2 border-white/20 flex items-center justify-center transition-all group-hover:scale-110">
                      <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-white border-b-[20px] border-b-transparent ml-3"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800">
                    <div className="h-full bg-indigo-600 w-1/3" />
                  </div>
                </div>

                {/* Player Metadata (Simulated native Qumu fields) */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Sample Presentation Title</h2>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>Uploaded: Dec 12, 2024</span>
                      {config.portalSettings.showViewCounts && <span>• 1,245 Views</span>}
                    </div>
                  </div>
                  {config.portalSettings.enableLikes && (
                    <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      <span className="text-sm font-bold">128 Likes</span>
                    </button>
                  )}
                </div>

                {/* CUSTOM PLAYER PAGE ELEMENTS (Added by the user) */}
                <div className="space-y-6 pt-2">
                  {renderElements(config.playerPage)}
                </div>

                {/* Simulated Comments Section if enabled */}
                {config.portalSettings.enableComments && (
                  <div className="mt-12 pt-12 border-t border-slate-100 space-y-6">
                    <div className="flex items-center space-x-3 text-slate-800">
                      <MessageSquare className="w-6 h-6" />
                      <h3 className="text-xl font-bold">Comments (2)</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold text-sm">John Doe</span>
                          <span className="text-xs text-slate-400">2 hours ago</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">This content was very helpful, thank you for sharing!</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold text-sm">Jane Smith</span>
                          <span className="text-xs text-slate-400">Yesterday</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">I loved the clear explanation in the second half of the video.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {config.footerSettings.visible && (
            <footer className="border-t" style={{ backgroundColor: config.footerSettings.backgroundColor, color: config.footerSettings.textColor }}>
               <div className={`${getPaddingClass(config.footerSettings.padding)} flex flex-col items-${config.footerSettings.justification === 'center' ? 'center' : config.footerSettings.justification === 'left' ? 'start' : 'end'}`}>
                 <div className="w-full">{renderElements(config.footer)}</div>
               </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
