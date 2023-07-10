import * as React from 'react'

import { cn } from '@/global/utils'
import { clsx } from 'clsx'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
// eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-3xl bg-card text-card-foreground shadow-sm',
      className,
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
// eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
// eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
// eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
// eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-8', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
// eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(' flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

const CardTimer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
// eslint-disable-next-line react/prop-types
  className,
  ...props
}, ref) => (
  <div className={clsx([ 'text-center', className ])} ref={ref} {...props}>
    <p
      className={clsx([ 'text-accent text-base', 'uppercase font-jost font-medium tracking-[1.4px]' ])}>Time
      Limit</p>
    <h1
      className={clsx([ 'text-accent text-[76px] leading-[121px]', 'uppercase font-amiri' ])}>01:00</h1>
  </div>
))

CardTimer.displayName = 'CardTimer'

const PlayerScoreBoard = ({ imgSrc }: { className?: string, imgSrc?: string }) => {
  console.log("imgSrc", imgSrc);
  return (
    <React.Fragment>
      {/*Player Opponent Card*/}
      <div className={clsx([ 'max-h-[130px] h-full', 'relative', 'bg-option-13', 'rounded-lg' ])}>
        <div className={clsx([ 'flex items-center gap-2', 'm-sm' ])}>
          {/*Player Opponent Image*/}

          <div
            className={clsx([ 'flex-none', 'w-[100px] h-[100px]', 'border border-[#2C3B47] rounded-full' ])}>
            <img src={imgSrc} alt={''}
                 className={clsx([ 'rounded-full', 'h-full w-full', 'object-cover object-top', { 'hidden': imgSrc === '' } ])} />
          </div>

          {/*Player Status Win / Loss*/}
          <div className={clsx([ 'flex items-center', 'w-full h-full' ])}>
            <div className={clsx([ 'flex flex-col w-full' ])}>
              <div
                className={clsx([ 'flex flex-row', 'text-[30px] text-left leading-[48px] text-accent', 'font-amiri' ])}>
                <h3 className={clsx([ 'basis-11/12', 'ml-md' ])}>Win</h3>
                <h3 className={clsx([ 'px-2', 'basis-1/12' ])}>0</h3>
              </div>

              <div
                className={clsx([ 'flex flex-row', 'text-[30px] leading-[48px] text-dangerAccent', 'font-amiri' ])}>
                <h3 className={clsx([ 'basis-11/12', 'ml-md' ])}>Loss</h3>
                <h3 className={clsx([ 'px-2', 'basis-1/12' ])}>0</h3>
              </div>
            </div>
          </div>
        </div>

        {/*Battle Points*/}
        <div className={clsx([ 'w-full', 'absolute -bottom-[1.8rem] left-0', 'px-2' ])}>
          <div
            className={clsx([ 'flex justify-between', 'px-2', 'border border-accent rounded-lg', 'bg-[#16150A]', 'text-[14px] leading-[32px] text-left text-option-11', 'font-segoe', 'tracking-[0.28px]' ])}>
            <p>???</p>
            <p>?BP</p>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
}


export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardTimer, PlayerScoreBoard }
