<!--
  网站导航栏组件
  提供网站导航功能，支持响应式设计和移动端菜单
  
  Features:
  - 响应式设计
  - 移动端汉堡菜单
  - 平滑滚动导航
  - 活动状态指示
-->

<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { appStore, isMobileMenuOpen } from '../../stores/theme';
  import { APP_INFO, ROUTES } from '../../utils/constants';
  import { smoothScrollTo } from '../../utils/animation';
  
  /** 导航菜单项配置 */
  const navItems = [
    { label: '首页', href: ROUTES.HOME },
    // { label: '项目', href: ROUTES.PROJECTS },
    // { label: '关于', href: ROUTES.ABOUT },
  ];
  
  /** 切换移动端菜单 */
  function toggleMobileMenu() {
    appStore.toggleMobileMenu();
  }
  
  /** 关闭移动端菜单 */
  function closeMobileMenu() {
    appStore.closeMobileMenu();
  }
  
  /** 处理导航链接点击 */
  function handleNavClick(href: string, event: Event) {
    closeMobileMenu();
    
    // 如果是首页的锚点链接，使用平滑滚动
    if (href.startsWith('#') && $page.url.pathname === '/') {
      event.preventDefault();
      const targetId = href.substring(1);
      smoothScrollTo(targetId, 80); // 导航栏高度偏移
    }
  }
  
  /** 检查链接是否为当前活动页面 */
  function isActiveLink(href: string): boolean {
    if (href === ROUTES.HOME) {
      return $page.url.pathname === '/';
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<header class="navbar">
  <div class="navbar__container">
    <!-- Logo -->
    <div class="navbar__logo">
      <a 
        href={ROUTES.HOME} 
        class="navbar__logo-link"
        on:click={closeMobileMenu}
      >
        <span class="navbar__logo-text">{APP_INFO.name}</span>
      </a>
    </div>
    
    <!-- 桌面端导航菜单 -->
    <nav class="navbar__nav navbar__nav--desktop">
      <ul class="navbar__menu">
        {#each navItems as item}
          <li class="navbar__item">
            <a
              href={item.href}
              class="navbar__link"
              class:navbar__link--active={isActiveLink(item.href)}
              on:click={(e) => handleNavClick(item.href, e)}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    
    <!-- 移动端菜单按钮 -->
    <button
      class="navbar__toggle"
      class:navbar__toggle--active={$isMobileMenuOpen}
      on:click={toggleMobileMenu}
      aria-label="切换导航菜单"
      aria-expanded={$isMobileMenuOpen}
    >
      <span class="navbar__toggle-bar"></span>
      <span class="navbar__toggle-bar"></span>
      <span class="navbar__toggle-bar"></span>
    </button>
  </div>
  
  <!-- 移动端导航菜单 -->
  <nav
    class="navbar__nav navbar__nav--mobile"
    class:navbar__nav--mobile-open={$isMobileMenuOpen}
  >
    <ul class="navbar__menu navbar__menu--mobile">
      {#each navItems as item}
        <li class="navbar__item navbar__item--mobile">
          <a
            href={item.href}
            class="navbar__link navbar__link--mobile"
            class:navbar__link--active={isActiveLink(item.href)}
            on:click={(e) => handleNavClick(item.href, e)}
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style>
  .navbar {
    /* 基础样式 */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-index-navbar, 1000);
    background: rgba(10, 25, 47, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(100, 255, 218, 0.1);
    /* 确保没有其他边框 */
    border-top: none;
    border-left: none;
    border-right: none;
    transition: all 0.3s ease;
  }
  
  .navbar__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* Logo样式 */
  .navbar__logo {
    flex-shrink: 0;
  }
  
  .navbar__logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 700;
    font-size: 1.25rem;
    transition: color 0.3s ease;
  }
  
  .navbar__logo-link:hover {
    color: var(--accent-color);
  }
  
  
  /* 重写全局的 focus-visible 样式，移除不需要的边框 */
  .navbar__logo-link:focus-visible {
    outline: none;
    box-shadow: none;
    border-radius: 0;
  }
  
  .navbar__logo-text {
    background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* 桌面端导航 */
  .navbar__nav--desktop {
    display: flex;
  }
  
  .navbar__menu {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .navbar__item {
    position: relative;
  }
  
  .navbar__link {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .navbar__link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: width 0.3s ease;
  }
  
  .navbar__link:hover {
    color: var(--accent-color);
  }
  
  .navbar__link:hover::after,
  .navbar__link--active::after {
    width: 100%;
  }
  
  .navbar__link--active {
    color: var(--accent-color);
  }
  
  /* 移动端菜单切换按钮 */
  .navbar__toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  .navbar__toggle-bar {
    width: 1.5rem;
    height: 2px;
    background: var(--text-primary);
    transition: all 0.3s ease;
    transform-origin: center;
  }
  
  .navbar__toggle-bar:not(:last-child) {
    margin-bottom: 4px;
  }
  
  /* 菜单打开时的动画 */
  .navbar__toggle--active .navbar__toggle-bar:nth-child(1) {
    transform: rotate(45deg) translate(3px, 3px);
  }
  
  .navbar__toggle--active .navbar__toggle-bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  
  .navbar__toggle--active .navbar__toggle-bar:nth-child(3) {
    transform: rotate(-45deg) translate(3px, -3px);
  }
  
  /* 移动端导航菜单 */
  .navbar__nav--mobile {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(10, 25, 47, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(100, 255, 218, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: none;
  }
  
  .navbar__nav--mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .navbar__menu--mobile {
    flex-direction: column;
    gap: 0;
    padding: 1rem 0;
  }
  
  .navbar__item--mobile {
    width: 100%;
  }
  
  .navbar__link--mobile {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(100, 255, 218, 0.1);
  }
  
  .navbar__link--mobile:last-child {
    border-bottom: none;
  }
  
  .navbar__link--mobile::after {
    display: none;
  }
  
  .navbar__link--mobile:hover,
  .navbar__link--mobile.navbar__link--active {
    background: rgba(100, 255, 218, 0.1);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .navbar__container {
      padding: 0 1rem;
      height: 60px;
    }
    
    .navbar__nav--desktop {
      display: none;
    }
    
    .navbar__toggle {
      display: flex;
    }
    
    .navbar__nav--mobile {
      display: block;
    }
    
    .navbar__logo-text {
      font-size: 1.1rem;
    }
  }
  
  /* 滚动时的样式变化 */
  @media (min-width: 769px) {
    .navbar:hover {
      background: rgba(10, 25, 47, 0.95);
    }
  }
  
  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .navbar {
      background: var(--bg-primary);
      border-bottom-color: var(--accent-color);
    }
    
    .navbar__logo-text {
      background: none;
      -webkit-text-fill-color: var(--text-primary);
      text-shadow: none;
    }
    
  }
  
  /* 减少动画模式 */
  @media (prefers-reduced-motion: reduce) {
    .navbar,
    .navbar__link,
    .navbar__link::after,
    .navbar__toggle-bar,
    .navbar__nav--mobile {
      transition: none;
    }
  }
</style>
