'use client';

import { useState } from 'react';

interface ReviewFormProps {
    taskId: string;
    reviewerId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: {
        rating: number;
        comment: string;
        status: string;
    };
    reviewId?: string;
}

export default function ReviewForm({
    taskId,
    reviewerId,
    onSuccess,
    onCancel,
    initialData,
    reviewId,
}: ReviewFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [comment, setComment] = useState(initialData?.comment || '');
    const [status, setStatus] = useState(initialData?.status || 'PENDING');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating < 1 || rating > 5) {
            setError('Please select a rating between 1 and 5');
            return;
        }

        setIsSubmitting(true);

        try {
            const url = reviewId
                ? `/api/work/reviews/${reviewId}`
                : '/api/work/reviews';
            const method = reviewId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskId,
                    reviewerId,
                    rating,
                    comment,
                    status,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save review');
            }

            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Rating */}
            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-slate-300'
                                }`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-slate-600 mt-2">
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Very Good'}
                        {rating === 5 && 'Excellent'}
                    </p>
                )}
            </div>

            {/* Status */}
            <div>
                <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                >
                    Status <span className="text-red-500">*</span>
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="PENDING">Pending Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="NEEDS_REVISION">Needs Revision</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Comment */}
            <div>
                <label
                    htmlFor="comment"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                >
                    Comment
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Add your review comments here..."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Saving...' : reviewId ? 'Update Review' : 'Submit Review'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
