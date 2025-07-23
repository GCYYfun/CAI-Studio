/**
 * 应用常量定义
 * 包含整个应用中使用的常量值
 */

/** 应用基础信息 */
export const APP_INFO = {
  /** 应用名称 */
  name: 'CAI Game Studio',
  /** 应用描述 */
  description: '搞点有趣的东西',
  /** 版本号 */
  version: '1.0.0',
  /** 作者信息 */
  author: 'CAI Game Studio Team',
} as const;

/** 联系信息 */
export const CONTACT_INFO = {
  /** 公司邮箱 */
  email: 'info@caistudio.com',
  /** 社交媒体链接 */
  social: {
    github: 'https://github.com/Lounger-Habitat',
    bilibili: 'https://space.bilibili.com/3546693779852249?spm_id_from=333.337.0.0',
  },
} as const;

/** 路由路径常量 */
export const ROUTES = {
  /** 首页 */
  HOME: '/',
  /** 关于页面 */
  ABOUT: '/about',
  /** 项目页面 */
  PROJECTS: '/projects',
  /** 演示页面 */
  DEMO: '/demo',
} as const;

/** 响应式断点 */
export const BREAKPOINTS = {
  /** 移动端 */
  mobile: '768px',
  /** 平板 */
  tablet: '1024px',
  /** 桌面端 */
  desktop: '1280px',
  /** 大屏幕 */
  wide: '1536px',
} as const;

/** 主题色彩配置 */
export const THEME_COLORS = {
  /** 主背景色 */
  background: '#0a192f',
  /** 次级背景色 */
  backgroundSecondary: '#112240',
  /** 主文本色 */
  text: '#e6f1ff',
  /** 次级文本色 */
  textSecondary: 'rgba(230, 241, 255, 0.7)',
  /** 强调色 */
  accent: '#64ffda',
  /** 成功色 */
  success: '#4ade80',
  /** 警告色 */
  warning: '#fbbf24',
  /** 错误色 */
  error: '#f87171',
  /** 边框色 */
  border: 'rgba(100, 255, 218, 0.2)',
} as const;

/** 动画配置 */
export const ANIMATIONS = {
  /** 默认过渡时间 */
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  /** 缓动函数 */
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

/** 3D场景默认配置 */
export const SCENE_3D_CONFIG = {
  /** 粒子数量 */
  particleCount: 20,
  /** 相机位置 */
  cameraPosition: [0, 0, 15] as [number, number, number],
  /** 视野角度 */
  fov: 50,
  /** 自动旋转速度 */
  autoRotateSpeed: 0.5,
  /** 旋转速度 */
  rotationSpeed: 0.1,
} as const;

/** 表单验证规则 */
export const VALIDATION_RULES = {
  /** 邮箱正则 */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** 最小姓名长度 */
  minNameLength: 2,
  /** 最大姓名长度 */
  maxNameLength: 50,
  /** 最小消息长度 */
  minMessageLength: 10,
  /** 最大消息长度 */
  maxMessageLength: 1000,
} as const;

/** Z-index层级 */
export const Z_INDEX = {
  /** 下拉菜单 */
  dropdown: 1000,
  /** 导航栏 */
  navbar: 1100,
  /** 模态框 */
  modal: 1200,
  /** 提示框 */
  tooltip: 1300,
  /** 加载层 */
  loading: 1400,
} as const;
