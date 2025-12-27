import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

export default function RequestCard({ request, showActions = false, onEdit, onDelete, isOwner = false }) {
    return (
        <Card hover className="h-full border-l-4 border-primary-red">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle>{request.name}</CardTitle>
                        <Badge variant="blood" className="mt-2">
                            {request.blood_group}
                        </Badge>
                    </div>
                    <Badge variant="urgent" className="animate-pulse">
                        Urgent
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center text-text-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">{request.hospital || 'Hospital not specified'}</span>
                    </div>

                    <div className="flex items-center text-text-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{request.city}, {request.district}</span>
                    </div>

                    {request.phone && (
                        <div className="flex items-center text-text-secondary">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium">{request.phone}</span>
                        </div>
                    )}

                    <div className="flex items-center text-text-light text-xs">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Posted: {new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                {showActions && isOwner && (
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(request)}>
                            Edit
                        </Button>
                        <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(request.id)}>
                            Delete
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
