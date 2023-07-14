import React from 'react'
import { clsx } from 'clsx'

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  // eslint-disable-next-line react/prop-types
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={clsx([ 'flex my-md w-full justify-center max-h-[88px] h-full', className ])}
    {...props}
  />
))

Footer.displayName = 'Footer'

const HourglassLoader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  // eslint-disable-next-line react/prop-types
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={clsx([ 'flex items-center gap-x-sm', className ])}
    {...props}
  >
    <img src={'/assets/svg/hourglass.svg'} alt={'Hourglass Icon'} className={'animate-custom-spin h-[30px] w-[18px]'} />
    <h2 className={clsx([ 'text-3xl font-amiri text-white mt-1.5' ])}>{children}</h2>
  </div>
))


HourglassLoader.displayName = 'HourglassLoader'

const ButtonWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  // eslint-disable-next-line react/prop-types
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={clsx([ 'flex items-center gap-x-3', className ])}
    {...props}
  >
    {children}
  </div>
))

ButtonWrapper.displayName = 'ButtonWrapper'


export { Footer, HourglassLoader, ButtonWrapper }
