import React from 'react';
import css from './LayoutNotes.module.css';

interface LayoutNotesProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

// Додано слово export, щоб працював імпорт через { LayoutNotes }
export function LayoutNotes({ children, sidebar }: LayoutNotesProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      <main className={css.notesWrapper}>
        {children}
      </main>
    </div>
  );
}