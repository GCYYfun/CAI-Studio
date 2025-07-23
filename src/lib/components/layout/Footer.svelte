<!--
  网站页脚组件
  展示公司信息、社交链接和版权声明
  
  Features:
  - 公司信息展示
  - 社交媒体链接
  - 版权信息
  - 响应式布局
-->

<script lang="ts">
  import { APP_INFO, CONTACT_INFO, ROUTES } from '../../utils/constants';
  
  /** 获取当前年份 */
  const currentYear = new Date().getFullYear();
  
  /** 快速链接配置 */
  const quickLinks = [
    { label: '首页', href: ROUTES.HOME },
    // { label: '项目', href: ROUTES.PROJECTS },
    // { label: '关于我们', href: ROUTES.ABOUT },
  ];
  
  /** 社交媒体链接配置 */
  const socialLinks = [
    { 
      label: 'GitHub', 
      href: CONTACT_INFO.social.github,
      icon: 'github'
    },
    { 
      label: 'Bilibili', 
      href: CONTACT_INFO.social.bilibili,
      icon: 'bilibili'
    }
  ];
</script>

<footer class="footer">
  <div class="footer__container">
    <!-- 主要内容区域 -->
    <div class="footer__content">
      <!-- 公司信息 -->
      <div class="footer__section footer__section--company">
        <div class="footer__logo">
          <span class="footer__logo-text">{APP_INFO.name}</span>
        </div>
        <p class="footer__description">
          {APP_INFO.description}
        </p>
        <!-- <div class="footer__contact">
          <p class="footer__contact-item">
            <span class="footer__contact-label">邮箱:</span>
            <a href="mailto:{CONTACT_INFO.email}" class="footer__contact-link">
              {CONTACT_INFO.email}
            </a>
          </p>
        </div> -->
      </div>
      
      <!-- 快速链接 -->
      <div class="footer__section footer__section--links">
        <h4 class="footer__section-title">快速链接</h4>
        <nav class="footer__nav">
          <ul class="footer__nav-list">
            {#each quickLinks as link}
              <li class="footer__nav-item">
                <a href={link.href} class="footer__nav-link">
                  {link.label}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      </div>
      
      <!-- 社交媒体 -->
      <div class="footer__section footer__section--social">
        <h4 class="footer__section-title">关注我们</h4>
        <div class="footer__social">
          {#each socialLinks as social}
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              class="footer__social-link"
              aria-label={social.label}
            >
              <img 
                src="/images/{social.icon}.svg" 
                alt={social.label}
                class="footer__social-icon"
              />
            </a>
          {/each}
        </div>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="footer__bottom">
      <div class="footer__copyright">
        <p class="footer__copyright-text">
          © {currentYear} {APP_INFO.name}. 保留所有权利。
        </p>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    /* 基础样式 */
    background: linear-gradient(
      135deg,
      var(--bg-primary) 0%,
      var(--bg-secondary) 100%
    );
    color: var(--text-primary);
    padding: 4rem 0 1rem;
    border-top: 1px solid rgba(100, 255, 218, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  /* 背景装饰 */
  .footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--accent-color),
      transparent
    );
    transform: translateX(-50%);
    opacity: 0.6;
  }
  
  .footer__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  /* 主要内容区域 */
  .footer__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .footer__section {
    display: flex;
    flex-direction: column;
  }
  
  /* 公司信息区域 */
  .footer__section--company {
    grid-column: span 1;
  }
  
  .footer__logo {
    margin-bottom: 1rem;
  }
  
  .footer__logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .footer__description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  /* 
  .footer__contact {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .footer__contact-item {
    margin: 0;
    font-size: 0.9rem;
  }
  
  .footer__contact-label {
    color: var(--accent-color);
    font-weight: 600;
    margin-right: 0.5rem;
  }
  
  .footer__contact-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer__contact-link:hover {
    color: var(--accent-color);
  } 
  */
  
  /* 区域标题 */
  .footer__section-title {
    color: var(--accent-color);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    position: relative;
  }
  
  .footer__section-title::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 2rem;
    height: 2px;
    background: var(--accent-color);
    opacity: 0.6;
  }
  
  /* 导航链接 */
  .footer__nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer__nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    position: relative;
    padding-left: 1rem;
  }
  
  .footer__nav-link::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--accent-color);
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }
  
  .footer__nav-link:hover {
    color: var(--accent-color);
    padding-left: 1.5rem;
  }
  
  .footer__nav-link:hover::before {
    opacity: 1;
    transform: translateX(0);
  }
  
  /* 社交媒体链接 */
  .footer__social {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .footer__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(100, 255, 218, 0.1);
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .footer__social-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(100, 255, 218, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  .footer__social-link:hover {
    background: rgba(100, 255, 218, 0.2);
    color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(100, 255, 218, 0.15);
  }
  
  .footer__social-link:hover::before {
    left: 100%;
  }
  
  .footer__social-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: all 0.3s ease;
    filter: brightness(0.7);
  }
  
  .footer__social-link:hover .footer__social-icon {
    filter: brightness(1) drop-shadow(0 0 8px rgba(100, 255, 218, 0.6));
    transform: scale(1.1);
  }
  
  /* 版权区域 */
  .footer__bottom {
    padding-top: 2rem;
    border-top: 1px solid rgba(100, 255, 218, 0.1);
    text-align: center;
  }
  
  .footer__copyright-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin: 0;
    opacity: 0.8;
  }
  
  /* 响应式设计 */
  @media (max-width: 1024px) {
    .footer__content {
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
    }
    
    .footer__section--company {
      grid-column: span 2;
    }
  }
  
  @media (max-width: 768px) {
    .footer {
      padding: 3rem 0 1rem;
    }
    
    .footer__container {
      padding: 0 1rem;
    }
    
    .footer__content {
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .footer__section--company {
      grid-column: span 1;
    }
    
    .footer__social {
      justify-content: center;
    }
    
    .footer__nav-list {
      align-items: center;
    }
  }
  
  @media (max-width: 480px) {
    .footer__social-link {
      width: 2.25rem;
      height: 2.25rem;
    }
    
    .footer__social-icon {
      width: 1.125rem;
      height: 1.125rem;
    }
  }
  
  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .footer {
      background: var(--bg-primary);
      border-top-color: var(--accent-color);
    }
    
    .footer__logo-text {
      background: none;
      -webkit-text-fill-color: var(--text-primary);
      color: var(--text-primary);
    }
    
    .footer__social-link {
      border: 1px solid var(--accent-color);
    }
  }
  
  /* 减少动画模式 */
  @media (prefers-reduced-motion: reduce) {
    .footer__nav-link,
    .footer__nav-link::before,
    .footer__social-link,
    .footer__social-link::before {
      transition: none;
    }
    
    .footer__social-link:hover {
      transform: none;
    }
  }
</style>
