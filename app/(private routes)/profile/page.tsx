import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile - NoteHub',
  description: 'View and manage your personal NoteHub profile.',
  openGraph: {
    title: 'Profile - NoteHub',
    description: 'View and manage your personal NoteHub profile.',
    url: 'https://notehub.com/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Profile Open Graph Image',
      },
    ],
  },
};

export default async function ProfilePage() {
  const user = await getMe();

  // Запасне зображення на випадок, якщо аватар не задано в базі
  const defaultAvatar = 'https://ac.goit.global/fullstack/react/default-avatar.jpg';

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || defaultAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>
            Username: {user?.username || user?.name || 'N/A'}
          </p>
          <p>
            Email: {user?.email || 'N/A'}
          </p>
        </div>
      </div>
    </main>
  );
}