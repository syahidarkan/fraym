// localStorage wrapper for projects and pages management
import { ElementType } from '@/store/canvasStore';
import { DesignThinkingProject } from '@/types/designThinking';

export type ProjectType = 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM';

export interface Project {
    id: string;
    name: string;
    type: ProjectType;
    createdAt: string;
    updatedAt: string;
    pages: Page[];
    starred: boolean;
    deleted: boolean;
    draft: boolean;
    designThinking: DesignThinkingProject | null;
    diagramData?: {
        nodes: any[];
        edges: any[];
    };
}

export interface Page {
    id: string;
    name: string;
    order: number;
    projectId: string;
    elements: CanvasElement[];
}

export interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    props?: Record<string, any>;
    zIndex: number;
}

const PROJECTS_KEY = 'wireframe_projects';

export const storage = {
    // Get all projects
    getProjects(): Project[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(PROJECTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save all projects
    saveProjects(projects: Project[]): void {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    },

    // Get single project by ID
    getProject(id: string): Project | null {
        const projects = this.getProjects();
        return projects.find(p => p.id === id) || null;
    },

    // Create new project
    createProject(name: string, type: ProjectType, description: string = ''): Project {
        const projects = this.getProjects();
        const newProject: Project = {
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            pages: [],
            starred: false,
            deleted: false,
            draft: true,
            designThinking: null,
        };

        if (type === 'WIREFRAME') {
            newProject.pages = [
                {
                    id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: 'Page 1',
                    order: 0,
                    projectId: newProject.id,
                    elements: [],
                },
            ];
        }

        if (type === 'DESIGN_THINKING') {
            newProject.designThinking = {
                id: `dt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name,
                description,
                interviews: [],
                personas: [],
                empathyMaps: [],
                problemStatements: [],
                hmwQuestions: [],
                userJourneys: [],
                brainstormBoards: [],
                featurePriorities: [],
                usabilityTests: [],
                testResults: [],
                currentPhase: 'empathize',
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }

        projects.unshift(newProject);
        this.saveProjects(projects);

        // Sync to backend
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('wireframe_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                fetch('/api/projects/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project: newProject,
                        userId: user.id || user.email
                    })
                }).catch(err => console.error('Sync failed', err));
            }
        }

        return newProject;
    },

    // Save a single project
    saveProject(project: Project): void {
        const projects = this.getProjects();
        const projectIndex = projects.findIndex(p => p.id === project.id);
        if (projectIndex !== -1) {
            projects[projectIndex] = project;
            projects[projectIndex].updatedAt = new Date().toISOString();
            this.saveProjects(projects);
        } else {
            // If project doesn't exist, add it
            projects.unshift(project);
            this.saveProjects(projects);
        }

        // Sync to backend (fire and forget)
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('wireframe_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                fetch('/api/projects/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project,
                        userId: user.id || user.email
                    })
                }).catch(err => console.error('Sync failed', err));
            }
        }
    },


    // Update project (for auto-save)
    updateProject(projectId: string, pageId: string, elements: CanvasElement[]): void {
        const project = this.getProject(projectId);
        if (project) {
            const pageIndex = project.pages.findIndex(p => p.id === pageId);
            if (pageIndex !== -1) {
                project.pages[pageIndex].elements = elements;
                this.saveProject(project);
            }
        }
    },

    // Rename project
    renameProject(id: string, newName: string): void {
        const project = this.getProject(id);
        if (project) {
            project.name = newName;
            if (project.designThinking) {
                project.designThinking.name = newName;
            }
            this.saveProject(project);
        }
    },

    // Toggle starred
    toggleStarred(id: string): void {
        const project = this.getProject(id);
        if (project) {
            project.starred = !project.starred;
            this.saveProject(project);
        }
    },

    // Move to trash
    moveToTrash(id: string): void {
        const project = this.getProject(id);
        if (project) {
            project.deleted = true;
            this.saveProject(project);
        }
    },

    // Restore from trash
    restoreFromTrash(id: string): void {
        const project = this.getProject(id);
        if (project) {
            project.deleted = false;
            this.saveProject(project);
        }
    },

    // Delete project permanently
    deleteProject(id: string): void {
        let projects = this.getProjects();
        projects = projects.filter(p => p.id !== id);
        this.saveProjects(projects);

        // Sync delete to backend
        if (typeof window !== 'undefined') {
            fetch(`/api/projects?id=${id}`, {
                method: 'DELETE'
            }).catch(err => console.error('Delete sync failed', err));
        }
    },

    // Duplicate project
    duplicateProject(id: string): Project | null {
        const projectToDuplicate = this.getProject(id);
        if (!projectToDuplicate) return null;

        const newProject: Project = {
            ...projectToDuplicate,
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: `${projectToDuplicate.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            starred: false,
        };

        if (newProject.type === 'WIREFRAME') {
            newProject.pages = projectToDuplicate.pages.map(page => ({
                ...page,
                id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                projectId: newProject.id,
            }));
        }

        if (newProject.designThinking) {
            newProject.designThinking = {
                ...newProject.designThinking,
                id: `dt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: `${newProject.designThinking.name} (Copy)`,
            };
        }

        const projects = this.getProjects();
        projects.unshift(newProject);
        this.saveProjects(projects);
        return newProject;
    },
};
