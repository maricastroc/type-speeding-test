import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSelected?: boolean;
}

export const Button = ({
  children,
  isLoading = false,
  isSelected = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'px-3 py-1 rounded-lg bg-blue-600 cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${className} ${!isSelected && 'bg-transparent border border-neutral-700 text-neutral-400 rounded-md hover:border-blue-400 hover:text-blue-400 transition-all'}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
