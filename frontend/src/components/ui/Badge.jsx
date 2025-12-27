import React from 'react';

export const Badge = ({
    children,
    variant = 'default',
    className = '',
    ...props
}) => {
    const baseClasses = 'badge';

    const variantClasses = {
        default: 'bg-gray-100 text-text-secondary border border-gray-200',
        admin: 'badge-admin',
        donor: 'badge-donor',
        recipient: 'badge-recipient',
        available: 'badge-available',
        blocked: 'badge-blocked',
        blood: 'badge-blood',
        urgent: 'bg-status-urgent text-white border border-red-700',
    };

    return (
        <span
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
