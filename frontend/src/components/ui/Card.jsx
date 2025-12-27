import React from 'react';

export const Card = ({
    children,
    hover = false,
    className = '',
    ...props
}) => {
    return (
        <div
            className={`card ${hover ? 'card-hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold text-text ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`text-text-secondary ${className}`}>
            {children}
        </div>
    );
};

export default Card;
