import React from 'react'

export type Props = Omit<React.DetailedHTMLProps<React.SVGAttributes<SVGElement>, SVGElement>, 'ref'>

export default function ChevronLeft({ ...props }: Props) {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>

}
