// Dashboard component type definitions

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems?: NavItem[];
}

// Additional dashboard-related types
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
