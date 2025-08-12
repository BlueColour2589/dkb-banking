import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface QuickAction {
  id: string;
  label: string;
  onClick: () => void;
  primary: boolean;
}

export interface Account {
  name: string;
  balance: number;
  currency: string;
  accountNumber: string;
}
