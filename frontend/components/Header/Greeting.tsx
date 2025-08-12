import { FC } from 'react';

const Greeting: FC = () => {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
  else if (hour >= 18) greeting = 'Good evening';

  return (
    <h2 className="text-4xl font-bold text-blue-600 mb-8">
      {greeting}, Celestina White & Mark Peters!
    </h2>
  );
};

export default Greeting;
