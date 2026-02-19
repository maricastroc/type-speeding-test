import { ButtonHTMLAttributes } from 'react';

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const CloseButton = ({
  children,
  isLoading = false,
  className = '',
  ...props
}: CloseButtonProps) => {
  const baseClasses =
    'px-3 py-1 w-full rounded-xl bg-red-500 cursor-pointer py-2 hover:brightness-90 transition-all duration-200';

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
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
