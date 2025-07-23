<!--
  通用页面区块组件
  用于包装页面中的不同区块，提供统一的布局和动画效果
  
  Props:
  - id: 区块ID，用于锚点定位
  - className: 自定义CSS类名
  - background: 背景样式类型
  - padding: 内边距大小
  - animated: 是否启用进入动画
  - fullHeight: 是否占据全屏高度
  
  Slots:
  - default: 区块内容
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { fadeIn, createIntersectionObserver } from '../../utils/animation';
  import { animationsEnabled } from '../../stores/theme';
  
  interface SectionProps {
    id?: string;
    className?: string;
    background?: 'primary' | 'secondary' | 'transparent';
    padding?: 'none' | 'small' | 'medium' | 'large';
    animated?: boolean;
    fullHeight?: boolean;
    children?: any;
    'data-section'?: string;
  }
  
  /** 区块属性 */
  let {
    id = '',
    className = '',
    background = 'transparent',
    padding = 'large',
    animated = true,
    fullHeight = false,
    children,
    ...restProps
  }: SectionProps = $props();
  
  /** 区块DOM元素引用 */
  let sectionElement: HTMLElement;
  /** 是否已触发动画 */
  let isAnimated = false;
  
  /** 计算区块的CSS类名 */
  const sectionClasses = $derived([
    'section',
    `section--bg-${background}`,
    `section--padding-${padding}`,
    fullHeight && 'section--full-height',
    animated && !isAnimated && 'section--hidden',
    className
  ].filter(Boolean).join(' '));
  
  /** 组件挂载后设置动画观察器 */
  onMount(() => {
    if (!animated || !sectionElement) return;
    
    // 创建交集观察器来触发进入动画
    const observer = createIntersectionObserver(
      [sectionElement],
      (element) => {
        if (animationsEnabled && !isAnimated) {
          fadeIn(element, { duration: 800, delay: 100 });
          isAnimated = true;
        } else {
          // 如果动画被禁用，直接显示
          element.classList.remove('section--hidden');
          isAnimated = true;
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    return () => {
      observer.disconnect();
    };
  });
</script>

<section
  bind:this={sectionElement}
  class={sectionClasses}
  {id}
  data-section={restProps['data-section']}
  {...restProps}
>
  <div class="section__container">
    {@render children?.()}
  </div>
</section>

<style>
  .section {
    /* 基础样式 */
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  
  /* 隐藏状态 - 用于动画 */
  .section--hidden {
    opacity: 0;
    transform: translateY(30px);
  }
  
  /* 背景样式 */
  .section--bg-primary {
    background-color: var(--bg-primary);
  }
  
  .section--bg-secondary {
    background-color: var(--bg-secondary);
  }
  
  .section--bg-transparent {
    background-color: transparent;
  }
  
  /* 内边距样式 */
  .section--padding-none {
    padding: 0;
  }
  
  .section--padding-small {
    padding: 2rem 0;
  }
  
  .section--padding-medium {
    padding: 4rem 0;
  }
  
  .section--padding-large {
    padding: 6rem 0;
  }
  
  /* 全屏高度 */
  .section--full-height {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
  
  /* 容器样式 */
  .section__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }
  
  /* 响应式设计 */
  @media (max-width: 1280px) {
    .section__container {
      max-width: 1024px;
      padding: 0 1.5rem;
    }
  }
  
  @media (max-width: 1024px) {
    .section__container {
      max-width: 768px;
    }
    
    .section--padding-large {
      padding: 4rem 0;
    }
    
    .section--padding-medium {
      padding: 3rem 0;
    }
  }
  
  @media (max-width: 768px) {
    .section__container {
      max-width: 100%;
      padding: 0 1rem;
    }
    
    .section--padding-large {
      padding: 3rem 0;
    }
    
    .section--padding-medium {
      padding: 2rem 0;
    }
    
    .section--padding-small {
      padding: 1.5rem 0;
    }
  }
  
  /* 无障碍设计 */
  @media (prefers-reduced-motion: reduce) {
    .section--hidden {
      opacity: 1;
      transform: none;
    }
  }
</style>
