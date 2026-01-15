const ENGINE_API_URL = import.meta.env.PUBLIC_ENGINE_API_URL || 'http://localhost:8787';

export async function apiRequest(endpoint, options = {}) {
  const url = `${ENGINE_API_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  
  return await response.json();
}

export const projectsAPI = {
  async create(projectData) {
    return apiRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },
  
  async get(id) {
    return apiRequest(`/api/projects/${id}`);
  },
  
  async update(id, projectData) {
    return apiRequest(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },
  
  async delete(id) {
    return apiRequest(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
  
  async list() {
    return apiRequest('/api/projects');
  },
};

export const uploadAPI = {
  async upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${ENGINE_API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }
    
    return await response.json();
  },
};

export const deployAPI = {
  async deploy(projectId, customDomain) {
    return apiRequest('/api/deploy', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        custom_domain: customDomain,
      }),
    });
  },
};