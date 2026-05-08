import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../utils/redux/hooks';

const DEFAULT_USERNAME = 'user_name';

const getGreeting = (hour: number): string => {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17) return 'Good evening';
  return 'Good evening';
};

const capitalize = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

// dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const getSubMessage = (hour: number, dayOfWeek: number): string => {
  const mondayMessages = [
    "New week, new wins. Let's make it count.",
    'Monday is a fresh start. Own it.',
    'The week is yours to shape.',
    'Start strong, finish stronger.',
    'Make this week your best one yet.',
  ];

  const wednesdayMessages = [
    'Halfway there. Keep pushing.',
    'Wednesday energy: unstoppable.',
    'Hump day is just a myth. Every day is a good day.',
  ];

  const fridayMessages = [
    'Almost there — make today count.',
    'End the week on a high note.',
    'Friday focus leads to a peaceful weekend.',
    'Finish strong. The weekend is watching.',
    'One great push and the week is yours.',
  ];

  const weekendMessages = [
    'Weekends are for recharging and creating.',
    'Rest is part of the process.',
    "Take a breath. You've earned it.",
    'Great ideas come when you slow down.',
    'The best developers take real breaks.',
    'Recharge today, dominate next week.',
    'Build something for fun today.',
  ];

  const midweekMessages = [
    'Stay in the zone today.',
    'Deep work creates big results.',
    'Focus is your superpower.',
    "One task at a time. You've got this.",
    "Build something you're proud of.",
    'Progress, not perfection.',
    'Every keystroke matters.',
    'Ship it. Improve it. Repeat.',
    'The best code is the code you write today.',
    'Great work happens in focused moments.',
    "You're closer to done than yesterday.",
    'Keep the momentum going.',
    'Ideas become real through execution.',
  ];

  const morningMessages = [
    'A great morning sets the tone for everything.',
    "Coffee, code, and clarity. Let's go.",
    'Morning light, clear mind.',
    'The quiet hours are the most powerful.',
    'Get one big thing done before noon.',
    'Mornings are for deep work.',
    'The world is still quiet — use it.',
  ];

  const afternoonMessages = [
    'Afternoon is perfect for momentum.',
    'Push through the afternoon dip.',
    'Second wind incoming.',
    'Afternoons reward consistency.',
    'Small wins in the afternoon add up.',
  ];

  const eveningMessages = [
    'Evenings are for reflection and creativity.',
    'What did you build today?',
    'Wind down well — tomorrow starts now.',
    'Review, refine, release.',
    'Great things ship in the evening.',
  ];

  const universalMessages = [
    'Build something the world needs.',
    'You are one commit away from something great.',
    'Every expert was once a beginner.',
    'Write code that tells a story.',
    'The best time to build is now.',
    'Small steps. Big results.',
    'Your work matters more than you know.',
    'Consistency beats intensity.',
    'Done is better than perfect.',
    'Shipping is a skill. Practice it.',
    'Open source is how we change the world.',
    'The best UI is the one that gets out of the way.',
    'Design for the user you wish you were.',
    'Good code is poetry.',
    'Build with intention.',
    "Every bug fixed makes someone's day better.",
    'Make it work. Make it right. Make it fast.',
    'Code is craft. Treat it that way.',
    'Your next feature might change everything.',
    'Build what matters to you.',
    'The most powerful tool is a focused mind.',
    "Today's problem is tomorrow's solved challenge.",
    'Simplicity is the ultimate sophistication.',
    'The details make the difference.',
    'A clean codebase is a happy codebase.',
    'Every line of code is a decision.',
    'Read more. Build more. Ship more.',
    'Your best work is still ahead of you.',
    'One PR at a time.',
    'The compound effect of daily effort is extraordinary.',
    'You are building the future, one tab at a time.',
  ];

  let subset: string[] = [];

  // Add day-of-week specific messages
  if (dayOfWeek === 1) {
    subset = subset.concat(mondayMessages);
  } else if (dayOfWeek === 3) {
    subset = subset.concat(wednesdayMessages, midweekMessages);
  } else if (dayOfWeek === 5) {
    subset = subset.concat(fridayMessages);
  } else if (dayOfWeek === 0 || dayOfWeek === 6) {
    subset = subset.concat(weekendMessages);
  } else {
    // Tuesday (2), Thursday (4)
    subset = subset.concat(midweekMessages);
  }

  // Add time-of-day specific messages
  if (hour >= 5 && hour < 12) {
    subset = subset.concat(morningMessages);
  } else if (hour >= 12 && hour < 17) {
    subset = subset.concat(afternoonMessages);
  } else {
    subset = subset.concat(eveningMessages);
  }

  // Always include universal messages
  subset = subset.concat(universalMessages);

  // Rotate hourly so it changes but doesn't shift on every render
  const index = Math.floor(Date.now() / (1000 * 60 * 60)) % subset.length;
  return subset[index];
};

const GreetingWidget = () => {
  const userName = useAppSelector((state) => state.settings.userName);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const greeting = getGreeting(hour);
  const isDefaultName = !userName || userName === DEFAULT_USERNAME;
  const displayName = isDefaultName ? null : capitalize(userName);
  const greetingText = displayName
    ? `${greeting}, ${displayName}.`
    : `${greeting}.`;
  const subMessage = getSubMessage(hour, dayOfWeek);

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
        className="mt-1.5 text-sm md:text-base font-light tracking-wide"
        style={{ color: 'var(--tq-text-secondary)', opacity: 0.8 }}
      >
        {subMessage}
      </p>
    </motion.div>
  );
};

export default GreetingWidget;
