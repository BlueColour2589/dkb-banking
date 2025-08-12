import { FC } from 'react';

const Greeting: FC = () => {
  const hour = new Date().getHours();
  let greeting = 'Good morning';

  if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
  else if (hour >= 18) greeting = 'Good evening';

  return (
    <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
      {greeting}, Celestina White & Mark Peters
    </div>
  );
};

export default Greeting;
