import React from 'react';


interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode; 
  modal?: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className="filter-layout-container">
      {sidebar && <aside>{sidebar}</aside>}
      <div className="filter-content">{children}</div>
    </div>
  );
}