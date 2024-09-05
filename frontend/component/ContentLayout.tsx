import React from 'react'

interface ContentLayoutProps {
  children: React.ReactNode
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ children }) => {
  return (
    <div className="max-w-[85rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 ">
      <div>
        {children}
      </div>
    </div>
  )
}

export default ContentLayout