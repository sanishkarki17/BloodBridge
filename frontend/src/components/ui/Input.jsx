import React from 'react';

export const Input = React.forwardRef(({
    label,
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="label">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-primary-red">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
