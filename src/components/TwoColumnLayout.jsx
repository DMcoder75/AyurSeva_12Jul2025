import React from 'react';

const TwoColumnLayout = ({ 
  children, 
  sidebar, 
  className = "",
  mainClassName = "",
  sidebarClassName = "" 
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content - Takes 3/4 of the width on large screens */}
        <div className={`lg:col-span-3 ${mainClassName}`}>
          {children}
        </div>
        
        {/* Sidebar - Takes 1/4 of the width on large screens */}
        <div className={`lg:col-span-1 ${sidebarClassName}`}>
          <div className="space-y-6">
            {sidebar}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;

