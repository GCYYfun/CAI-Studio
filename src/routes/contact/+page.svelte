<script>
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  let formSubmitted = false;
  let formError = false;
  
  function handleSubmit() {
    // 这里应该添加实际的表单处理逻辑
    // 现在只是模拟成功提交
    if (formData.name && formData.email && formData.message) {
      formSubmitted = true;
      formError = false;
    } else {
      formError = true;
    }
  }
</script>

<svelte:head>
  <title>联系我们 | CAI Game Studio</title>
  <meta name="description" content="与CAI Game Studio取得联系" />
</svelte:head>

<section class="contact-hero">
  <div class="container">
    <h1>联系我们</h1>
    <p>我们期待听到您的声音</p>
  </div>
</section>

<section class="contact-section">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info">
        <h2>与我们取得联系</h2>
        <p>无论您是对我们的游戏感兴趣，寻求合作机会，还是有任何问题，我们都很乐意收到您的来信。</p>
        
        <div class="contact-methods">
          <div class="contact-method">
            <h3>电子邮件</h3>
            <p><a href="mailto:info@caistudio.com">info@caistudio.com</a></p>
          </div>
          
          <div class="contact-method">
            <h3>地址</h3>
            <p>中国北京市海淀区双清路30号</p>
          </div>
        </div>
      </div>
      
      <div class="contact-form">
        {#if formSubmitted}
          <div class="form-success">
            <h3>感谢您的留言！</h3>
            <p>我们已收到您的信息，将尽快回复您。</p>
            <button on:click={() => {formSubmitted = false; formData = {name: '', email: '', subject: '', message: ''}}}>
              发送新消息
            </button>
          </div>
        {:else}
          <h2>发送消息</h2>
          <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" bind:value={formData.name} required />
            </div>
            
            <div class="form-group">
              <label for="email">电子邮箱</label>
              <input type="email" id="email" bind:value={formData.email} required />
            </div>
            
            <div class="form-group">
              <label for="subject">主题</label>
              <input type="text" id="subject" bind:value={formData.subject} />
            </div>
            
            <div class="form-group">
              <label for="message">消息</label>
              <textarea id="message" rows="5" bind:value={formData.message} required></textarea>
            </div>
            
            {#if formError}
              <p class="error-message">请填写所有必填字段</p>
            {/if}
            
            <button type="submit" class="submit-button">发送消息</button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .contact-hero {
    height: 40vh;
    background: linear-gradient(to bottom, rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.95)),
                url('/images/contact-bg.jpg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 60px; /* 导航栏高度 */
  }
  
  .contact-hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
  
  .contact-hero p {
    font-size: 1.5rem;
    opacity: 0.8;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .contact-section {
    padding: 5rem 0;
    background: var(--secondary-background);
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--accent-color);
  }
  
  .contact-info p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.7;
  }
  
  .contact-methods {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .contact-method h3 {
    color: var(--accent-color);
    margin-bottom: 0.5rem;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-links a {
    color: white;
    opacity: 0.8;
    transition: opacity 0.3s, color 0.3s;
  }
  
  .social-links a:hover {
    opacity: 1;
    color: var(--accent-color);
  }
  
  .contact-form {
    background: rgba(16, 33, 65, 0.8);
    padding: 2rem;
    border-radius: 10px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--accent-color);
  }
  
  input, textarea {
    width: 100%;
    padding: 0.8rem;
    background: rgba(10, 25, 47, 0.7);
    border: 1px solid rgba(100, 255, 218, 0.3);
    border-radius: 4px;
    color: white;
    font-family: inherit;
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: var(--accent-color);
  }
  
  .error-message {
    color: #ff6b6b;
    margin-bottom: 1rem;
  }
  
  .submit-button {
    background: var(--accent-color);
    color: var(--background-color);
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .submit-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  .form-success {
    text-align: center;
    padding: 2rem;
  }
  
  .form-success h3 {
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
  
  .form-success p {
    margin-bottom: 2rem;
  }
  
  .form-success button {
    background: var(--accent-color);
    color: var(--background-color);
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
    
    .contact-methods {
      grid-template-columns: 1fr;
    }
    
    .contact-hero h1 {
      font-size: 2.5rem;
    }
  }
</style>
