
import React, { useState } from 'react';
import { 
  Layout, 
  Eye, 
  Save
} from 'lucide-react';
import { PortalConfig, SectionKey, PageElement, MenuItem, ElementType, HeaderSettings, FooterSettings, PageSettings, PortalFunctionalSettings, MenuSettings } from './types';
import Sidebar from './components/Sidebar';
import SectionEditor from './components/SectionEditor';
import Preview from './components/Preview';
import EditorModal from './components/EditorModal';
import WidgetConfigView from './components/WidgetConfigView';

const DEFAULT_TYPOGRAPHY = (size: string, weight: string = '400') => ({
  fontFamily: 'Inter',
  fontSize: size,
  fontWeight: weight,
  color: '#1e293b',
  lineHeight: '1.5'
});

const INITIAL_CONFIG: PortalConfig = {
  header: [
    { id: '1', type: 'HTML', title: 'Welcome Header', content: '<h1>Portal Welcome</h1>' }
  ],
  headerSettings: {
    visible: true,
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    justification: 'center',
    showLogo: true,
    logoUrl: '',
    showSearch: true,
    limitSearchToPortal: true,
    padding: 'normal',
    isSticky: false
  },
  footerSettings: {
    visible: true,
    backgroundColor: '#f8fafc',
    textColor: '#64748b',
    justification: 'center',
    padding: 'normal'
  },
  menuSettings: {
    visible: true,
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    hoverColor: '#6366f1',
    justification: 'center',
    padding: 'normal'
  },
  portalSettings: {
    title: 'New Viewer Portal',
    alias: 'main-portal',
    isPublic: true,
    restrictInternal: false,
    allowCreation: false,
    enableComments: true,
    enableLikes: true,
    enableFavorites: true,
    showViewCounts: true,
    playerAutoPlay: false,
    playerLoop: false,
    playerMuted: false,
    playerShowCaptions: true
  },
  pageSettings: {
    backgroundColor: '#f1f5f9',
    contentBackgroundColor: '#ffffff',
    contentMaxWidth: 'xl',
    elementGap: 32,
    h1: DEFAULT_TYPOGRAPHY('2.5rem', '700'),
    h2: DEFAULT_TYPOGRAPHY('2rem', '700'),
    h3: DEFAULT_TYPOGRAPHY('1.75rem', '600'),
    h4: DEFAULT_TYPOGRAPHY('1.5rem', '600'),
    h5: DEFAULT_TYPOGRAPHY('1.25rem', '600'),
    h6: DEFAULT_TYPOGRAPHY('1rem', '600'),
    paragraph: DEFAULT_TYPOGRAPHY('1rem', '400'),
    link: { ...DEFAULT_TYPOGRAPHY('1rem', '500'), color: '#4f46e5', hoverColor: '#4338ca', underline: true },
    divider: { weight: 1, color: '#e2e8f0' },
    button: {
      fontFamily: 'Inter',
      fontSize: '1rem',
      color: '#ffffff',
      backgroundColor: '#4f46e5',
      borderRadius: 8,
      hoverBackgroundColor: '#4338ca'
    }
  },
  menu: [
    { id: 'm1', label: 'Home', url: '/', type: 'HOME', visible: true },
    { id: 'm2', label: 'Videos', url: '/videos', type: 'CUSTOM', visible: true }
  ],
  main: [
    { id: '2', type: 'WIDGET', title: 'Featured Content', content: '', widgetType: 'CAROUSEL' },
    { id: '3', type: 'MARKDOWN', title: 'Intro Text', content: '### Welcome to the Qumu Video Portal\nSelect a video from the carousel above to start watching.' }
  ],
  playerPage: [
    { id: 'p1', type: 'MARKDOWN', title: 'Video Description Placeholder', content: '## About this Presentation\nAdd detailed information about the video here. This content appears below the player.' }
  ],
  footer: [
    { id: '4', type: 'HTML', title: 'Copyright', content: '<p>&copy; 2024 Qumu Inc.</p>' }
  ]
};

export default function App() {
  const [config, setConfig] = useState<PortalConfig>(INITIAL_CONFIG);
  const [activeSection, setActiveSection] = useState<SectionKey>('portal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<{ section: SectionKey, element: PageElement | null } | null>(null);
  
  // State for Widget Configuration View
  const [activeWidgetConfig, setActiveWidgetConfig] = useState<{ type: 'SMART_SEARCH' | 'FAVORITES' | 'PLAYER', data: any, sourceItem?: any } | null>(null);

  const handleUpdateSection = (section: SectionKey, elements: PageElement[] | MenuItem[]) => {
    setConfig(prev => ({
      ...prev,
      [section]: elements
    }));
  };

  const handleUpdateHeaderSettings = (settings: HeaderSettings) => {
    setConfig(prev => ({
      ...prev,
      headerSettings: settings
    }));
  };

  const handleUpdateFooterSettings = (settings: FooterSettings) => {
    setConfig(prev => ({
      ...prev,
      footerSettings: settings
    }));
  };

  const handleUpdateMenuSettings = (settings: MenuSettings) => {
    setConfig(prev => ({
      ...prev,
      menuSettings: settings
    }));
  };

  const handleUpdatePortalSettings = (settings: PortalFunctionalSettings) => {
    setConfig(prev => ({
      ...prev,
      portalSettings: settings
    }));
  };

  const handleUpdatePageSettings = (settings: PageSettings) => {
    setConfig(prev => ({
      ...prev,
      pageSettings: settings
    }));
  };

  const openEditor = (section: SectionKey, element: PageElement | null = null) => {
    setEditingElement({ section, element });
  };

  const saveElement = (section: SectionKey, element: PageElement) => {
    setConfig(prev => {
      const items = prev[section as keyof PortalConfig];
      if (!Array.isArray(items)) return prev;
      
      const currentItems = items as PageElement[];
      const exists = currentItems.find(item => item.id === element.id);
      
      let newItems;
      if (exists) {
        newItems = currentItems.map(item => item.id === element.id ? element : item);
      } else {
        newItems = [...currentItems, element];
      }
      
      return { ...prev, [section]: newItems };
    });
    setEditingElement(null);
  };

  const saveWidgetConfig = (newWidgetConfig: any) => {
    if (!activeWidgetConfig) return;

    // Determine which section the source item was in
    const source = activeWidgetConfig.sourceItem;
    if (source && source.type) {
      // It's a menu item or a page element
      if ('label' in source) {
        // Menu item
        const newMenu = config.menu.map(m => m.id === source.id ? { ...m, widgetConfig: newWidgetConfig } : m);
        handleUpdateSection('menu', newMenu);
      } else {
        // Page element
        const newMain = config.main.map(e => e.id === source.id ? { ...e, widgetConfig: newWidgetConfig } : e);
        handleUpdateSection('main', newMain);
      }
    }
    
    // In a real app, we'd persist the widget configuration object.
    // For now, we just close the view.
    setActiveWidgetConfig(null);
  };

  const sectionTitles: Record<SectionKey, string> = {
    portal: 'General Settings',
    header: 'Header Configuration',
    menu: 'Navigation Menu',
    main: 'Main Body Content',
    playerPage: 'Player Page Content',
    footer: 'Footer Section',
    settings: 'Page Styles'
  };

  const sectionDescriptions: Record<SectionKey, string> = {
    portal: 'Manage the core identity, access controls, and player behavior of your portal.',
    header: 'Customize the layout and content of your portal\'s header.',
    menu: 'Configure navigation items and visual styling for the menu bar.',
    main: 'Build the primary content area for the Portal Home page.',
    playerPage: 'Customize the content that appears below the video player on the playback page.',
    footer: 'Edit the content and styling for the bottom of your pages.',
    settings: 'Define global typography, colors, and layout settings for the entire portal.'
  };

  // If we are in Widget Config mode, render that instead of the main editor
  if (activeWidgetConfig) {
    return (
      <WidgetConfigView 
        type={activeWidgetConfig.type}
        initialConfig={activeWidgetConfig.data}
        onBack={() => setActiveWidgetConfig(null)}
        onSave={saveWidgetConfig}
        onLaunchAdvanced={() => window.open('https://qumu.com/widget-creator', '_blank')}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-2">
            <Layout className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800">Viewer Portal Builder</h1>
            <span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-500 ml-4 font-medium uppercase tracking-wider">Draft</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              <span>Publish Portal</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {sectionTitles[activeSection]}
              </h2>
              <p className="text-slate-500">
                {sectionDescriptions[activeSection]}
              </p>
            </div>

            <SectionEditor 
              section={activeSection}
              config={config}
              onUpdateSection={handleUpdateSection}
              onUpdateHeaderSettings={handleUpdateHeaderSettings}
              onUpdateFooterSettings={handleUpdateFooterSettings}
              onUpdateMenuSettings={handleUpdateMenuSettings}
              onUpdatePortalSettings={handleUpdatePortalSettings}
              onUpdatePageSettings={handleUpdatePageSettings}
              onAddElement={(type) => openEditor(activeSection)}
              onEditElement={(el) => openEditor(activeSection, el)}
              onConfigureWidget={(type, data, source) => setActiveWidgetConfig({ type, data, sourceItem: source })}
            />
          </div>
        </div>
      </main>

      {isPreviewOpen && (
        <Preview 
          config={config} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}

      {editingElement && (
        <EditorModal 
          section={editingElement.section}
          element={editingElement.element}
          onSave={(el) => saveElement(editingElement.section, el)}
          onClose={() => setEditingElement(null)}
        />
      )}
    </div>
  );
}
