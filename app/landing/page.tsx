import React from 'react'
import Navbar from '../../components/Marketing/Navbar'
import Footer from '../../components/Marketing/Footer'
import styles from './LandingPage.module.css'
import FloatingShapes from '../../components/Marketing/FloatingShapes'
import { db } from '@/lib/server/db'
import PageRenderer from '../../components/Builder/PageRenderer'

const defaultSections = [
    {
        id: 'hero',
        type: 'hero',
        isVisible: true,
        order: 0,
        content: {
            titlePrefix: "Build",
            subtitle: "From wireframes to diagrams and design thinking, create everything you need to bring your ideas to life with professional tools.",
            useCases: [
                "a mobile app wireframe",
                "a landing page design",
                "a dashboard interface",
                "flowcharts and diagrams",
                "user journey maps",
                "empathy maps for research",
                "design thinking workshops",
                "usability test plans",
                "product prototypes",
                "UML diagrams",
                "BPMN workflows"
            ]
        }
    },
    {
        id: 'features',
        type: 'features',
        isVisible: true,
        order: 1,
        content: {
            title: "Three Powerful Tools, One Platform",
            subtitle: "Everything you need for modern product design, research, and documentation.",
            items: [
                { title: "Wireframe Editor", description: "Professional drag-and-drop canvas with 50+ UI components for rapid prototyping.", icon: "Layout" },
                { title: "Design Thinking", description: "Complete toolkit for user research with empathy maps, journey maps, and brainstorming.", icon: "Lightbulb" },
                { title: "Diagram Editor", description: "Create flowcharts, UML diagrams, and BPMN workflows with ease.", icon: "GitBranch" },
                { title: "Component Library", description: "Extensive collection of pre-built UI components ready to use.", icon: "Grid" },
                { title: "Device Presets", description: "Instant responsive frames for mobile, tablet, and desktop views.", icon: "Smartphone" },
                { title: "Properties Panel", description: "Fine-tune every detail with intuitive real-time controls.", icon: "Sliders" },
                { title: "Auto-Save", description: "Never lose your work with automatic local storage backup.", icon: "Save" },
                { title: "Export & Share", description: "High-resolution PNG export for presentations and handoffs.", icon: "Download" },
                { title: "Collaborative Features", description: "Built for teams with organized project management.", icon: "Users" }
            ]
        }
    },
    {
        id: 'demo',
        type: 'demo',
        isVisible: true,
        order: 2,
        content: {
            title: "Try It Yourself",
            subtitle: "Experience the editor right here. Drag components, resize elements, and see how easy it is. No account required.",
            badge: "INTERACTIVE DEMO"
        }
    },
    {
        id: 'cta',
        type: 'cta',
        isVisible: true,
        order: 3,
        content: {
            title: "Ready to build?",
            subtitle: "Join designers, product managers, and teams using Fraym to bring ideas to life faster.",
            buttonText: "Get Started for Free",
            buttonLink: "/register"
        }
    }
];

export default async function LandingPage() {
    // Fetch content from DB (Server Side)
    let sections = defaultSections;
    try {
        const dbPage = await db.pages.getBySlug('landing');
        if (dbPage && dbPage.sections && dbPage.sections.length > 0) {
            sections = dbPage.sections.sort((a, b) => a.order - b.order);
        }
    } catch (e) {
        console.error("Failed to load CMS content:", e);
    }

    return (
        <div className={styles.container}>
            <FloatingShapes />
            <Navbar />

            <main style={{ position: 'relative', zIndex: 10 }}>
                <PageRenderer sections={sections} />
            </main>

            <Footer />
        </div >
    )
}
