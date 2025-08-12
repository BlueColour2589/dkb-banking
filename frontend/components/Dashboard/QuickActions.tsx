// components/Dashboard/QuickActions.tsx
import { FC } from 'react';
import Button from '@/components/Shared/Button';

const QuickActions: FC = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button label="Transfer" variant="primary" />
      <Button label="Pay Bills" variant="danger" />
    </div>
  );
};

export default QuickActions;
