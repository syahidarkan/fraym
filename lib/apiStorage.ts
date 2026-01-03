// Simple API client for making requests to our PostgreSQL-backed API

export const apiStorage = {
  async getProjects() {
    const res = await fetch('/api/projects', {
      credentials: 'include'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.projects || [];
  },

  async getProject(id: string) {
    const res = await fetch(`/api/projects/${id}`, {
      credentials: 'include'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project;
  },

  async saveProject(project: any) {
    const method = project.id ? 'PUT' : 'POST';
    const url = project.id ? `/api/projects/${project.id}` : '/api/projects';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(project)
    });

    if (!res.ok) throw new Error('Failed to save project');
    const data = await res.json();
    return data.project;
  },

  async deleteProject(id: string) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to delete project');
    return true;
  },

  async createProject(name: string, type: any, data?: any) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name,
        type,
        ...data,
      })
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.project;
  },

  async updateProject(id: string, updates: any) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates)
    });

    if (!res.ok) throw new Error('Failed to update project');
    const data = await res.json();
    return data.project;
  }
};
