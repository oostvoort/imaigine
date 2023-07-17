import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/global/utils'
import { clsx } from 'clsx'


const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50 disabled:pointer-events-none font-jost',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input text-primary-foreground hover:bg-background hover:text-primary-foreground/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-primary/20 hover:text-primary-foreground/80',
        link: 'underline-offset-4 hover:underline text-primary',
        accent: 'bg-white text-accent-3 hover:bg-white/80',
        selective: 'bg-primary font-normal tracking-wide font-sans hover:bg-primary/80',
        neutral: clsx([ 'text-center text-3xl leading-[48px] text-option-8', 'font-amiri', 'bg-btnNeutral bg-no-repeat bg-center hover:bg-btnNeutralHover' ]),
        neutralSm: clsx([ 'text-center text-xl leading-[32px] text-option-8', 'font-amiri', 'bg-btnNeutral bg-no-repeat bg-center hover:bg-btnNeutralHover' ]),
        good: clsx([ 'text-center text-3xl leading-[48px] text-option-8', 'font-amiri', 'bg-btnGood bg-no-repeat bg-center hover:bg-btnGoodHover' ]),
        evil: clsx([ 'text-center text-3xl leading-[48px] text-option-8', 'font-amiri', 'bg-btnEvil bg-no-repeat bg-center hover:bg-btnEvilHover' ]),
        modalClose: clsx([ '' ]),
        menu: clsx([ 'text-option-8 text-left text-xl', 'font-amiri', 'leading-8' ]),
        loading: clsx([ 'animate-pulse bg-muted text-muted' ]),
        refresh: clsx([ 'p-3 ', 'font-segoe', 'text-[14px] leading-8 text-option-11' ]),
        icon: '',
        battle: clsx([ 'bg-battleBtn ', 'gap-x-[10px] text-option-8 text-left text-xl', 'font-amiri', 'leading-8' ]),
      },
      size: {
        sm: 'h-9 px-3 rounded-md text-sm',
        default: 'h-10 py-2 px-4 text-md',
        lg: 'h-12 px-8 py-8 rounded-lg text-lg',
        xl: 'h-16 px-12 rounded-lg text-2xl',
        '2xl': 'h-20 px-12',
        'btnWithBgImg': 'w-[518px] h-[88px]',
        'menu': 'w-[170px] h-[67px] gap-x-2',
        'icon': 'w-[24px] h-[24px]',
        'battle': 'w-[297px] h-full',
      },
      isHighlighted: {
        true: 'outline outline-accent text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode,
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isHighlighted, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, isHighlighted, className }))}
        ref={ref}
        {...props}
      >{children}</button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
