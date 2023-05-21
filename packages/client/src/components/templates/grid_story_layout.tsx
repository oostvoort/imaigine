import React from 'react'

export default function GridStoryLayout({ children }: { children: React.ReactNode}) {
  return (
    <div className="flex-1 flex flex-col [&>section]:border [&>section]:border-gray-900">
      { children }
    </div>
  )
}
