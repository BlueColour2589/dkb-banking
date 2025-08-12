// components/Shared/Avatar.tsx
import { FC } from 'react';

interface AvatarProps {
  name: string;
  imageUrl?: string;
}

const Avatar: FC<AvatarProps> = ({ name, imageUrl }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={imageUrl || '/default-avatar.png'}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{name}</span>
    </div>
  );
};

export default Avatar;
