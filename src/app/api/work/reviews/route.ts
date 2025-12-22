import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/work/reviews - List all reviews with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const reviewerId = searchParams.get('reviewerId');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (taskId) where.taskId = taskId;
    if (reviewerId) where.reviewerId = reviewerId;
    if (status) where.status = status;

    const reviews = await prisma.workReview.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/work/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, reviewerId, rating, comment, status } = body;

    // Validation
    if (!taskId || !reviewerId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, reviewerId, rating' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if task exists and is completed
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only review completed tasks' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.workReview.create({
      data: {
        taskId,
        reviewerId,
        rating,
        comment: comment || null,
        status: status || 'PENDING',
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

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
