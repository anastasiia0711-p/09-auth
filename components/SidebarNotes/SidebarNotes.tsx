'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import css from './SidebarNotes.module.css'; // <--- Обов'язково має бути цей рядок!

const tags = [
  { label: 'All notes', value: 'all' },
  { label: 'Todo', value: 'Todo' },
  { label: 'Work', value: 'Work' },
  { label: 'Personal', value: 'Personal' },
  { label: 'Meeting', value: 'Meeting' },
  { label: 'Shopping', value: 'Shopping' },
];

export function SidebarNotes() {
  const params = useParams();
  const currentTag = typeof params.tag === 'string' ? params.tag : 'all';

  return (
    <aside className={css.sidebar}>
      <h3 className={css.title}>Filters</h3>
      <ul className={css.list}>
        {tags.map((tag) => {
          const isActive = currentTag.toLowerCase() === tag.value.toLowerCase();

          return (
            <li key={tag.value} className={css.item}>
              <Link
                href={`/notes/filter/${tag.value}`}
                className={`${css.link} ${isActive ? css.active : ''}`}
              >
                {tag.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}