<script>
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import { onMount, onDestroy, tick } from 'svelte';

  let mounted = false;
  let canvasError = false;
  let canvasContainerElement;
  let canvasElement = null;
  let forceRenderKey = 0; 
  let renderStartTime = Date.now();

  // 检查WebGL支持
  function checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch (e) {
      console.error('WebGL检查失败:', e);
      return false;
    }
  }

  onMount(async () => {
    console.log('Hero3D 组件开始挂载');
    
    // 首先检查WebGL支持
    if (!checkWebGLSupport()) {
      console.error('WebGL不被支持!');
      canvasError = true;
      return;
    }
    
    // 等待下一个tick确保DOM已更新
    await tick();
    
    // 立即挂载以避免延迟问题
    mounted = true;
    renderStartTime = Date.now();
    console.log('Hero3D 组件已挂载', new Date().toISOString());
    
    // 添加一个定时器，检查Canvas状态
    const checkInterval = setInterval(() => {
      if (!canvasContainerElement) return;
      
      const canvas = canvasContainerElement.querySelector('canvas');
      if (canvas) {
        canvasElement = canvas;
        // 确保canvas可见
        canvas.style.opacity = '1';
        canvas.style.visibility = 'visible';
        canvas.style.display = 'block';
      }
    }, 2000); // 降低检查频率，减少性能开销
    
    return () => {
      console.log('Hero3D 组件将被卸载');
      clearInterval(checkInterval);
    };
  });

  function forceRerenderCanvas() {
    console.log('强制重新渲染Canvas');
    mounted = false;
    setTimeout(() => {
      forceRenderKey++;
      mounted = true;
      renderStartTime = Date.now();
      
      // 触发自定义事件通知Scene组件重新开始渲染
      const event = new CustomEvent('force-rerender', {
        detail: { timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    }, 100);
  }

  function handleCanvasError(e) {
    console.error('Canvas 渲染错误:', e);
    canvasError = true;
    // 出错后尝试一次重新渲染
    setTimeout(forceRerenderCanvas, 1000);
  }
</script>

<div class="hero-container">
  <div class="canvas-container" bind:this={canvasContainerElement}>
    {#if mounted}
      <div class="canvas-wrapper" data-key={forceRenderKey}>
        <Canvas on:error={handleCanvasError}>
          <Scene />
        </Canvas>
      </div>
    {/if}
    
    {#if canvasError}
      <div class="canvas-error">
        3D 渲染初始化失败，请刷新页面或尝试使用其他浏览器。
      </div>
    {/if}
  </div>
  
  <div class="hero-content">
    <h1>CAI Game Studio</h1>
    <p>打造前沿的游戏体验</p>
    <div class="cta-buttons">
      <a href="/projects" class="button primary">查看项目</a>
      <a href="/about" class="button secondary">了解更多</a>
    </div>
  </div>
</div>

<style>
  /* 使用!important强制应用关键样式 */
  .hero-container {
    position: relative;
    height: 100vh;
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    color: white;
    overflow: hidden;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .canvas-container {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: none; /* 允许点击穿透到下层内容 */
  }
  
  /* 使用:global确保样式被应用到动态生成的元素 */
  :global(.canvas-wrapper) {
    width: 100% !important;
    height: 100% !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  :global(.canvas-wrapper canvas) {
    width: 100% !important;
    height: 100% !important;
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
  }
  
  .hero-content {
    text-align: center;
    z-index: 1;
    max-width: 800px;
    padding: 0 2rem;
  }
  
  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.8;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .button {
    padding: 0.8rem 2rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .primary {
    background: #64ffda;
    color: #0a192f;
  }
  
  .secondary {
    border: 2px solid #64ffda;
    color: #64ffda;
  }
  
  .button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .canvas-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 25, 47, 0.8);
    color: #ff6464;
    text-align: center;
    padding: 2rem;
    z-index: 10; /* 确保错误信息在最上层 */
  }
</style>
