<script>
  import { projectsAPI } from '$lib/api/engine.js';
  import { deployAPI } from '$lib/api/engine.js';
  
  export let projects = [];
  let loading = false;
  let error = null;
  let deploying = null;
  
  async function loadProjects() {
    loading = true;
    error = null;
    
    try {
      const response = await projectsAPI.list();
      
      if (response.success) {
        projects = response.projects || [];
      } else {
        error = response.error?.message || 'Failed to load projects';
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  async function handleDeploy(project) {
    deploying = project.id;
    
    try {
      const response = await deployAPI.deploy(project.id, project.custom_domain);
      
      if (response.success) {
        // Update project with deployment info
        project.deployed_url = response.deployment.deployment_url;
        project.github_repo_url = response.deployment.github_repo_url;
      } else {
        error = response.error?.message || 'Deployment failed';
      }
    } catch (err) {
      error = err.message;
    } finally {
      deploying = null;
    }
  }
  
  async function handleDelete(project) {
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }
    
    try {
      const response = await projectsAPI.delete(project.id);
      
      if (response.success) {
        projects = projects.filter(p => p.id !== project.id);
      } else {
        error = response.error?.message || 'Failed to delete project';
      }
    } catch (err) {
      error = err.message;
    }
  }
  
  // Load projects on component mount
  loadProjects();
</script>

<div class="project-list">
  <h2>Projects</h2>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  {#if loading}
    <div class="loading">Loading projects...</div>
  {:else if projects.length === 0}
    <div class="empty-state">
      <p>No projects yet. Create your first project to get started!</p>
    </div>
  {:else}
    <div class="projects-grid">
      {#each projects as project}
        <div class="project-card" class:deploying === project.id>
          <div class="project-header">
            <h3>{project.name}</h3>
            <span class="ticker">${project.ticker}</span>
          </div>
          
          <div class="project-info">
            <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
            <p><strong>Theme:</strong> {project.theme}</p>
            <p><strong>Layout:</strong> {project.layout_style}</p>
            
            {#if project.deployed_url}
              <p><strong>Live:</strong> 
                <a href={project.deployed_url} target="_blank" rel="noopener noreferrer">
                  {project.deployed_url}
                </a>
              </p>
            {/if}
            
            {#if project.github_repo_url}
              <p><strong>Repo:</strong> 
                <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer">
                  View Repository
                </a>
              </p>
            {/if}
          </div>
          
          <div class="project-actions">
            {#if !project.deployed_url}
              <button 
                class="btn-deploy" 
                on:click={() => handleDeploy(project)}
                disabled={deploying !== null}
              >
                {#if deploying === project.id}
                  Deploying...
                {:else}
                  Deploy
                {/if}
              </button>
            {/if}
            
            <button 
              class="btn-delete" 
              on:click={() => handleDelete(project)}
            >
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .project-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .project-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .project-card.deploying {
    opacity: 0.7;
  }
  
  .project-header {
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .project-header h3 {
    margin: 0;
    color: #333;
  }
  
  .ticker {
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    margin-left: 0.5rem;
  }
  
  .project-info {
    padding: 1rem;
  }
  
  .project-info p {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: #666;
  }
  
  .project-actions {
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-deploy, .btn-delete {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-deploy {
    background-color: #28a745;
    color: white;
    flex: 1;
  }
  
  .btn-deploy:hover {
    background-color: #218838;
  }
  
  .btn-delete {
    background-color: #dc3545;
    color: white;
  }
  
  .btn-delete:hover {
    background-color: #c82333;
  }
  
  .loading, .error, .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>