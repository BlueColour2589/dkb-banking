// components/Sidebar/Sidebar.tsx
import { FC } from 'react';
import SidebarItem from './SidebarItem';

const Sidebar: FC = () => {
  const items = [
    { label: 'Dashboard', icon: '🏠', href: '/', active: true },
    { label: 'My Account', icon: '👤', href: '/account' },
    { label: 'Transactions', icon: '💳', href: '/transactions' },
    { label: 'Reports', icon: '📊', href: '/reports' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white shadow-md p-4">
      <div className="text-2xl font-bold mb-6">Banking</div>
      <nav className="space-y-2">
        {items.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
