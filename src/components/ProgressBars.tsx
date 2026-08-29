import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Progress {
  year: number;
  day: number;
}

const ProgressBars = () => {
  const [progress, setProgress] = useState<Progress>({ year: 0, day: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();

      const sy = new Date(now.getFullYear(), 0, 1);
      const ey = new Date(now.getFullYear() + 1, 0, 1);
      const year =
        ((now.getTime() - sy.getTime()) / (ey.getTime() - sy.getTime())) * 100;

      const sd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const ed = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const day =
        ((now.getTime() - sd.getTime()) / (ed.getTime() - sd.getTime())) * 100;

      setProgress({ year, day });
    };

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, []);

  const bars = [
    {
      key: 'year',
      value: progress.year,
      label: 'Y',
      color: 'var(--tq-progress-year)',
      glow: 'rgba(99,102,241,.45)',
    },
    {
      key: 'day',
      value: progress.day,
      label: 'D',
      color: 'var(--tq-progress-day)',
      glow: 'var(--tq-accent-glow)',
    },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginTop: '10px',
        maxWidth: '148px',
      }}
    >
      {bars.map(({ key, value, label, color, glow }) => (
        <div
          key={key}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {/* Hairline track */}
          <div
            style={{
              flex: 1,
              height: '1.5px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,.06)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                borderRadius: '9999px',
                background: color,
                boxShadow: `0 0 5px ${glow}`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>

          {/* Compact label */}
          <span
            style={{
              fontSize: '10px',
              fontWeight: 400,
              fontVariantNumeric: 'tabular-nums',
              color: 'rgba(255,255,255,.24)',
              minWidth: '3.8ch',
              letterSpacing: '0.01em',
            }}
          >
            {label} {Math.round(value)}%
          </span>
        </div>
      ))}
    </motion.div>
  );
};

export default ProgressBars;
