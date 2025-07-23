<!--
  3D英雄区域组件
  展示主页的3D背景效果和标题内容
  
  Props:
  - title: 主标题
  - subtitle: 副标题
  - className: 自定义CSS类名
-->

<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { onMount } from 'svelte';
  import Scene3D from './Scene3D.svelte';
  import Button from '../ui/Button.svelte';
  import { ROUTES } from '../../utils/constants';
  
  interface Hero3DProps {
    title?: string;
    subtitle?: string;
    className?: string;
  }
  
  /** 组件属性 */
  let {
    title = 'CAI Game Studio',
    subtitle = '搞点有趣的东西',
    className = ''
  }: Hero3DProps = $props();
  
  /** Canvas容器元素引用 */
  let canvasContainer: HTMLElement | undefined = $state();
  /** Canvas是否已挂载 */
  let isCanvasMounted = $state(false);
  /** WebGL是否支持 */
  let webglSupported = $state(true);
  /** 3D渲染是否发生错误 */
  let renderError = $state(false);
  
  /** 检查WebGL支持 */
  function checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch {
      return false;
    }
  }
  
  /** 处理Canvas渲染错误 */
  function handleRenderError(error: any) {
    console.warn('3D渲染错误:', error);
    renderError = true;
  }
  
  /** 组件挂载后初始化3D场景 */
  onMount(() => {
    // 检查WebGL支持
    if (!checkWebGLSupport()) {
      webglSupported = false;
      return;
    }
    
    // 延迟挂载Canvas，确保DOM完全准备就绪
    const timer = setTimeout(() => {
      isCanvasMounted = true;
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  });
</script>

<div class="hero-3d {className}">
  <!-- 3D背景Canvas -->
  <div class="hero-3d__canvas" bind:this={canvasContainer}>
    {#if isCanvasMounted && webglSupported && !renderError}
      <Canvas>
        <Scene3D />
      </Canvas>
    {:else if !webglSupported}
      <!-- WebGL不支持时的降级背景 */
      <div class="hero-3d__fallback">
        <div class="hero-3d__fallback-pattern"></div>
      </div>
    {:else if renderError}
      <-- 渲染错误时的降级背景 -->
      <div class="hero-3d__fallback hero-3d__fallback--error">
        <div class="hero-3d__fallback-pattern"></div>
      </div>
    {/if}
  </div>
  
  <!-- 前景内容 -->
  <div class="hero-3d__content">
    <div class="hero-3d__text">
      <h1 class="hero-3d__title">{title}</h1>
      <p class="hero-3d__subtitle">{subtitle}</p>
    </div>
    
    <div class="hero-3d__actions">
      <Button
        text="查看项目"
        variant="primary"
        size="large"
        href="#projects"
      />
      <Button
        text="了解更多"
        variant="outline"
        size="large"
        href="#about-preview"
      />
    </div>
  </div>
</div>

<style>
  .hero-3d {
    /* 基础布局 */
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(
      135deg,
      var(--bg-primary) 0%,
      var(--bg-secondary) 100%
    );
  }
  
  /* 3D Canvas容器 */
  .hero-3d__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none; /* 允许点击穿透到内容层 */
  }
  
  /* Canvas全局样式 */
  .hero-3d__canvas :global(canvas) {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
  
  /* WebGL降级背景 */
  .hero-3d__fallback {
    width: 100%;
    height: 100%;
    position: relative;
    background: radial-gradient(
      ellipse at center,
      rgba(100, 255, 218, 0.1) 0%,
      rgba(17, 34, 64, 0.8) 50%,
      var(--bg-primary) 100%
    );
    overflow: hidden;
  }
  
  .hero-3d__fallback--error {
    background: radial-gradient(
      ellipse at center,
      rgba(248, 113, 113, 0.1) 0%,
      rgba(17, 34, 64, 0.8) 50%,
      var(--bg-primary) 100%
    );
  }
  
  /* 降级背景动画图案 */
  .hero-3d__fallback-pattern {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(100, 255, 218, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(100, 255, 218, 0.05) 1px, transparent 1px);
    background-size: 60px 60px, 40px 40px;
    animation: patternFloat 20s linear infinite;
    transform: translate(-50%, -50%);
  }
  
  @keyframes patternFloat {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
  
  /* 前景内容 */
  .hero-3d__content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    padding: 0 2rem;
    color: var(--text-primary);
  }
  
  /* 文本内容 */
  .hero-3d__text {
    margin-bottom: 3rem;
  }
  
  .hero-3d__title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.1;
    background: linear-gradient(
      135deg,
      var(--text-primary) 0%,
      var(--accent-color) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: titleGlow 3s ease-in-out infinite alternate;
  }
  
  @keyframes titleGlow {
    0% { text-shadow: 0 0 20px rgba(100, 255, 218, 0.3); }
    100% { text-shadow: 0 0 40px rgba(100, 255, 218, 0.6); }
  }
  
  .hero-3d__subtitle {
    font-size: clamp(1.125rem, 3vw, 1.5rem);
    margin: 0;
    opacity: 0.9;
    line-height: 1.4;
    font-weight: 300;
  }
  
  /* 操作按钮 */
  .hero-3d__actions {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .hero-3d__content {
      padding: 0 1rem;
    }
    
    .hero-3d__text {
      margin-bottom: 2rem;
    }
    
    .hero-3d__actions {
      gap: 1rem;
      flex-direction: column;
      align-items: center;
    }
    
    .hero-3d__actions :global(.btn) {
      width: 100%;
      max-width: 300px;
    }
  }
  
  @media (max-width: 480px) {
    .hero-3d {
      height: 100svh; /* 使用新的svh单位支持移动端 */
    }
    
    .hero-3d__content {
      padding: 0 1rem;
    }
  }
  
  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .hero-3d__title {
      background: none;
      -webkit-text-fill-color: var(--text-primary);
      color: var(--text-primary);
    }
    
    .hero-3d__fallback {
      background: var(--bg-primary);
    }
  }
  
  /* 减少动画模式 */
  @media (prefers-reduced-motion: reduce) {
    .hero-3d__title {
      animation: none;
    }
    
    .hero-3d__fallback-pattern {
      animation: none;
    }
  }
</style>
