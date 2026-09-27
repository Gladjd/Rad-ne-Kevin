'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate = '2026-06-20T15:00:00+02:00',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isClient) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto opacity-0">
        <div className="h-20 bg-white/20 rounded-2xl" />
      </div>
    );
  }

  const units = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Secondes', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto">
      {units.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative group"
        >
          <div className="glass-card-gold rounded-2xl p-3 sm:p-5 text-center transition-all duration-300 transform group-hover:-translate-y-1 shadow-sm group-hover:shadow-gold">
            <span className="block font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-gold-200">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="block font-sans text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">
              {unit.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
