import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/work/reviews/[id] - Get single review
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const review = await prisma.workReview.findUnique({
            where: { id: params.id },
            include: {
                task: {
                    include: {
                        assignedTo: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                        project: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        return NextResponse.json(
            { error: 'Failed to fetch review' },
            { status: 500 }
        );
    }
}

// PATCH /api/work/reviews/[id] - Update review
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { rating, comment, status } = body;

        // Validation
        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Check if review exists
        const existingReview = await prisma.workReview.findUnique({
            where: { id: params.id },
        });

        if (!existingReview) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        // Update review
        const updatedReview = await prisma.workReview.update({
            where: { id: params.id },
            data: {
                ...(rating && { rating }),
                ...(comment !== undefined && { comment }),
                ...(status && { status }),
            },
            include: {
                task: {
                    include: {
                        assignedTo: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        );
    }
}

// DELETE /api/work/reviews/[id] - Delete review
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if review exists
        const existingReview = await prisma.workReview.findUnique({
            where: { id: params.id },
        });

        if (!existingReview) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        // Delete review
        await prisma.workReview.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}
