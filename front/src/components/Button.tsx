import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Primary: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Button = {
  Primary,
};
