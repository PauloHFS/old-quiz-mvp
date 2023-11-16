import React, { forwardRef } from 'react';
import { classNames } from './utils';

interface InputContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

const Container: React.FC<InputContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={classNames('flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
};

interface InputLabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

const Label: React.FC<InputLabelProps> = ({ children, ...props }) => {
  return <label {...props}>{children}</label>;
};

interface InputComponentProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  hasError?: boolean;
}

const Component = forwardRef<HTMLInputElement, InputComponentProps>(
  ({ hasError = false, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={classNames(
          'rounded-md py-1 px-2 border',
          {
            'border-2 border-red-600': hasError,
          },
          className
        )}
        {...props}
      />
    );
  }
);

interface InputErrorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  hasError: boolean;
}

const Error: React.FC<InputErrorProps> = ({
  hasError = false,
  className,
  children,
  ...props
}) => {
  if (!hasError) {
    return null;
  }

  return (
    <span className={classNames('text-red-600', className)} {...props}>
      {children}
    </span>
  );
};

export const Input = {
  Container,
  Label,
  Component,
  Error,
};
