import React from 'react'
import { notFound } from 'next/navigation'
import { db } from '@/lib/server/db'
import PageRenderer from '@/components/Builder/PageRenderer'
import Navbar from '@/components/Marketing/Navbar'
import Footer from '@/components/Marketing/Footer'

export const dynamic = 'force-dynamic'

// Generate static params for all pages
export async function generateStaticParams() {
    const pages = await db.pages.getAll()
    return pages.map((page) => ({
        slug: page.slug,
    }))
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const page = await db.pages.getBySlug(slug)

    if (!page) {
        notFound()
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <PageRenderer sections={page.sections} />
            </main>
            <Footer />
        </div>
    )
}
