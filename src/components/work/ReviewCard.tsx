'use client';

interface ReviewCardProps {
    review: {
        id: string;
        rating: number;
        comment: string | null;
        status: string;
        createdAt: string;
        updatedAt: string;
        task: {
            id: string;
            title: string;
            description: string | null;
            status: string;
            assignedTo: {
                id: string;
                name: string | null;
                email: string;
                image: string | null;
            } | null;
            project: {
                id: string;
                name: string;
            };
        };
        reviewer: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
            role: string;
        };
    };
    onEdit?: (reviewId: string) => void;
    onDelete?: (reviewId: string) => void;
    currentUserId?: string;
}

export default function ReviewCard({
    review,
    onEdit,
    onDelete,
    currentUserId,
}: ReviewCardProps) {
    const canEdit = currentUserId === review.reviewer.id;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'NEEDS_REVISION':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'Approved';
            case 'REJECTED':
                return 'Rejected';
            case 'NEEDS_REVISION':
                return 'Needs Revision';
            default:
                return 'Pending';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {review.task.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                        Project: <span className="font-medium">{review.task.project.name}</span>
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        review.status
                    )}`}
                >
                    {getStatusLabel(review.status)}
                </span>
            </div>

            {/* Task Assignee */}
            {review.task.assignedTo && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                        {review.task.assignedTo.image ? (
                            <img
                                src={review.task.assignedTo.image}
                                alt={review.task.assignedTo.name || ''}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            review.task.assignedTo.name?.[0]?.toUpperCase() || 'U'
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">
                            {review.task.assignedTo.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-500">Task Assignee</p>
                    </div>
                </div>
            )}

            {/* Rating */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`text-xl ${star <= review.rating ? 'text-yellow-400' : 'text-slate-300'
                                    }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        {review.rating}/5
                    </span>
                </div>
            </div>

            {/* Comment */}
            {review.comment && (
                <div className="mb-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                        {review.reviewer.image ? (
                            <img
                                src={review.reviewer.image}
                                alt={review.reviewer.name || ''}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            review.reviewer.name?.[0]?.toUpperCase() || 'R'
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-900">
                            {review.reviewer.name || 'Unknown Reviewer'}
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                    </div>
                </div>

                {/* Actions */}
                {canEdit && (onEdit || onDelete) && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(review.id)}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(review.id)}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
