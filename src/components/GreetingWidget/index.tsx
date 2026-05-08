import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../utils/redux/hooks';

const DEFAULT_USERNAME = 'user_name';

const getGreeting = (hour: number): string => {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
};

const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const GreetingWidget = () => {
  const userName = useAppSelector((state) => state.settings.userName);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting(now.getHours());
  const isDefaultName = !userName || userName === DEFAULT_USERNAME;
  const displayName = isDefaultName ? null : capitalize(userName);
  const greetingText = displayName
    ? `${greeting}, ${displayName}.`
    : `${greeting}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <h1
        className="text-3xl md:text-4xl font-light tracking-wide"
        style={{ color: 'var(--tq-text-primary)' }}
      >
        {greetingText}
      </h1>
      <p
        className="mt-1 text-sm tracking-wide"
        style={{ color: 'var(--tq-text-secondary)' }}
      >
        {formatDate(now)}
      </p>
    </motion.div>
  );
};

export default GreetingWidget;
