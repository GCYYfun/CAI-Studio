<script>
  import { onMount } from 'svelte';
  
  let isVisible = {
    story: false,
    team: false,
    values: false
  };
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible[entry.target.id] = true;
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  });
  
  // 团队成员数据
  const teamMembers = [
    { name: '张三', role: '创始人兼首席设计师', image: '/images/team1.jpg' },
    { name: '李四', role: '技术总监', image: '/images/team2.jpg' },
    { name: '王五', role: '艺术总监', image: '/images/team3.jpg' },
    { name: '赵六', role: '资深程序员', image: '/images/team4.jpg' }
  ];
</script>

<svelte:head>
  <title>关于我们 | CAI Game Studio</title>
  <meta name="description" content="了解CAI Game Studio的团队和使命" />
</svelte:head>

<section class="about-hero">
  <div class="container">
    <h1>关于 CAI Game Studio</h1>
    <p>热爱游戏，创新未来</p>
  </div>
</section>

<section class="section" id="story" class:visible={isVisible.story}>
  <div class="container">
    <h2>我们的故事</h2>
    <div class="story-content">
      <div class="story-image">
        <img src="/images/studio.jpg" alt="CAI Game Studio工作室" />
      </div>
      <div class="story-text">
        <p>CAI Game Studio 成立于2020年，是一家由热爱游戏的创作者组成的独立游戏工作室。</p>
        <p>我们的创始团队在大型游戏公司工作多年，积累了丰富的游戏开发经验。怀着对创新游戏体验的热情，我们决定成立自己的工作室，将我们对游戏的理解和创意付诸实践。</p>
        <p>从最初的几个人到现在的精英团队，我们始终保持对品质的坚持和对玩家体验的专注，致力于打造令人难忘的游戏世界。</p>
      </div>
    </div>
  </div>
</section>

<section class="section values-section" id="values" class:visible={isVisible.values}>
  <div class="container">
    <h2>我们的价值观</h2>
    <div class="values-grid">
      <div class="value-card">
        <h3>创新</h3>
        <p>突破常规，探索未知的游戏机制和体验</p>
      </div>
      
      <div class="value-card">
        <h3>品质</h3>
        <p>注重细节，打造精致完善的游戏体验</p>
      </div>
      
      <div class="value-card">
        <h3>玩家至上</h3>
        <p>倾听社区声音，为玩家创造价值</p>
      </div>
      
      <div class="value-card">
        <h3>团队协作</h3>
        <p>鼓励开放交流，共同成长</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="team" class:visible={isVisible.team}>
  <div class="container">
    <h2>核心团队</h2>
    <div class="team-grid">
      {#each teamMembers as member}
        <div class="team-member">
          <div class="member-image" style="background-image: url('{member.image}')"></div>
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .about-hero {
    height: 50vh;
    background: linear-gradient(to bottom, rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.95)),
                url('/images/team-bg.jpg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 60px; /* 导航栏高度 */
  }
  
  .about-hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
  
  .about-hero p {
    font-size: 1.5rem;
    opacity: 0.8;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .section {
    padding: 5rem 0;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .section.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--accent-color);
  }
  
  .story-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  
  .story-image img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .story-text p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.7;
  }
  
  .values-section {
    background: linear-gradient(to bottom, #112240, #0a192f);
  }
  
  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .value-card {
    background: rgba(16, 33, 65, 0.8);
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid rgba(100, 255, 218, 0.2);
    transition: transform 0.3s;
  }
  
  .value-card:hover {
    transform: translateY(-5px);
  }
  
  .value-card h3 {
    color: var(--accent-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
  }
  
  .team-member {
    text-align: center;
  }
  
  .member-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    background-size: cover;
    background-position: center;
    border: 3px solid var(--accent-color);
  }
  
  .team-member h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  .team-member p {
    color: var(--accent-color);
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .story-content {
      grid-template-columns: 1fr;
    }
    
    .about-hero h1 {
      font-size: 2.5rem;
    }
  }
</style>
