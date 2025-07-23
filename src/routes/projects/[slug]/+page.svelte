<!--
  项目详情页面
  展示单个项目的详细信息
-->

<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  
  interface ProjectDetail {
    id: string;
    name: string;
    description: string;
    image: string;
    tags: string[];
    status: string;
    releaseDate: string;
    detailedDescription: string;
    features: string[];
    screenshots: string[];
    videos: {
      title: string;
      platform: 'youtube' | 'bilibili';
      url: string;
      thumbnail?: string;
    }[];
    technicalSpecs: {
      platform: string[];
      engine: string;
      multiplayer: string;
      language: string[];
    };
  }
  
  // 项目数据 - 实际项目中应该从API或数据库获取
  const projectData: Record<string, ProjectDetail> = {
    'Lingyun Yuanjing': {
      id: 'Lingyun Yuanjing',
      name: '灵韵元境',
      description: '探索一个硅基生命与玩家共同生存的世界。世界时刻都在NPC的活动下发展，玩家在其中自由书写自己的故事，体验无限的可能性。',
      image: '/images/project1.svg',
      tags: ['奇幻', 'RPG', '生存', '探索', '建造', "经营", "AI"],
      status: 'developing',
      releaseDate: '未发布',
      detailedDescription: `
        《灵韵元境》是一款融合了AI技术的开放世界RPG游戏。在这个充满奇幻色彩的世界中，玩家将与拥有自主意识的硅基生命体共同生活、探索和成长。

        游戏的核心创新在于其动态的世界系统。每个NPC都拥有独立的AI，他们会根据环境变化、玩家行为和其他NPC的互动来做出决策。这意味着即使在玩家离线时，游戏世界依然在持续发展和变化。

        玩家可以选择多种发展路径：成为一名冒险家探索未知领域，建立自己的家园和商业帝国，或者深入研究硅基生命的奥秘。每一个选择都会对世界产生深远的影响，创造出独一无二的游戏体验。
      `,
      features: [
        '动态世界系统：AI驱动的NPC生态',
        '无限可能的故事线：每个玩家的体验都是独特的',
        '深度建造系统：从简单住所到复杂城市',
        '智能交互：与AI角色进行真实对话',
        '协作与竞争：多玩家共享的持续世界'
      ],
      screenshots: [
        '/images/project1.svg',
        '/images/project1.svg',
        '/images/project1.svg'
      ],
      videos: [
        {
          title: '灵韵元境 - 做饭',
          platform: 'bilibili',
          url: 'https://www.bilibili.com/video/BV1cDg3z5ELq',
          thumbnail: '/images/project1.svg'
        },
        {
          title: '灵韵元境 - 种地',
          platform: 'bilibili',
          url: 'https://www.bilibili.com/video/BV1PV32znEmP',
          thumbnail: '/images/project1.svg'
        },
        {
          title: '灵韵元境 - 任务规划',
          platform: 'bilibili',
          url: 'https://www.bilibili.com/video/BV1543HzeE9r',
          thumbnail: '/images/project1.svg'
        }
      ],
      technicalSpecs: {
        platform: ['PC', 'Mac'],
        engine: 'Unity 6',
        multiplayer: '支持',
        language: ['中文', '英文']
      }
    }
  };
  
  let projectSlug = $state('');
  let project = $state<ProjectDetail | null>(null);
  
  // 工具函数：提取YouTube视频ID
  function getYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match?.[1] || '';
  }
  
  // 工具函数：提取Bilibili视频BV号
  function getBilibiliId(url: string): string {
    const match = url.match(/bilibili\.com\/video\/(BV[^/?]+)/);
    return match?.[1] || '';
  }
  
  onMount(() => {
    projectSlug = $page.params.slug;
    project = projectData[projectSlug] || null;
    
    if (!project) {
      // 项目不存在，可以重定向到404页面或项目列表
      console.warn('项目不存在:', projectSlug);
    }
  });
</script>

<svelte:head>
  {#if project}
    <title>{project.name} - CAI Game Studio</title>
    <meta name="description" content={project.description} />
  {:else}
    <title>项目未找到 - CAI Game Studio</title>
  {/if}
</svelte:head>

{#if project}
  <!-- 项目英雄区域 -->
  <Section background="primary" className="project-hero">
    <div class="project-hero__content">
      <div class="project-hero__text">
        <h1 class="project-hero__title">{project.name}</h1>
        <p class="project-hero__subtitle">{project.description}</p>
        
        <div class="project-hero__meta">
          <div class="project-status project-status--{project.status}">
            {project.status === 'developing' ? '开发中' : project.status === 'completed' ? '已发布' : '规划中'}
          </div>
          <div class="project-tags">
            {#each project.tags as tag}
              <span class="project-tag">{tag}</span>
            {/each}
          </div>
        </div>
      </div>
      
      <div class="project-hero__image">
        <img src={project.image} alt={project.name} />
      </div>
    </div>
  </Section>
  
  <!-- 项目详情 -->
  <Section background="secondary">
    <div class="project-details">
      <div class="project-description">
        <h2 class="section-title">游戏介绍</h2>
        <div class="description-content">
          {#each project.detailedDescription.split('\n').filter((p: string) => p.trim()) as paragraph}
            <p>{paragraph.trim()}</p>
          {/each}
        </div>
      </div>
      
      <div class="project-features">
        <h2 class="section-title">核心特色</h2>
        <ul class="features-list">
          {#each project.features as feature}
            <li class="feature-item">{feature}</li>
          {/each}
        </ul>
      </div>
    </div>
  </Section>
  
  <!-- 视频播放 -->
  <Section background="primary">
    <h2 class="section-title">开发LOG</h2>
    <div class="videos-grid">
      {#each project.videos as video, index}
        <div class="video-item">
          <div class="video-wrapper">
            {#if video.platform === 'youtube'}
              <iframe 
                src="https://www.youtube.com/embed/{getYouTubeId(video.url)}"
                title={video.title}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="video-iframe"
              ></iframe>
            {:else if video.platform === 'bilibili'}
              <iframe 
                src="https://player.bilibili.com/player.html?bvid={getBilibiliId(video.url)}&page=1&high_quality=1&danmaku=0&autoplay=0"
                title={video.title}
                frameborder="0"
                scrolling="no"
                allowfullscreen="true"
                class="video-iframe"
              ></iframe>
            {/if}
          </div>
          <h3 class="video-title">{video.title}</h3>
          <div class="video-meta">
            <span class="video-platform">
              {video.platform === 'youtube' ? 'YouTube' : 'Bilibili'}
            </span>
            <a href={video.url} target="_blank" rel="noopener noreferrer" class="video-link">
              在{video.platform === 'youtube' ? 'YouTube' : 'Bilibili'}中观看
            </a>
          </div>
        </div>
      {/each}
    </div>
  </Section>
  
  <!-- 技术信息 -->
  <Section background="secondary">
    <div class="tech-specs">
      <h2 class="section-title">技术规格</h2>
      <div class="specs-grid">
        <div class="spec-item">
          <h3>支持平台</h3>
          <p>{project.technicalSpecs.platform.join(', ')}</p>
        </div>
        <div class="spec-item">
          <h3>游戏引擎</h3>
          <p>{project.technicalSpecs.engine}</p>
        </div>
        <div class="spec-item">
          <h3>多人游戏</h3>
          <p>{project.technicalSpecs.multiplayer}</p>
        </div>
        <div class="spec-item">
          <h3>支持语言</h3>
          <p>{project.technicalSpecs.language.join(', ')}</p>
        </div>
      </div>
    </div>
  </Section>
  
  <!-- 返回按钮 -->
  <Section background="primary">
    <div class="project-actions">
      <Button
        text="返回首页"
        variant="outline"
        size="large"
        href="/"
      />
    </div>
  </Section>
  
{:else}
  <!-- 项目未找到 -->
  <Section background="primary" className="not-found">
    <div class="not-found__content">
      <h1>项目未找到</h1>
      <p>抱歉，您访问的项目不存在。</p>
      <Button
        text="返回首页"
        variant="primary"
        size="large"
        href="/"
      />
    </div>
  </Section>
{/if}

<style>
  /* 项目英雄区域 */
  .project-hero__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  
  .project-hero__title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .project-hero__subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .project-hero__meta {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .project-hero__image img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  /* 项目状态 */
  .project-status {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    width: fit-content;
  }
  
  .project-status--developing {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }
  
  /* 标签 */
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
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
  
  /* 项目详情 */
  .project-details {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
  }
  
  .section-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-bottom: 2rem;
    color: var(--accent-color);
  }
  
  .description-content p {
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  
  /* 特色列表 */
  .features-list {
    list-style: none;
    padding: 0;
  }
  
  .feature-item {
    color: var(--text-secondary);
    padding: 1rem 0;
    border-bottom: 1px solid rgba(100, 255, 218, 0.1);
    position: relative;
    padding-left: 2rem;
    line-height: 1.6;
  }
  
  .feature-item::before {
    content: '✦';
    position: absolute;
    left: 0;
    color: var(--accent-color);
    font-weight: bold;
  }
  
  .feature-item:last-child {
    border-bottom: none;
  }
  
  /* 视频网格 */
  .videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2.5rem;
  }
  
  .video-item {
    background: rgba(100, 255, 218, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(100, 255, 218, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .video-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  .video-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 宽高比 */
    margin-bottom: 1rem;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  
  .video-title {
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  
  .video-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .video-platform {
    color: var(--accent-color);
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    background: rgba(100, 255, 218, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(100, 255, 218, 0.3);
  }
  
  .video-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s ease;
  }
  
  .video-link:hover {
    color: var(--accent-color);
  }
  
  /* 技术规格 */
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }
  
  .spec-item {
    padding: 1.5rem;
    background: rgba(100, 255, 218, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(100, 255, 218, 0.2);
  }
  
  .spec-item h3 {
    color: var(--accent-color);
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  .spec-item p {
    color: var(--text-secondary);
    margin: 0;
  }
  
  /* 项目操作按钮 */
  .project-actions {
    text-align: center;
  }
  
  /* 未找到页面 */
  .not-found__content {
    text-align: center;
    padding: 4rem 0;
  }
  
  .not-found__content h1 {
    font-size: 3rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
  
  .not-found__content p {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  /* 响应式设计 */
  @media (max-width: 1024px) {
    .project-hero__content {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
    
    .project-details {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
  
  @media (max-width: 768px) {
    .videos-grid {
      grid-template-columns: 1fr;
    }
    
    .specs-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .videos-grid {
      grid-template-columns: 1fr;
    }
    
    .video-item {
      padding: 1rem;
    }
    
    .video-title {
      font-size: 1rem;
    }
  }
</style>
