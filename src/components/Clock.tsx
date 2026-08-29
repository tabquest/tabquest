import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../utils/redux/store';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const hideSeconds = useSelector(
    (state: RootState) => state.settings.hideSeconds,
  );
  const use12Hour = useSelector((state: RootState) => state.settings.use12Hour);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const rawH = time.getHours();
  const period = rawH >= 12 ? 'PM' : 'AM';
  const displayH = use12Hour ? rawH % 12 || 12 : rawH;
  const mm = String(time.getMinutes()).padStart(2, '0');
  const hh = String(displayH).padStart(2, '0');
  const ss = String(time.getSeconds()).padStart(2, '0');

  /* Shared typographic sizing — hours and minutes sit at the same baseline */
  const heroSize: React.CSSProperties = {
    fontSize: 'clamp(4.5rem, min(13vw, 17dvh), 13rem)',
    lineHeight: 1,
    letterSpacing: '-0.05em',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <div>
      {/* ── Main time row ── */}
      <div
        className="flex items-baseline select-none"
        aria-label={time.toLocaleTimeString()}
      >
        {/* Hours — bold, accent coloured */}
        <span
          style={{
            ...heroSize,
            fontWeight: 800,
            color: 'var(--tq-accent)',
          }}
        >
          {hh}
        </span>

        {/* Colon — hair-thin, very slow pulse */}
        <motion.span
          animate={{ opacity: [1, 0.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
          style={{
            ...heroSize,
            fontWeight: 100,
            color: 'rgba(255,255,255,.18)',
            margin: '0 0.03em',
          }}
        >
          :
        </motion.span>

        {/* Minutes — thin weight, near-white, strong contrast to bold hours */}
        <span
          style={{
            ...heroSize,
            fontWeight: 200,
            color: 'rgba(255,255,255,.92)',
          }}
        >
          {mm}
        </span>

        {/* Seconds — tiny, pinned to baseline */}
        {!hideSeconds && (
          <span
            style={{
              fontSize: 'clamp(1rem, min(2.4vw, 3dvh), 2.2rem)',
              fontWeight: 300,
              lineHeight: 1,
              color: 'rgba(255,255,255,.22)',
              letterSpacing: '-0.02em',
              alignSelf: 'flex-end',
              paddingBottom: '0.2em',
              marginLeft: '0.2em',
              fontVariantNumeric: 'tabular-nums',
            }}
            aria-hidden
          >
            :{ss}
          </span>
        )}

        {/* AM/PM badge */}
        {use12Hour && (
          <span
            style={{
              fontSize: 'clamp(0.7rem, min(1.4vw, 2dvh), 1.3rem)',
              fontWeight: 400,
              lineHeight: 1,
              color: 'rgba(255,255,255,.28)',
              letterSpacing: '0.06em',
              alignSelf: 'flex-end',
              paddingBottom: '0.25em',
              marginLeft: '0.3em',
            }}
            aria-hidden
          >
            {period}
          </span>
        )}
      </div>

      {/* ── Date line — thin, muted ── */}
      <p
        className="tq-date font-light mt-1 pl-[0.04em]"
        style={{ color: 'var(--tq-text-muted)' }}
      >
        {time.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
};

export default Clock;
