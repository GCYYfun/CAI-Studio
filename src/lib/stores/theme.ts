/**
 * 主题状态管理
 * 管理应用的主题设置和全局状态
 */

import { writable, derived, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import { THEME_COLORS } from '../utils/constants';

/** 主题类型 */
export type Theme = 'dark' | 'light';

/** 全局应用状态接口 */
interface AppState {
  /** 当前主题 */
  theme: Theme;
  /** 是否显示加载状态 */
  isLoading: boolean;
  /** 移动端菜单是否打开 */
  isMobileMenuOpen: boolean;
  /** 是否启用动画效果 */
  animationsEnabled: boolean;
}

/** 初始状态 */
const initialState: AppState = {
  theme: 'dark',
  isLoading: false,
  isMobileMenuOpen: false,
  animationsEnabled: true,
};

/** 从localStorage获取保存的主题设置 */
function getStoredTheme(): Theme {
  if (!browser) return 'dark';
  
  try {
    const stored = localStorage.getItem('cai-studio-theme');
    return (stored as Theme) || 'dark';
  } catch {
    return 'dark';
  }
}

/** 保存主题设置到localStorage */
function saveTheme(theme: Theme): void {
  if (!browser) return;
  
  try {
    localStorage.setItem('cai-studio-theme', theme);
  } catch {
    console.warn('无法保存主题设置到localStorage');
  }
}

/** 创建应用状态store */
function createAppStore() {
  const { subscribe, set, update } = writable<AppState>({
    ...initialState,
    theme: getStoredTheme(),
  });

  return {
    subscribe,
    
    /** 设置主题 */
    setTheme: (theme: Theme) => {
      update(state => ({ ...state, theme }));
      saveTheme(theme);
      updateCSSVariables(theme);
    },
    
    /** 切换主题 */
    toggleTheme: () => {
      update(state => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        saveTheme(newTheme);
        updateCSSVariables(newTheme);
        return { ...state, theme: newTheme };
      });
    },
    
    /** 设置加载状态 */
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading }));
    },
    
    /** 切换移动端菜单 */
    toggleMobileMenu: () => {
      update(state => ({ ...state, isMobileMenuOpen: !state.isMobileMenuOpen }));
    },
    
    /** 关闭移动端菜单 */
    closeMobileMenu: () => {
      update(state => ({ ...state, isMobileMenuOpen: false }));
    },
    
    /** 设置动画启用状态 */
    setAnimationsEnabled: (enabled: boolean) => {
      update(state => ({ ...state, animationsEnabled: enabled }));
    },
    
    /** 重置状态 */
    reset: () => {
      set(initialState);
    },
  };
}

/** 更新CSS变量以支持主题切换 */
function updateCSSVariables(theme: Theme): void {
  if (!browser) return;
  
  const root = document.documentElement;
  if (!root) return;
  
  // 根据主题设置CSS变量
  if (theme === 'dark') {
    root.style.setProperty('--bg-primary', THEME_COLORS.background);
    root.style.setProperty('--bg-secondary', THEME_COLORS.backgroundSecondary);
    root.style.setProperty('--text-primary', THEME_COLORS.text);
    root.style.setProperty('--text-secondary', THEME_COLORS.textSecondary);
  } else {
    // 浅色主题配色（如果需要支持）
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#64748b');
  }
  
  root.style.setProperty('--accent-color', THEME_COLORS.accent);
  root.style.setProperty('--border-color', THEME_COLORS.border);
}

/** 应用状态store实例 */
export const appStore = createAppStore();

/** 派生的主题store */
export const theme: Readable<Theme> = derived(
  appStore,
  $appStore => $appStore.theme
);

/** 派生的加载状态store */
export const isLoading: Readable<boolean> = derived(
  appStore,
  $appStore => $appStore.isLoading
);

/** 派生的移动端菜单状态store */
export const isMobileMenuOpen: Readable<boolean> = derived(
  appStore,
  $appStore => $appStore.isMobileMenuOpen
);

/** 派生的动画启用状态store */
export const animationsEnabled: Readable<boolean> = derived(
  appStore,
  $appStore => $appStore.animationsEnabled
);

/** 初始化主题 - 在应用启动时调用 */
export function initializeTheme(): void {
  if (!browser) return;
  
  const storedTheme = getStoredTheme();
  appStore.setTheme(storedTheme);
  
  // 监听系统主题变化（可选功能）
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // 只有在用户没有手动设置主题时才跟随系统
    const currentTheme = getStoredTheme();
    if (!currentTheme) {
      appStore.setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
