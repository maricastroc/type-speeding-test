import { Button } from './ui/button';
import type { ButtonHTMLAttributes } from 'react';

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const CloseButton = ({ isLoading, className, ...props }: CloseButtonProps) => (
  <Button variant="destructive" size="md" isLoading={isLoading} className={className} {...props} />
);
