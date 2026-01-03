import { NextRequest, NextResponse } from 'next/server'

// This is now a placeholder API
// Actual processing happens in the browser using OpenCV.js and Tesseract.js
// This endpoint is kept for future server-side enhancements if needed

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            )
        }

        // Return success - actual processing is done client-side
        return NextResponse.json({
            success: true,
            message: 'Image received. Processing should be done client-side using OpenCV.js',
        })

    } catch (error: any) {
        console.error('Wireframe scan error:', error)
        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
            },
            { status: 500 }
        )
    }
}
