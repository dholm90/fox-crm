import React from 'react';
import { motion } from 'motion/react';

export function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`space-y-4 text-center ${className}`}
    >
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-400">{subtitle}</p>}
    </motion.div>
  );
}

