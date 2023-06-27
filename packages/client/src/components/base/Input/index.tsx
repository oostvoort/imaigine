import * as React from 'react'

import { cn } from '@/global/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'

const inputVariants = cva(
  clsx([ 'flex items-center', 'relative', 'w-full', 'py-5 pl-4 pr-[12rem]', 'ring-offset-background', 'outline-0', 'font-amiri text-3xl', 'placeholder:text-option-11', 'border-b-4 border-option-12' ]),
  {
    variants: {
      variant: {
        default: clsx([ 'bg-option-13', 'rounded-lg outline-option-9  outline outline-[1px]' ]),
        evil: clsx([ 'bg-option-13', 'rounded-lg outline-option-14  outline outline-[1px]' ]),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface InputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, VariantProps<typeof inputVariants> {
  children?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <>
        <label className={'relative'}>
          <p
            className={clsx([ 'absolute top-[48%] -right-16 -translate-x-2/4 -translate-y-2/4 z-50', 'text-right uppercase text-option-12' ])}>50
            characters
            max</p>
          <input
            type={type}
            className={cn(
              inputVariants({ variant, className }),
            )}
            ref={ref}
            {...props}
          />
        </label>

      </>

    )
  },
)
Input.displayName = 'Input'

export { Input }
