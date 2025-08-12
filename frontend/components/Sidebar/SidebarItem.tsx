'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { SidebarItemProps } from './types';

export default function SidebarItem({ label, icon, href }: SidebarItemProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-md text-lg font-medium transition',
        pathname === href
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
