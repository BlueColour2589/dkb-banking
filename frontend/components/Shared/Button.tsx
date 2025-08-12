// components/Shared/Button.tsx
import { FC } from 'react';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'danger';
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ label, variant = 'primary', onClick }) => {
  const base = 'px-4 py-2 rounded-lg shadow transition font-medium';
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {label}
    </button>
  );
};

export default Button;
