import React, { useState, useEffect } from 'react';

export default function TypingText({ text = '', speed = 12, className = '' }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown('');
    setDone(false);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className={className}>
      {shown}
      {!done && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-aiblue dark:bg-aiblue-light rounded-sm animate-glow-pulse" />
      )}
    </p>
  );
}