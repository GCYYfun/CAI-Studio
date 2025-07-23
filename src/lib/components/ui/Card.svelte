<!--
  通用卡片组件
  用于包装内容，提供统一的卡片样式
  
  Props:
  - title: 卡片标题
  - description: 卡片描述
  - hoverable: 是否启用悬停效果
  - bordered: 是否显示边框
  - className: 自定义CSS类名
  
  Slots:
  - default: 卡片主体内容
  - header: 卡片头部内容（会覆盖title和description）
  - footer: 卡片底部内容
-->

<script lang="ts">
  import type { CardProps } from '../../types';
  
  /** 卡片属性 */
  let {
    title,
    description,
    hoverable = false,
    bordered = true,
    className = '',
    style = '',
    children,
    ...restProps
  }: CardProps & { children?: any; style?: string } = $props();
  
  /** 计算卡片的CSS类名 */
  const cardClasses = $derived([
    'card',
    hoverable && 'card--hoverable',
    bordered && 'card--bordered',
    className
  ].filter(Boolean).join(' '));
</script>

<div
  class={cardClasses}
  {style}
  {...restProps}
>
  <!-- 卡片头部 -->
  {#if title || description}
    <div class="card__header">
      {#if title}
        <h3 class="card__title">{title}</h3>
      {/if}
      {#if description}
        <p class="card__description">{description}</p>
      {/if}
    </div>
  {/if}
  
  <!-- 卡片主体内容 -->
  <div class="card__body">
    {@render children?.()}
  </div>
</div>

<style>
  .card {
    /* 基础样式 */
    background-color: rgba(17, 34, 64, 0.8);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease-in-out;
    position: relative;
    overflow: hidden;
  }
  
  /* 边框样式 */
  .card--bordered {
    border: 1px solid var(--border-color);
  }
  
  /* 悬停效果 */
  .card--hoverable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(100, 255, 218, 0.1);
      
      &::before {
        opacity: 1;
      }
    }
    
    /* 悬停时的光泽效果 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(100, 255, 218, 0.1),
        transparent
      );
      transition: all 0.6s ease;
      opacity: 0;
    }
    
    &:hover::before {
      left: 100%;
      opacity: 1;
    }
  }
  
  /* 卡片头部 */
  .card__header {
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }
  
  .card__title {
    color: var(--accent-color);
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }
  
  .card__description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }
  
  /* 卡片主体 */
  .card__body {
    position: relative;
    z-index: 1;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .card {
      padding: 1.25rem;
      border-radius: 8px;
    }
    
    .card__title {
      font-size: 1.125rem;
    }
    
    /* 移动端减少悬停效果的位移 */
    .card--hoverable:hover {
      transform: translateY(-4px);
    }
  }
  
  /* 无障碍设计 */
  @media (prefers-reduced-motion: reduce) {
    .card,
    .card--hoverable,
    .card::before {
      transition: none;
    }
    
    .card--hoverable:hover {
      transform: none;
    }
  }
  
  /* 高对比度模式支持 */
  @media (prefers-contrast: high) {
    .card--bordered {
      border-width: 2px;
      border-color: var(--accent-color);
    }
    
    .card__title {
      color: var(--text-primary);
      font-weight: 700;
    }
  }
</style>
