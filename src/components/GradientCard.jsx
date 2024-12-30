import React from 'react';
import { motion } from 'motion/react';

export function GradientCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

