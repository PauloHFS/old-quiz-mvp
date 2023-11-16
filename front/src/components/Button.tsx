import { ClassValue } from 'clsx';
import React from 'react';
import { classNames } from './utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className,
  variant = 'primary',
  ...props
}) => {
  const baseClasses: ClassValue =
    'inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  return (
    <button
      type={type}
      className={classNames(
        baseClasses,
        {
          'bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-500 focus-visible:ring-offset-blue-200 text-white':
            variant === 'primary',
          'bg-green-500 hover:bg-green-600 focus-visible:ring-green-500 focus-visible:ring-offset-green-200 text-white':
            variant === 'secondary',
          'bg-white hover:bg-gray-100 focus-visible:ring-gray-500 focus-visible:ring-offset-gray-200 text-gray-900 border-gray-300':
            variant === 'outline',
        },
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
