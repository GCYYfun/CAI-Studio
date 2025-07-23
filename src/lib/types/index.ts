/**
 * 项目通用类型定义
 * 定义了整个应用中使用的共享类型接口
 */

/** 基础组件Props */
export interface BaseComponentProps {
  /** 组件唯一标识 */
  id?: string;
  /** 自定义CSS类名 */
  className?: string;
}

/** 按钮组件变体类型 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/** 按钮组件尺寸类型 */
export type ButtonSize = 'small' | 'medium' | 'large';

/** 按钮组件Props */
export interface ButtonProps extends BaseComponentProps {
  /** 按钮文本 */
  text: string;
  /** 按钮变体样式 */
  variant?: ButtonVariant;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 链接地址（如果是链接按钮） */
  href?: string;
}

/** 卡片组件Props */
export interface CardProps extends BaseComponentProps {
  /** 卡片标题 */
  title?: string;
  /** 卡片描述 */
  description?: string;
  /** 是否可悬停 */
  hoverable?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 内联样式 */
  style?: string;
}

/** 团队成员信息 */
export interface TeamMember {
  /** 成员姓名 */
  name: string;
  /** 职位角色 */
  role: string;
  /** 头像图片路径 */
  avatar: string;
  /** 个人描述 */
  bio?: string;
  /** 社交媒体链接 */
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

/** 项目信息 */
export interface Project {
  /** 项目ID */
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目描述 */
  description: string;
  /** 项目封面图 */
  image: string;
  /** 项目标签 */
  tags: string[];
  /** 项目链接 */
  link?: string;
  /** 项目状态 */
  status: 'developing' | 'completed' | 'planning';
  /** 发布日期 */
  releaseDate?: string;
}

/** 特性/功能信息 */
export interface Feature {
  /** 特性标题 */
  title: string;
  /** 特性描述 */
  description: string;
  /** 特性图标（可选） */
  icon?: string;
}

/** 联系表单数据 */
export interface ContactFormData {
  /** 姓名 */
  name: string;
  /** 邮箱 */
  email: string;
  /** 主题 */
  subject: string;
  /** 消息内容 */
  message: string;
}

/** 页面SEO元数据 */
export interface SEOMetadata {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词 */
  keywords?: string[];
  /** 开放图协议数据 */
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
}

/** 3D场景配置 */
export interface Scene3DConfig {
  /** 粒子数量 */
  particleCount: number;
  /** 是否自动旋转 */
  autoRotate: boolean;
  /** 旋转速度 */
  rotationSpeed: number;
  /** 相机位置 */
  cameraPosition: [number, number, number];
  /** 视野角度 */
  fov: number;
}

/** 动画配置 */
export interface AnimationConfig {
  /** 动画持续时间(ms) */
  duration: number;
  /** 动画延迟(ms) */
  delay?: number;
  /** 缓动函数 */
  easing?: string;
  /** 是否无限循环 */
  infinite?: boolean;
}

/** 响应式断点 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';
