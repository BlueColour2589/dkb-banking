// components/Sidebar/SidebarItem.tsx
import { FC } from 'react';
import Link from 'next/link';

interface SidebarItemProps {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ label, icon, href, active }) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer transition-colors ${
          active ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;
