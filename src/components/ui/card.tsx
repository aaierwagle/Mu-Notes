import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground',
      'transition-all duration-300 ease-in-out',
      'shadow-md hover:shadow-lg',
      'hover:border-blue-200 hover:bg-blue-50/30',
      'dark:bg-gray-800 dark:border-gray-700',
      'dark:hover:border-blue-800 dark:hover:bg-blue-900/20',
      'backdrop-blur-sm backdrop-filter',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 p-6',
      'border-b border-gray-100 dark:border-gray-700',
      'group-hover:border-blue-100 dark:group-hover:border-blue-800',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-bold leading-none tracking-tight',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-300',
      'group-hover:text-blue-800 dark:group-hover:text-blue-200',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-muted-foreground',
      'leading-relaxed',
      'transition-colors duration-300',
      'dark:text-gray-400',
      'group-hover:text-blue-600 dark:group-hover:text-blue-300',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      'p-6 pt-0',
      'prose dark:prose-invert max-w-none',
      'transition-colors duration-300',
      'group-hover:prose-blue dark:group-hover:prose-blue',
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-6 pt-0',
      'border-t border-gray-100 dark:border-gray-700',
      'group-hover:border-blue-100 dark:group-hover:border-blue-800',
      'mt-6 justify-end gap-4',
      'transition-colors duration-300',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};