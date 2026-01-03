// Database wrapper using Prisma ORM with PostgreSQL
// This replaces the old JSON file-based database

import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface Project {
    id: string;
    userId: string;
    name: string;
    type: 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM';
    data: any;
    createdAt: string;
    updatedAt: string;
}

export interface PageContent {
    slug: string;
    title: string;
    sections: PageSection[];
    lastUpdated: string;
}

export interface PageSection {
    id: string;
    type: 'hero' | 'features' | 'cta' | 'text' | 'html';
    content: any;
    isVisible: boolean;
    order: number;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    createdAt: string;
    targetUserId?: string;
}

export interface DBData {
    users: User[];
    projects: Project[];
    pages: PageContent[];
    notifications: Notification[];
}

// Password utilities
export const passwordUtils = {
    hash: async (password: string): Promise<string> => {
        return bcrypt.hash(password, 10);
    },
    verify: async (password: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(password, hash);
    }
};

// Database helpers using Prisma
export const db = {
    users: {
        getAll: async () => {
            const users = await prisma.user.findMany();
            return users.map(u => ({
                ...u,
                createdAt: u.createdAt.toISOString(),
                updatedAt: u.updatedAt.toISOString()
            }));
        },
        getById: async (id: string) => {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) return null;
            return {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            };
        },
        getByEmail: async (email: string) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return null;
            return {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            };
        },
        create: async (user: Omit<User, 'createdAt'>) => {
            const created = await prisma.user.create({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                }
            });
            return {
                ...created,
                createdAt: created.createdAt.toISOString(),
                updatedAt: created.updatedAt.toISOString()
            };
        },
        update: async (id: string, updates: Partial<User>) => {
            const updated = await prisma.user.update({
                where: { id },
                data: updates
            });
            return {
                ...updated,
                createdAt: updated.createdAt.toISOString(),
                updatedAt: updated.updatedAt.toISOString()
            };
        },
        delete: async (id: string) => {
            await prisma.user.delete({ where: { id } });
        }
    },
    projects: {
        getAll: async () => {
            const projects = await prisma.project.findMany();
            return projects.map(p => ({
                id: p.id,
                userId: p.userId,
                name: p.name,
                type: p.type as 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM',
                data: typeof p.data === 'string' ? JSON.parse(p.data) : p.data,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()
            }));
        },
        getByUserId: async (userId: string) => {
            const projects = await prisma.project.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' }
            });
            return projects.map(p => ({
                id: p.id,
                userId: p.userId,
                name: p.name,
                type: p.type as 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM',
                data: typeof p.data === 'string' ? JSON.parse(p.data) : p.data,
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()
            }));
        },
        getById: async (id: string) => {
            const project = await prisma.project.findUnique({ where: { id } });
            if (!project) return null;
            return {
                id: project.id,
                userId: project.userId,
                name: project.name,
                type: project.type as 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM',
                data: typeof project.data === 'string' ? JSON.parse(project.data) : project.data,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString()
            };
        },
        create: async (project: Project) => {
            const created = await prisma.project.create({
                data: {
                    id: project.id,
                    name: project.name,
                    type: project.type,
                    userId: project.userId,
                    data: JSON.stringify(project.data || {})
                }
            });
            return {
                id: created.id,
                userId: created.userId,
                name: created.name,
                type: created.type as 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM',
                data: JSON.parse(created.data || '{}'),
                createdAt: created.createdAt.toISOString(),
                updatedAt: created.updatedAt.toISOString()
            };
        },
        update: async (id: string, updates: Partial<Project>) => {
            const dataToUpdate: any = {};
            if (updates.name) dataToUpdate.name = updates.name;
            if (updates.data !== undefined) dataToUpdate.data = JSON.stringify(updates.data);
            if (updates.updatedAt) dataToUpdate.updatedAt = new Date(updates.updatedAt);

            const updated = await prisma.project.update({
                where: { id },
                data: dataToUpdate
            });
            return {
                id: updated.id,
                userId: updated.userId,
                name: updated.name,
                type: updated.type as 'WIREFRAME' | 'DESIGN_THINKING' | 'DIAGRAM',
                data: JSON.parse(updated.data || '{}'),
                createdAt: updated.createdAt.toISOString(),
                updatedAt: updated.updatedAt.toISOString()
            };
        },
        delete: async (id: string) => {
            await prisma.project.delete({ where: { id } });
        }
    },
    pages: {
        getAll: async (): Promise<PageContent[]> => {
            // Pages are stored in a JSON format in database
            // For now, return empty array as we don't have pages table in Prisma
            return [];
        },
        getBySlug: async (slug: string): Promise<PageContent | null> => {
            // Return null for now as we don't have pages table
            return null;
        },
        save: async (page: PageContent): Promise<PageContent> => {
            // For now, just return the page as-is
            // You can add a pages table to Prisma schema later
            return page;
        }
    },
    notifications: {
        getAll: async () => {
            const notifications = await prisma.notification.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return notifications.map(n => ({
                ...n,
                createdAt: n.createdAt.toISOString(),
                targetUserId: n.targetUserId || undefined
            }));
        },
        create: async (notification: Notification) => {
            const created = await prisma.notification.create({
                data: {
                    id: notification.id,
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    targetUserId: notification.targetUserId
                }
            });
            return {
                ...created,
                createdAt: created.createdAt.toISOString(),
                targetUserId: created.targetUserId || undefined
            };
        },
        delete: async (id: string) => {
            await prisma.notification.delete({ where: { id } });
        }
    },
    getDB: async (): Promise<DBData> => {
        const [users, projects, notifications] = await Promise.all([
            db.users.getAll(),
            db.projects.getAll(),
            db.notifications.getAll()
        ]);
        return {
            users,
            projects,
            pages: [],
            notifications
        };
    },
    saveDB: async (data: DBData) => {
        // This is a no-op now since we're using Prisma
        // Each operation saves directly to database
        console.warn('saveDB is deprecated - using Prisma auto-save');
    }
};
