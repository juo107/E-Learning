import { useEffect, useRef, useState } from 'react';

type Props = {
  text: string;
  speedMs?: number; // time per character
  startDelayMs?: number;
  className?: string;
  retypeOnView?: boolean; // re-trigger typing when entering viewport
};

export default function TypingText({ text, speedMs = 15, startDelayMs = 150, className, retypeOnView = true }: Props) {
  const [display, setDisplay] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const timersRef = useRef<{ start?: number; interval?: number }>({});

  const clearTimers = () => {
    if (timersRef.current.start) {
      clearTimeout(timersRef.current.start);
      timersRef.current.start = undefined;
    }
    if (timersRef.current.interval) {
      clearInterval(timersRef.current.interval);
      timersRef.current.interval = undefined;
    }
  };

  const startTyping = () => {
    clearTimers();
    setDisplay('');
    setIsTyping(true);
    let i = 0;
    timersRef.current.start = window.setTimeout(() => {
      timersRef.current.interval = window.setInterval(() => {
        i += 1;
        setDisplay(text.slice(0, i));
        if (i >= text.length) {
          if (timersRef.current.interval) clearInterval(timersRef.current.interval);
          timersRef.current.interval = undefined;
          setIsTyping(false);
        }
      }, speedMs);
    }, startDelayMs);
  };

  useEffect(() => {
    startTyping();
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speedMs, startDelayMs]);

  useEffect(() => {
    if (!retypeOnView) return;
    const node = rootRef.current;
    if (!node) return;
    let lastVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const nowVisible = entry.isIntersecting;
        // Re-trigger when entering viewport from not visible state
        if (nowVisible && !lastVisible) {
          startTyping();
        }
        lastVisible = nowVisible;
      },
      { root: null, threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retypeOnView, text, speedMs, startDelayMs]);

  const showCaret = isTyping; // Hide caret when finished for a cleaner look

  return (
    <span ref={rootRef} className={className}>
      {display}
      {showCaret && (
        <span className="ml-0.5 inline-block w-[1px] h-[1em] align-middle bg-current animate-pulse" aria-hidden="true" />
      )}
    </span>
  );
}


