<script>
  import Hero3D from '$lib/components/Hero3D.svelte';
  import { onMount } from 'svelte';
  
  let isVisible = {
    hero: true,  // 默认设为true让英雄区域一开始就可见
    features: false,
    projects: false,
    team: false
  };
  
  // 简单的视觉效果 - 元素进入视口时显示
  onMount(() => {
    // 确保hero部分始终可见
    isVisible.hero = true;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 跳过hero部分的处理，确保它始终可见
        if (entry.target.id === 'hero') return;
        
        if (entry.isIntersecting) {
          isVisible[entry.target.id] = true;
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section:not(#hero)').forEach(el => {
      observer.observe(el);
    });
    
    // 特别处理hero部分，确保它总是可见
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.classList.add('visible');
    }
    
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>CAI Game Studio</title>
  <meta name="description" content="CAI Game Studio - 打造前沿的游戏体验" />
</svelte:head>

<!-- 特别为hero section添加一个额外的类，以便应用特殊样式 -->
<section class="section hero-section" id="hero" class:visible={isVisible.hero}>
  <Hero3D />
</section>

<section class="section features" id="features" class:visible={isVisible.features}>
  <div class="container">
    <h2>我们的专长</h2>
    
    <div class="features-grid">
      <div class="feature-card">
        <h3>沉浸式游戏体验</h3>
        <p>利用最新技术打造身临其境的游戏世界，让玩家获得前所未有的交互体验。</p>
      </div>
      
      <div class="feature-card">
        <h3>创新游戏机制</h3>
        <p>突破传统思维，创造独特的玩法元素，为游戏带来全新的乐趣与挑战。</p>
      </div>
      
      <div class="feature-card">
        <h3>精美艺术设计</h3>
        <p>由一流艺术团队打造精致视觉效果，创造令人难忘的游戏世界与角色。</p>
      </div>
      
      <div class="feature-card">
        <h3>跨平台开发</h3>
        <p>支持多种设备与平台，让玩家随时随地享受卓越的游戏体验。</p>
      </div>
    </div>
  </div>
</section>

<section class="section projects" id="projects" class:visible={isVisible.projects}>
  <div class="container">
    <h2>精选项目</h2>
    
    <div class="projects-grid">
      <div class="project-card">
        <div class="project-image" style="background-image: url('/images/project1.jpg')"></div>
        <h3>星际冒险</h3>
        <p>探索浩瀚宇宙，揭开神秘文明的秘密。</p>
      </div>
      
      <div class="project-card">
        <div class="project-image" style="background-image: url('/images/project2.jpg')"></div>
        <h3>幻境守护者</h3>
        <p>穿梭于现实与幻境，保护世界的平衡。</p>
      </div>
      
      <div class="project-card">
        <div class="project-image" style="background-image: url('/images/project3.jpg')"></div>
        <h3>机甲战纪</h3>
        <p>驾驶定制机甲，参与史诗级战役。</p>
      </div>
    </div>
    
    <div class="cta-center">
      <a href="/projects" class="button primary">查看更多项目</a>
    </div>
  </div>
</section>

<section class="section team" id="team" class:visible={isVisible.team}>
  <div class="container">
    <h2>关于我们</h2>
    <p class="team-intro">
      CAI Game Studio 是一家由热爱游戏的创作者组成的独立工作室。我们致力于打造高品质、富有创意的游戏体验，
      将前沿技术与独特的艺术视角相结合，创造令人难忘的虚拟世界。
    </p>
    
    <div class="cta-center">
      <a href="/about" class="button secondary">了解我们的团队</a>
    </div>
  </div>
</section>

<style>
  section {
    padding: 6rem 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #ffffff;
  }
  
  .section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  /* Hero部分特殊处理，确保它始终可见 */
  .hero-section {
    opacity: 1;
    transform: translateY(0);
    min-height: 100vh;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #0a192f, #112240);
    z-index: 1; /* 确保3D部分有适当的层级 */
  }
  
  .section.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .features {
    background: linear-gradient(to bottom, #0a192f, #112240);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background: rgba(16, 33, 65, 0.8);
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.3s;
    border: 1px solid rgba(100, 255, 218, 0.2);
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .feature-card h3 {
    color: #64ffda;
    margin-bottom: 1rem;
  }
  
  .feature-card p {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .projects {
    background: #112240;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .project-card {
    background: rgba(16, 33, 65, 0.8);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
  }
  
  .project-image {
    height: 200px;
    background-size: cover;
    background-position: center;
  }
  
  .project-card h3 {
    color: white;
    padding: 1.5rem 1.5rem 0.5rem;
  }
  
  .project-card p {
    color: rgba(255, 255, 255, 0.7);
    padding: 0 1.5rem 1.5rem;
  }
  
  .team {
    background: linear-gradient(to bottom, #112240, #0a192f);
    text-align: center;
  }
  
  .team-intro {
    color: rgba(255, 255, 255, 0.8);
    max-width: 800px;
    margin: 0 auto 3rem;
    font-size: 1.2rem;
    line-height: 1.6;
  }
  
  .cta-center {
    text-align: center;
    margin-top: 2rem;
  }
  
  .button {
    display: inline-block;
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
  
  @media (max-width: 768px) {
    section {
      padding: 4rem 0;
    }
    
    h2 {
      font-size: 2rem;
    }
  }
</style>