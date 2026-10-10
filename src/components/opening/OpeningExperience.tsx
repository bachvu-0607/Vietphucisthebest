import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import './opening.css';

const SEEN_KEY = 'vietphuc:opening:seen';

function shouldShowOpening() {
  try { return sessionStorage.getItem(SEEN_KEY) !== '1'; }
  catch { return true; }
}

function Opening({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root.current?.focus();
    import('./opening-engine.js').then(({ mountOpening }) => {
      if (cancelled || !root.current) return;
      cleanup = mountOpening(root.current, onComplete);
      setReady(true);
    }).catch(() => { if (!cancelled) onComplete(); });
    return () => {
      cancelled = true;
      cleanup?.();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onComplete]);

  return (
    <div id="vietphuc-opening" ref={root} role="dialog" aria-modal="true"
      aria-label="Chào mừng đến với Việt Phục" tabIndex={-1}
      onKeyDown={event => {
        if (event.key === 'Escape') onComplete();
        if (event.key === 'Tab') {
          const buttons = [...(root.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])]
            .filter(button => !button.disabled && !button.hidden && button.getClientRects().length > 0);
          if (!buttons.length) { event.preventDefault(); return; }
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          event.preventDefault();
          buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
        }
      }}>
      <div className="ts-stage">
        <div className="ts-film" aria-hidden="true"><div className="ts-fallback" /><div className="ts-canvas" /></div>
        <div className="ts-curtain" aria-hidden="true" />
        <div className="ts-invitation">
          <span>NAM PHỤC CHÍNH TÔNG</span>
          <h1>Việt Phục</h1>
          <button className="ts-open" type="button" disabled={!ready}>Khám phá <span aria-hidden="true">↗</span></button>
        </div>
        <button className="ts-skip" type="button" onClick={onComplete}>Bỏ qua</button>
        <span className="ts-status sr-only" role="status" aria-live="polite" />
      </div>
    </div>
  );
}

export function OpeningExperience({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(shouldShowOpening);
  const complete = useCallback(() => {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* Storage may be disabled. */ }
    setShow(false);
  }, []);
  return <>
    <div inert={show} aria-hidden={show || undefined}>{children}</div>
    {show && <Opening onComplete={complete} />}
  </>;
}
