import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

export default function DonorCard({ donor, showActions = false, onContact, isOwner = false, onEdit }) {
    return (
        <Card hover className="h-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle>{donor.name}</CardTitle>
                        <Badge variant="blood" className="mt-2">
                            {donor.blood_group}
                        </Badge>
                    </div>
                    {donor.available ? (
                        <Badge variant="available">Available</Badge>
                    ) : (
                        <Badge variant="default" className="bg-gray-100 text-gray-600">
                            Unavailable
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center text-text-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{donor.city}, {donor.district}</span>
                    </div>

                    {donor.phone && (
                        <div className="flex items-center text-text-secondary">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{donor.phone}</span>
                        </div>
                    )}

                    {donor.last_donated && (
                        <div className="flex items-center text-text-light text-xs">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Last donated: {new Date(donor.last_donated).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {showActions && (onContact || (isOwner && onEdit)) && (
                    <div className="mt-4 flex gap-2">
                        {onContact && (
                            <Button variant="secondary" size="sm" className="flex-1" onClick={() => {
                                if (confirm(`Call donor ${donor.name} at ${donor.phone}?`)) {
                                    window.location.href = `tel:${donor.phone}`;
                                }
                            }}>
                                Contact Donor
                            </Button>
                        )}
                        {isOwner && onEdit && (
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(donor)}>
                                Edit My Info
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
