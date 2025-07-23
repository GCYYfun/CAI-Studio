<!--
  应用根布局组件
  提供整个应用的基础布局结构，包括导航栏、主内容区域和页脚
  
  Features:
  - 响应式布局结构
  - 全局状态管理
  - 主题初始化
  - SEO优化
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  
  // 导入布局组件
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  
  // 导入状态管理
  import { initializeTheme } from '$lib/stores/theme';
  
  /** 子组件内容 */
  let { children } = $props();
  
  /** 是否已完成初始化 */
  let isInitialized = $state(false);
  
  /** 组件挂载时初始化应用 */
  onMount(() => {
    console.log('应用布局组件已挂载');
    
    // 初始化主题系统
    initializeTheme();
    
    // 添加全局错误处理
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // WebGL上下文丢失处理
    window.addEventListener('webglcontextlost', handleWebGLContextLost);
    window.addEventListener('webglcontextrestored', handleWebGLContextRestored);
    
    // 标记初始化完成
    isInitialized = true;
    
    return () => {
      // 清理事件监听器
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('webglcontextlost', handleWebGLContextLost);
      window.removeEventListener('webglcontextrestored', handleWebGLContextRestored);
    };
  });
  
  /** 全局错误处理 */
  function handleGlobalError(event: ErrorEvent) {
    console.error('全局错误:', event.error);
    // 这里可以添加错误报告逻辑
  }
  
  /** 未处理的 Promise 拒绝处理 */
  function handleUnhandledRejection(event: PromiseRejectionEvent) {
    console.error('未处理的 Promise 拒绝:', event.reason);
    // 这里可以添加错误报告逻辑
  }
  
  /** WebGL上下文丢失处理 */
  function handleWebGLContextLost(event: Event) {
    console.warn('WebGL上下文丢失:', event);
    event.preventDefault();
    // 可以显示用户友好的错误提示
  }
  
  /** WebGL上下文恢复处理 */
  function handleWebGLContextRestored(event: Event) {
    console.log('WebGL上下文已恢复:', event);
    // 可以尝试重新初始化3D场景
  }
</script>

<!-- 跳转到主内容的链接（无障碍支持） -->
<a href="#main-content" class="skip-link">
  跳转到主内容
</a>

<!-- 应用根容器 -->
<div class="app-layout">
  <!-- 导航栏 -->
  <Navbar />
  
  <!-- 主内容区域 -->
  <main id="main-content" class="main-content">
    {#if isInitialized}
      {@render children()}
    {:else}
      <!-- 应用加载状态 -->
      <div class="app-loading">
        <div class="app-loading__spinner"></div>
        <p class="app-loading__text">正在加载...</p>
      </div>
    {/if}
  </main>
  
  <!-- 页脚 -->
  <Footer />
</div>

<style>
  .app-layout {
    /* 基础布局 */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }
  
  .main-content {
    /* 主内容区域 */
    flex: 1;
    position: relative;
    width: 100%;
    /* 确保内容不被导航栏遮挡 */
    padding-top: 0;
    /* 为3D渲染提供正确的z-index层级 */
    z-index: 1;
  }
  
  /* 跳转链接样式 - 无障碍功能 */
  .skip-link {
    position: absolute;
    top: -100px; /* 移到更远的位置，确保完全隐藏 */
    left: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    z-index: 1400;
    transition: top 0.15s ease;
    text-decoration: none;
    font-weight: 600;
    border: 2px solid var(--accent-color);
    /* 确保在非焦点状态下完全不可见 */
    opacity: 0;
    visibility: hidden;
  }
  
  .skip-link:focus {
    top: 1rem;
    opacity: 1;
    visibility: visible;
  }
  
  /* 应用加载状态 */
  .app-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }
  
  .app-loading__spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(100, 255, 218, 0.3);
    border-radius: 50%;
    border-top-color: var(--accent-color);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1.5rem;
  }
  
  .app-loading__text {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 0;
  }
  
  /* 确保3D Canvas不受布局干扰 */
  :global(canvas) {
    display: block !important;
    outline: none;
  }
  
  /* 为Three.js提供合适的容器环境 */
  :global(.three-container) {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .main-content {
      /* 移动端可能需要调整间距 */
      padding-top: 0;
    }
    
    .app-loading__spinner {
      width: 2.5rem;
      height: 2.5rem;
    }
    
    .app-loading__text {
      font-size: 1rem;
    }
  }
  
  /* 减少动画偏好 */
  @media (prefers-reduced-motion: reduce) {
    .app-loading__spinner {
      animation: none;
      border-top-color: var(--accent-color);
    }
    
    .skip-link {
      transition: none;
    }
  }
  
  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .skip-link {
      background: var(--bg-secondary);
      border-width: 3px;
    }
    
    .app-loading__spinner {
      border-width: 4px;
    }
  }
</style>
