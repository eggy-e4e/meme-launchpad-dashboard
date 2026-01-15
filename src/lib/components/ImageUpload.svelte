<script>
  import { createEventDispatcher } from 'svelte';
  import { uploadAPI } from '$lib/api/engine.js';
  
  const dispatch = createEventDispatcher();
  
  let uploading = false;
  let error = null;
  
  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type (only allow images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      error = 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.';
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      error = 'File too large. Maximum size is 5MB.';
      return;
    }
    
    uploading = true;
    error = null;
    
    try {
      const response = await uploadAPI.upload(file);
      
      if (response.success) {
        dispatch('upload', { url: response.url });
      } else {
        error = response.error?.message || 'Upload failed';
      }
    } catch (err) {
      error = err.message;
    } finally {
      uploading = false;
    }
  }
</script>

<div class="image-upload">
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <div class="upload-area" class:uploading>
    <input 
      type="file" 
      accept="image/*" 
      on:change={handleFileSelect} 
      disabled={uploading}
    />
    
    {#if uploading}
      <div class="uploading-overlay">
        <div class="spinner"></div>
        <p>Uploading...</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .image-upload {
    margin-bottom: 1rem;
  }
  
  .upload-area {
    position: relative;
    border: 2px dashed #ddd;
    border-radius: 4px;
    padding: 2rem;
    text-align: center;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
  }
  
  .upload-area:hover {
    border-color: #007bff;
    background-color: #f0f8ff;
  }
  
  .upload-area.uploading {
    border-color: #007bff;
    background-color: #f0f8ff;
  }
  
  .upload-area input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  .uploading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>