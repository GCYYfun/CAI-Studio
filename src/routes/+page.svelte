<!--
  首页组件
  展示网站主页内容，包括3D英雄区域、功能特色、项目展示和团队介绍
  
  Features:
  - 3D英雄区域
  - 功能特色展示
  - 项目预览网格
  - 团队简介
  - 平滑滚动动画
-->

<script lang="ts">
  import { onMount } from 'svelte';
  
  // 导入组件
  import Hero3D from '$lib/components/three/Hero3D.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  
  // 导入工具和常量
  import { createIntersectionObserver, fadeIn } from '$lib/utils/animation';
  import { ROUTES } from '$lib/utils/constants';
  import type { Feature, Project } from '$lib/types';
  
  /** 功能特色数据 */
  const features: Feature[] = [
    {
      title: '一个充满交互的世界',
      description: '通过AI技术实现与环境的自然互动，提升游戏沉浸感。',
      icon: '🌍'
    },
    {
      title: '一些自主的NPC',
      description: '利用AI技术赋予NPC自主行为和情感反应，让游戏世界生动真实。',
      icon: '🤖'
    },
    {
      title: '一个Agent框架和协议',
      description: '提供灵活的Agent框架和标准的通信协议，支持多种游戏玩法和交互方式和不同系统间的协作。',
      icon: '🛠️'
    }

  ];
  
  /** 精选项目数据 */
  const featuredProjects: Project[] = [
    {
      id: 'LingyunYuanjing',
      name: '灵韵元境',
      description: '探索一个硅基生命与玩家共同生存的世界。世界时刻都在NPC的活动下发展，玩家在其中自由书写自己的故事，体验无限的可能性。',
      image: '/images/waiting.svg',
      tags: ['奇幻', 'RPG', '生存', '探索', '建造', "经营", "AI"],
      status: 'developing',
      releaseDate: '未发布'
    },
    // {
    //   id: 'fantasy-guardian',
    //   name: '幻境守护者',
    //   description: '穿梭于现实与幻境，保护世界的平衡。体验魔法与现实交织的奇妙冒险。',
    //   image: '/images/project2.svg',
    //   tags: ['奇幻', '动作', '魔法'],
    //   status: 'developing',
    // },
    // {
    //   id: 'mecha-chronicles',
    //   name: '机甲战纪',
    //   description: '驾驶定制机甲，参与史诗级战役。在未来战场上书写属于你的传奇。',
    //   image: '/images/project3.svg',
    //   tags: ['机甲', '战斗', '策略'],
    //   status: 'planning',
    // }
  ];
  
  /** 可见性状态 */
  let sectionVisibility = $state({
    features: false,
    projects: false,
    about: false
  });
  
  /** 组件挂载后设置动画 */
  onMount(() => {
    // 设置区域进入动画观察器
    const sections = document.querySelectorAll('[data-section]');
    
    createIntersectionObserver(
      Array.from(sections) as HTMLElement[],
      (element) => {
        const sectionName = element.getAttribute('data-section');
        if (sectionName && sectionName in sectionVisibility) {
          sectionVisibility[sectionName as keyof typeof sectionVisibility] = true;
        }
      },
      { threshold: 0.2 }
    );
  });
  
  /** 获取项目状态显示文本 */
  function getProjectStatusText(status: Project['status']): string {
    switch (status) {
      case 'completed': return '已发布';
      case 'developing': return '开发中';
      case 'planning': return '规划中';
      default: return '';
    }
  }
  
  /** 获取项目状态样式类 */
  function getProjectStatusClass(status: Project['status']): string {
    switch (status) {
      case 'completed': return 'project-status--completed';
      case 'developing': return 'project-status--developing';
      case 'planning': return 'project-status--planning';
      default: return '';
    }
  }
</script>

<svelte:head>
  <title>CAI Game Studio - 搞点有趣的东西</title>
  <meta name="description" content="CAI Game Studio是一家专注于创新游戏开发的工作室，致力于打造沉浸式的游戏体验，创造令人难忘的虚拟世界。" />
  <meta name="keywords" content="游戏开发,游戏工作室,独立游戏,3D游戏,游戏设计" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="CAI Game Studio - 搞点有趣的东西" />
  <meta property="og:description" content="专注于创新游戏开发的工作室，致力于打造沉浸式的游戏体验。" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://caistudio.com" />
  <meta property="og:image" content="/images/og-image.jpg" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CAI Game Studio" />
  <meta name="twitter:description" content="搞点有趣的东西" />
  <meta name="twitter:image" content="/images/twitter-image.jpg" />
</svelte:head>

<!-- 3D英雄区域 -->
<Hero3D />

<!-- 功能特色区域 -->
<Section 
  id="features" 
  background="secondary" 
  data-section="features"
>
  <div class="section-header">
    <h2 class="section-title">我们做了点什么</h2>
    <p class="section-subtitle">
      我们将AI与创意结合，带来新的游戏体验
    </p>
  </div>
  
  <div class="features-grid">
    {#each features as feature, index}
      <Card 
        hoverable={true}
        className="feature-card {sectionVisibility.features ? 'feature-card--visible' : ''}"
        style="animation-delay: {index * 0.1}s"
      >
        <div class="feature-icon">{feature.icon}</div>
        <h3 class="feature-title">{feature.title}</h3>
        <p class="feature-description">{feature.description}</p>
      </Card>
    {/each}
  </div>
</Section>

<!-- 精选项目区域 -->
<Section 
  id="projects" 
  background="primary"
  data-section="projects"
>
  <div class="section-header">
    <h2 class="section-title">我们的项目</h2>
    <p class="section-subtitle">
      探索我们最新的游戏作品，每一个项目都承载着我们的创意与热情
    </p>
  </div>
  
  <div class="projects-grid">
    {#each featuredProjects as project, index}
      <a href="/projects/{project.id}" class="project-link">
        <Card 
          hoverable={true}
          className="project-card {sectionVisibility.projects ? 'project-card--visible' : ''}"
          style="animation-delay: {index * 0.15}s"
        >
          <div class="project-image" style="background-image: url('{project.image}')">
            <div class="project-status {getProjectStatusClass(project.status)}">
              {getProjectStatusText(project.status)}
            </div>
          </div>
          
          <div class="project-content">
            <h3 class="project-title">{project.name}</h3>
            <p class="project-description">{project.description}</p>
            
            <div class="project-tags">
              {#each project.tags as tag}
                <span class="project-tag">{tag}</span>
              {/each}
            </div>
            
            {#if project.releaseDate}
              <p class="project-release">发布时间: {project.releaseDate}</p>
            {/if}
          </div>
        </Card>
      </a>
    {/each}
  </div>
  
  <div class="section-cta">
    <!-- <Button
      text="查看更多项目"
      variant="primary"
      size="large"
      href={ROUTES.PROJECTS}
    /> -->
  </div>
</Section>

<!-- 关于我们区域 -->
<Section 
  id="about-preview" 
  background="secondary"
  data-section="about"
>
  <div class="about-content {sectionVisibility.about ? 'about-content--visible' : ''}">
    <div class="about-text">
      <h2 class="section-title">关于我们</h2>
      <p class="about-description">
        CAI Game Studio 是一家由热爱游戏的创作者组成的独立工作室。我们致力于打造高自由度、富有创意的AI游戏体验，
        将前沿技术与独特的艺术视角相结合，创造令人难忘的虚拟世界。
      </p>
      <p class="about-description">
        我们喜爱游戏，认为游戏作为一种艺术形式，能够传达情感、启发思考、连接人心。
        每一个项目都是我们对这一理念的实践与探索。
      </p>
      
      <div class="about-actions">
        <!-- <Button
          text="了解我们的团队"
          variant="outline"
          size="large"
          href={ROUTES.ABOUT}
        /> -->
        <!-- 联系我们按钮暂时注释，改为直接显示邮箱 -->
        <Button
          text="联系我们"
          variant="ghost"
          size="large"
          href="mailto:em_lingyunyuanjing@163.com"
        />
      </div>
    </div>
    
    <div class="about-visual">
      <div class="about-logo">
        <h1 class="logo-text">CAI</h1>
        <p class="logo-subtitle">Creative AI Interactive</p>
      </div>
    </div>
  </div>
</Section>

<style>
  /* 区域头部样式 */
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .section-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  .section-cta {
    text-align: center;
    margin-top: 3rem;
  }
  
  /* 功能特色样式 */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .feature-card--visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 10px rgba(100, 255, 218, 0.3));
  }
  
  .feature-title {
    color: var(--accent-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .feature-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0;
  }
  
  /* 项目展示样式 */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
  }
  
  .project-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform 0.3s ease;
  }
  
  .project-link:hover {
    transform: translateY(-5px);
  }
  
  .project-card {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;
    overflow: hidden;
  }
  
  .project-card--visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .project-image {
    height: 220px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }
  
  .project-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 60%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
  
  .project-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    z-index: 2;
  }
  
  .project-status--completed {
    background: rgba(74, 222, 128, 0.9);
    color: var(--bg-primary);
  }
  
  .project-status--developing {
    background: rgba(251, 191, 36, 0.9);
    color: var(--bg-primary);
  }
  
  .project-status--planning {
    background: rgba(100, 255, 218, 0.9);
    color: var(--bg-primary);
  }
  
  .project-content {
    padding: 0;
  }
  
  .project-title {
    color: var(--accent-color);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .project-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .project-tag {
    background: rgba(100, 255, 218, 0.15);
    color: var(--accent-color);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid rgba(100, 255, 218, 0.3);
  }
  
  .project-release {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
    font-style: italic;
  }
  
  /* 关于我们样式 */
  .about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: center;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }
  
  .about-content--visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .about-description {
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  
  .about-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  
  .about-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .logo-text {
    font-size: clamp(4rem, 8vw, 6rem);
    font-weight: 900;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    transition: transform 0.3s ease;
  }
  
  .logo-text:hover {
    transform: scale(1.05);
  }
  
  .logo-subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    opacity: 0.8;
  }
  
  /* 响应式设计 */
  @media (max-width: 1024px) {
    .about-content {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
    
    .logo-text {
      font-size: clamp(3.5rem, 8vw, 5rem);
    }
  }
  
  @media (max-width: 768px) {
    .section-header {
      margin-bottom: 3rem;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .projects-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .about-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .about-actions :global(.btn) {
      width: 100%;
      max-width: 300px;
    }
    
    .logo-text {
      font-size: clamp(3rem, 8vw, 4rem);
    }
  }
  
  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .section-title {
      background: none;
      -webkit-text-fill-color: var(--text-primary);
      color: var(--text-primary);
    }
    
    .feature-icon {
      filter: none;
    }
    
    .project-tag {
      background: var(--bg-secondary);
      border-color: var(--accent-color);
    }
  }
  
  /* 减少动画模式 */
  @media (prefers-reduced-motion: reduce) {
    .feature-card,
    .project-card,
    .about-content {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
