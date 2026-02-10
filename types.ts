
export type ElementType = 'HTML' | 'MARKDOWN' | 'WIDGET';
export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type MenuItemType = 'HOME' | 'CUSTOM' | 'SMART_SEARCH' | 'FAVORITES';

export type QumuVideoSourceType = 'SINGLE' | 'SEARCH' | 'LIST';

export interface QumuVideoConfig {
  sourceType: QumuVideoSourceType;
  singleGuid?: string;
  singleAlias?: string;
  searchQuery?: string;
  guidList?: string;
  displayType: 'PLAYER' | 'GRID' | 'CAROUSEL' | 'VERTICAL' | 'THUMBNAIL';
  size: number;
}

export interface PageElement {
  id: string;
  type: ElementType;
  title: string;
  content: string;
  widgetType?: 'PLAYER' | 'GRID' | 'CAROUSEL'; // Legacy support
  qumuConfig?: QumuVideoConfig;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  type: MenuItemType;
  visible: boolean;
  searchQuery?: string;
  widgetConfig?: any;
}

export interface HeaderSettings {
  visible: boolean;
  backgroundColor: string;
  textColor: string;
  justification: 'left' | 'center' | 'right';
  showLogo: boolean;
  logoUrl?: string;
  showSearch: boolean;
  limitSearchToPortal: boolean;
  padding: 'compact' | 'normal' | 'spacious';
  isSticky: boolean;
}

export interface FooterSettings {
  visible: boolean;
  backgroundColor: string;
  textColor: string;
  justification: 'left' | 'center' | 'right';
  padding: 'compact' | 'normal' | 'spacious';
}

export interface MenuSettings {
  visible: boolean;
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
  justification: 'left' | 'center' | 'right';
  padding: 'compact' | 'normal' | 'spacious';
}

export interface PortalFunctionalSettings {
  title: string;
  alias: string;
  isPublic: boolean;
  restrictInternal: boolean;
  allowCreation: boolean;
  enableComments: boolean;
  enableLikes: boolean;
  enableFavorites: boolean;
  showViewCounts: boolean;
  // Player Settings
  playerAutoPlay: boolean;
  playerLoop: boolean;
  playerMuted: boolean;
  playerShowCaptions: boolean;
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  lineHeight: string;
}

export interface PageSettings {
  backgroundColor: string;
  contentBackgroundColor: string;
  contentMaxWidth: BreakpointKey;
  elementGap: number;
  h1: TypographySettings;
  h2: TypographySettings;
  h3: TypographySettings;
  h4: TypographySettings;
  h5: TypographySettings;
  h6: TypographySettings;
  paragraph: TypographySettings;
  link: TypographySettings & { hoverColor: string; underline: boolean };
  divider: { weight: number; color: string };
  button: {
    fontFamily: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
    borderRadius: number;
    hoverBackgroundColor: string;
  };
}

export interface PortalConfig {
  header: PageElement[];
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  menuSettings: MenuSettings;
  portalSettings: PortalFunctionalSettings;
  pageSettings: PageSettings;
  menu: MenuItem[];
  main: PageElement[];
  playerPage: PageElement[];
  footer: PageElement[];
}

export type SectionKey = 'header' | 'menu' | 'main' | 'playerPage' | 'footer' | 'settings' | 'portal';
