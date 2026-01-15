<script>
  import ProjectForm from '$lib/components/ProjectForm.svelte';
  import ProjectList from '$lib/components/ProjectList.svelte';
  
  let currentView = 'list'; // 'list' or 'form'
  let projects = [];
</script>

<div class="dashboard">
  <header class="dashboard-header">
    <h1>Memecoin Launchpad Factory</h1>
    <nav>
      <button
        class="nav-btn"
        class:active={currentView === 'form'}
        on:click={() => currentView = 'form'}
      >
        New Project
      </button>
      <button
        class="nav-btn"
        class:active={currentView === 'list'}
        on:click={() => currentView = 'list'}
      >
        Projects
      </button>
    </nav>
  </header>
  
  <main class="dashboard-content">
    {#if currentView === 'form'}
      <div class="form-container">
        <ProjectForm 
          on:success={(e) => {
            projects = [e.detail.project, ...projects];
            currentView = 'list';
          }}
        />
      </div>
    {:else}
      <ProjectList {projects} />
    {/if}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa;
    color: #333;
  }
  
  .dashboard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .dashboard-header {
    background-color: #343a40;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dashboard-header h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .nav {
    display: flex;
    gap: 1rem;
  }
  
  .nav-btn {
    background-color: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .nav-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .nav-btn.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  
  .dashboard-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
  
  .form-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
    }
    
    .nav {
      width: 100%;
      justify-content: center;
    }
  }
</style>