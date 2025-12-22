'use client';

import { useState, useEffect } from 'react';
import ReviewCard from '@/components/work/ReviewCard';
import ReviewForm from '@/components/work/ReviewForm';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    assignedTo: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    project: {
        id: string;
        name: string;
    };
}

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    task: Task;
    reviewer: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: string;
    };
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<string>('');
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Mock current user - replace with actual auth
    const currentUserId = 'mock-user-id';

    useEffect(() => {
        fetchReviews();
        fetchCompletedTasks();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/work/reviews');
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCompletedTasks = async () => {
        try {
            // This would need a new API endpoint to fetch completed tasks
            // For now, we'll leave it empty
            setCompletedTasks([]);
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    const handleCreateReview = () => {
        setShowCreateForm(true);
        setEditingReview(null);
    };

    const handleEditReview = (reviewId: string) => {
        const review = reviews.find((r) => r.id === reviewId);
        if (review) {
            setEditingReview(review);
            setShowCreateForm(true);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/work/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchReviews();
            } else {
                alert('Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('An error occurred while deleting the review');
        }
    };

    const handleFormSuccess = () => {
        setShowCreateForm(false);
        setEditingReview(null);
        setSelectedTask('');
        fetchReviews();
    };

    const filteredReviews = reviews.filter((review) => {
        if (filterStatus === 'all') return true;
        return review.status === filterStatus;
    });

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-slate-600">Loading reviews...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Work Reviews</h1>
                <p className="text-slate-600">
                    Review and provide feedback on completed work
                </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                    onClick={handleCreateReview}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    + Create Review
                </button>

                {/* Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="NEEDS_REVISION">Needs Revision</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Create/Edit Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            {editingReview ? 'Edit Review' : 'Create New Review'}
                        </h2>

                        {!editingReview && (
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    Select Task <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedTask}
                                    onChange={(e) => setSelectedTask(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Choose a completed task...</option>
                                    {completedTasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title} - {task.project.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-slate-500 mt-2">
                                    Note: Only completed tasks are available for review
                                </p>
                            </div>
                        )}

                        {(selectedTask || editingReview) && (
                            <ReviewForm
                                taskId={editingReview?.task.id || selectedTask}
                                reviewerId={currentUserId}
                                onSuccess={handleFormSuccess}
                                onCancel={() => {
                                    setShowCreateForm(false);
                                    setEditingReview(null);
                                    setSelectedTask('');
                                }}
                                initialData={
                                    editingReview
                                        ? {
                                            rating: editingReview.rating,
                                            comment: editingReview.comment || '',
                                            status: editingReview.status,
                                        }
                                        : undefined
                                }
                                reviewId={editingReview?.id}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                    <div className="text-slate-400 text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No reviews found
                    </h3>
                    <p className="text-slate-600 mb-6">
                        {filterStatus === 'all'
                            ? 'Get started by creating your first review'
                            : `No reviews with status "${filterStatus}"`}
                    </p>
                    {filterStatus === 'all' && (
                        <button
                            onClick={handleCreateReview}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create First Review
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onEdit={handleEditReview}
                            onDelete={handleDeleteReview}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-slate-900">
                        {reviews.length}
                    </div>
                    <div className="text-sm text-slate-600">Total Reviews</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-900">
                        {reviews.filter((r) => r.status === 'APPROVED').length}
                    </div>
                    <div className="text-sm text-green-700">Approved</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-900">
                        {reviews.filter((r) => r.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-yellow-700">Pending</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-slate-900">
                        {reviews.length > 0
                            ? (
                                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                            ).toFixed(1)
                            : '0.0'}
                    </div>
                    <div className="text-sm text-slate-600">Avg Rating</div>
                </div>
            </div>
        </div>
    );
}
