import React from 'react'

export default function GridStoryLayout({ children }: { children: React.ReactNode}) {
  return (
    <div className="flex-1 grid grid-cols-2 [&>section]:border [&>section]:border-gray-900">
      { children }
    </div>
  )
}
