<!--
  通用按钮组件
  支持多种样式变体、尺寸和状态
  
  Props:
  - text: 按钮文本
  - variant: 按钮样式变体 ('primary' | 'secondary' | 'outline' | 'ghost')
  - size: 按钮尺寸 ('small' | 'medium' | 'large') 
  - disabled: 是否禁用
  - loading: 是否显示加载状态
  - href: 链接地址（会渲染为a标签）
  - className: 自定义CSS类名
  
  Events:
  - click: 点击事件
-->

<script lang="ts">
  import type { ButtonProps } from '../../types';
  
  /** 按钮属性 */
  let {
    text,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    href,
    className = '',
    onClick,
    ...restProps
  }: ButtonProps = $props();
  
  /** 计算按钮的CSS类名 */
  const buttonClasses = $derived([
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    className
  ].filter(Boolean).join(' '));
  
  /** 处理点击事件 */
  function handleClick() {
    if (disabled || loading) return;
    onClick?.();
  }
</script>

<!-- 根据是否有href决定渲染button还是a标签 -->
{#if href}
  <a
    {href}
    class={buttonClasses}
    class:disabled
    aria-disabled={disabled}
    tabindex={disabled ? -1 : 0}
    {...restProps}
  >
    {#if loading}
      <span class="btn__loading" aria-hidden="true"></span>
    {/if}
    <span class="btn__text">{text}</span>
  </a>
{:else}
  <button
    type="button"
    class={buttonClasses}
    {disabled}
    aria-disabled={disabled}
    onclick={handleClick}
    {...restProps}
  >
    {#if loading}
      <span class="btn__loading" aria-hidden="true"></span>
    {/if}
    <span class="btn__text">{text}</span>
  </button>
{/if}

<style>
  .btn {
    /* 基础样式 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: 6px;
    font-family: inherit;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    user-select: none;
    
    /* 焦点样式 */
    &:focus-visible {
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }
  }
  
  /* 尺寸变体 */
  .btn--small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-height: 2rem;
  }
  
  .btn--medium {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 2.5rem;
  }
  
  .btn--large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    min-height: 3rem;
  }
  
  /* 样式变体 */
  .btn--primary {
    background-color: var(--accent-color);
    color: var(--bg-primary);
    
    &:hover:not(.btn--disabled):not(.btn--loading) {
      background-color: color-mix(in srgb, var(--accent-color) 90%, white);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(100, 255, 218, 0.3);
    }
    
    &:active:not(.btn--disabled):not(.btn--loading) {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(100, 255, 218, 0.2);
    }
  }
  
  .btn--secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover:not(.btn--disabled):not(.btn--loading) {
      background-color: color-mix(in srgb, var(--bg-secondary) 80%, white);
      border-color: var(--accent-color);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    &:active:not(.btn--disabled):not(.btn--loading) {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }
  
  .btn--outline {
    background-color: transparent;
    color: var(--accent-color);
    border: 2px solid var(--accent-color);
    
    &:hover:not(.btn--disabled):not(.btn--loading) {
      background-color: var(--accent-color);
      color: var(--bg-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(100, 255, 218, 0.3);
    }
    
    &:active:not(.btn--disabled):not(.btn--loading) {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(100, 255, 218, 0.2);
    }
  }
  
  .btn--ghost {
    background-color: transparent;
    color: var(--text-primary);
    border: none;
    
    &:hover:not(.btn--disabled):not(.btn--loading) {
      background-color: color-mix(in srgb, var(--accent-color) 10%, transparent);
      color: var(--accent-color);
      transform: translateY(-2px);
    }
    
    &:active:not(.btn--disabled):not(.btn--loading) {
      transform: translateY(0);
    }
  }
  
  /* 状态样式 */
  .btn--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .btn--loading {
    cursor: wait;
    pointer-events: none;
    
    .btn__text {
      opacity: 0.7;
    }
  }
  
  /* 加载动画 */
  .btn__loading {
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .btn--large {
      padding: 0.875rem 1.75rem;
      font-size: 1rem;
      min-height: 2.75rem;
    }
    
    .btn--medium {
      padding: 0.625rem 1.25rem;
      font-size: 0.9375rem;
      min-height: 2.25rem;
    }
  }
</style>
