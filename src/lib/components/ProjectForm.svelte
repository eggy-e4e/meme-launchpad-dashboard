<script>
  import { createEventDispatcher } from 'svelte';
  import { projectsAPI } from '$lib/api/engine.js';
  
  const dispatch = createEventDispatcher();
  
  let formData = {
    name: '',
    ticker: '',
    description: '',
    contract_address: '',
    twitter_url: '',
    telegram_url: '',
    dex_screener_url: '',
    theme: 'minimal',
    primary_color: '#00ff00',
    font_stack: 'Inter',
    layout_style: 'simple',
    background_image_url: '',
    logo_url: ''
  };
  
  let submitted = false;
  let error = null;
  let uploading = false;
  
  async function handleSubmit() {
    submitted = true;
    error = null;
    
    // Basic validation
    if (!formData.name || !formData.ticker) {
      error = 'Name and ticker are required';
      submitted = false;
      return;
    }
    
    try {
      const response = await projectsAPI.create(formData);
      
      if (response.success) {
        dispatch('success', { project: response.project });
        
        // Reset form
        formData = {
          name: '',
          ticker: '',
          description: '',
          contract_address: '',
          twitter_url: '',
          telegram_url: '',
          dex_screener_url: '',
          theme: 'minimal',
          primary_color: '#00ff00',
          font_stack: 'Inter',
          layout_style: 'simple',
          background_image_url: '',
          logo_url: ''
        };
        submitted = false;
      } else {
        error = response.error?.message || 'Failed to create project';
        submitted = false;
      }
    } catch (err) {
      error = err.message;
      submitted = false;
    }
  }
  
  function handleImageUpload(type, url) {
    formData[`${type}_image_url`] = url;
  }
</script>

<div class="project-form">
  <h2>Create New Project</h2>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="name">Project Name</label>
      <input 
        type="text" 
        id="name" 
        bind:value={formData.name} 
        class:error={!formData.name && submitted}
        required
      />
    </div>
    
    <div class="form-group">
      <label for="ticker">Ticker</label>
      <input 
        type="text" 
        id="ticker" 
        bind:value={formData.ticker} 
        class:error={!formData.ticker && submitted}
        placeholder="e.g., TOKEN"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="description">Description</label>
      <textarea 
        id="description" 
        bind:value={formData.description} 
        rows="3"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="contract_address">Contract Address</label>
      <input 
        type="text" 
        id="contract_address" 
        bind:value={formData.contract_address} 
        placeholder="0x..."
      />
    </div>
    
    <div class="form-group">
      <label for="twitter_url">Twitter URL</label>
      <input 
        type="url" 
        id="twitter_url" 
        bind:value={formData.twitter_url} 
        placeholder="https://twitter.com/..."
      />
    </div>
    
    <div class="form-group">
      <label for="telegram_url">Telegram URL</label>
      <input 
        type="url" 
        id="telegram_url" 
        bind:value={formData.telegram_url} 
        placeholder="https://t.me/..."
      />
    </div>
    
    <div class="form-group">
      <label for="dex_screener_url">DEX Screener URL</label>
      <input 
        type="url" 
        id="dex_screener_url" 
        bind:value={formData.dex_screener_url} 
        placeholder="https://dexscreener.com/..."
      />
    </div>
    
    <div class="form-group">
      <label for="theme">Theme</label>
      <select id="theme" bind:value={formData.theme}>
        <option value="minimal">Minimal</option>
        <option value="retro">Retro</option>
        <option value="cyber">Cyber</option>
        <option value="chaos">Chaos</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="layout_style">Layout Style</label>
      <select id="layout_style" bind:value={formData.layout_style}>
        <option value="simple">Simple (Centered)</option>
        <option value="left-align">Left Align</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="primary_color">Primary Color</label>
      <input 
        type="color" 
        id="primary_color" 
        bind:value={formData.primary_color} 
      />
    </div>
    
    <div class="form-group">
      <label for="font_stack">Font</label>
      <select id="font_stack" bind:value={formData.font_stack}>
        <option value="Inter">Inter</option>
        <option value="Courier New">Courier New</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>Background Image</label>
      <ImageUpload on:upload={(e) => handleImageUpload('background', e.detail.url)} />
    </div>
    
    <div class="form-group">
      <label>Logo</label>
      <ImageUpload on:upload={(e) => handleImageUpload('logo', e.detail.url)} />
    </div>
    
    <button type="submit" class="btn-primary" disabled={submitted || uploading}>
      {#if submitted || uploading}
        Creating...
      {:else}
        Create Project
      {/if}
    </button>
  </form>
</div>

<style>
  .project-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-top: 0;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input.error, textarea.error, select.error {
    border-color: #e74c3c;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-primary:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>