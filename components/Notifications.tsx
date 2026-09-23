'use client';

import { AnimatePresence, motion } from 'framer-motion';

export type Notice = { id: number; message: string };

export default function Notifications({ notices }: { notices: Notice[] }) {
  return (
    <div className="notifications" aria-live="polite">
      <AnimatePresence initial={false}>
        {notices.map((notice) => (
          <motion.div key={notice.id} className="system-notice" initial={{ opacity: 0, y: 15, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, x: 25 }}>
            <span className="notice-icon">✓</span>{notice.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
