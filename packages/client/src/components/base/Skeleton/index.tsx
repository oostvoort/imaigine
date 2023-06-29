import { cn } from '@/global/utils'
import React from 'react'

function Skeleton({
  // eslint-disable-next-line react/prop-types
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse', className)}
      {...props}
    />
  )
}

function SkeletonParagraph(){
  return(
    <>
      <Skeleton className={'bg-[#485476] rounded-[4px] w-full h-[30px] mb-4'}/>
      <Skeleton className={'bg-[#485476] rounded-[4px] w-full h-[30px] mb-4'}/>
      <Skeleton className={'bg-[#485476] rounded-[4px] w-4/12 h-[30px] mb-4'}/>
    </>
  )
}

export { Skeleton, SkeletonParagraph }
