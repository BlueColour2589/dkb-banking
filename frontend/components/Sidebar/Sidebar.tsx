// components/Sidebar/Sidebar.tsx
import SidebarItem from './SidebarItem';
import { SidebarItemProps } from './types';

const navItems: SidebarItemProps[] = [
  { label: 'Dashboard', icon: '🏠', href: '/' },
  { label: 'Account', icon: '💳', href: '/account' },
  { label: 'Transactions', icon: '📄', href: '/transactions' },
  { label: 'Settings', icon: '⚙️', href: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700">
      <nav className="space-y-4">
        {navItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
