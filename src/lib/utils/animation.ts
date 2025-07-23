/**
 * 动画工具函数
 * 提供通用的动画效果功能
 */

import type { AnimationConfig } from '../types';
import { ANIMATIONS } from './constants';

/**
 * 创建淡入动画
 * @param element - 目标元素
 * @param config - 动画配置
 */
export function fadeIn(element: HTMLElement, config: Partial<AnimationConfig> = {}): Animation {
  const {
    duration = ANIMATIONS.duration.normal,
    delay = 0,
    easing = ANIMATIONS.easing.easeOut,
  } = config;

  return element.animate(
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    {
      duration,
      delay,
      easing,
      fill: 'forwards',
    }
  );
}

/**
 * 创建淡出动画
 * @param element - 目标元素
 * @param config - 动画配置
 */
export function fadeOut(element: HTMLElement, config: Partial<AnimationConfig> = {}): Animation {
  const {
    duration = ANIMATIONS.duration.normal,
    delay = 0,
    easing = ANIMATIONS.easing.easeIn,
  } = config;

  return element.animate(
    [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-20px)' },
    ],
    {
      duration,
      delay,
      easing,
      fill: 'forwards',
    }
  );
}

/**
 * 创建缩放动画
 * @param element - 目标元素
 * @param config - 动画配置
 */
export function scaleIn(element: HTMLElement, config: Partial<AnimationConfig> = {}): Animation {
  const {
    duration = ANIMATIONS.duration.normal,
    delay = 0,
    easing = ANIMATIONS.easing.bounce,
  } = config;

  return element.animate(
    [
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
    {
      duration,
      delay,
      easing,
      fill: 'forwards',
    }
  );
}

/**
 * 创建滑入动画
 * @param element - 目标元素
 * @param direction - 滑入方向
 * @param config - 动画配置
 */
export function slideIn(
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  config: Partial<AnimationConfig> = {}
): Animation {
  const {
    duration = ANIMATIONS.duration.normal,
    delay = 0,
    easing = ANIMATIONS.easing.easeOut,
  } = config;

  const getTransforms = () => {
    switch (direction) {
      case 'left':
        return ['translateX(-100%)', 'translateX(0)'];
      case 'right':
        return ['translateX(100%)', 'translateX(0)'];
      case 'up':
        return ['translateY(100%)', 'translateY(0)'];
      case 'down':
        return ['translateY(-100%)', 'translateY(0)'];
      default:
        return ['translateY(20px)', 'translateY(0)'];
    }
  };

  const [start, end] = getTransforms();

  return element.animate(
    [
      { opacity: 0, transform: start },
      { opacity: 1, transform: end },
    ],
    {
      duration,
      delay,
      easing,
      fill: 'forwards',
    }
  );
}

/**
 * 创建弹跳动画效果
 * @param element - 目标元素
 * @param config - 动画配置
 */
export function bounceIn(element: HTMLElement, config: Partial<AnimationConfig> = {}): Animation {
  const {
    duration = ANIMATIONS.duration.slow,
    delay = 0,
  } = config;

  return element.animate(
    [
      { opacity: 0, transform: 'scale(0.3)' },
      { opacity: 1, transform: 'scale(1.05)' },
      { opacity: 1, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
    {
      duration,
      delay,
      easing: 'ease-out',
      fill: 'forwards',
    }
  );
}

/**
 * 创建视差滚动效果
 * @param element - 目标元素
 * @param speed - 视差速度 (0-1之间，1为正常速度)
 */
export function parallaxScroll(element: HTMLElement, speed: number = 0.5): () => void {
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -speed;
    element.style.transform = `translateY(${rate}px)`;
  };

  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * 创建交互观察器，用于元素进入视口时触发动画
 * @param elements - 目标元素数组
 * @param callback - 元素进入视口时的回调函数
 * @param options - IntersectionObserver选项
 */
export function createIntersectionObserver(
  elements: HTMLElement[],
  callback: (element: HTMLElement, entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target as HTMLElement, entry);
      }
    });
  }, defaultOptions);

  elements.forEach((element) => {
    observer.observe(element);
  });

  return observer;
}

/**
 * 创建平滑滚动到指定元素
 * @param targetId - 目标元素ID
 * @param offset - 滚动偏移量
 * @param duration - 滚动动画时长
 */
export function smoothScrollTo(
  targetId: string,
  offset: number = 0,
  duration: number = ANIMATIONS.duration.slow
): void {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  // 缓动函数
  function easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

/**
 * 防抖函数 - 延迟执行函数，避免频繁调用
 * @param func - 要防抖的函数
 * @param delay - 延迟时间(ms)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

/**
 * 节流函数 - 限制函数调用频率
 * @param func - 要节流的函数
 * @param delay - 节流时间间隔(ms)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
}
