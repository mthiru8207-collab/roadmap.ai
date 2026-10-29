import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudyTimerProps {
  onSessionComplete?: (minutes: number) => void;
  className?: string;
  variant?: 'compact' | 'expanded';
}

type TimerMode = 25 | 50 | 5 | 15;

export const StudyTimer: React.FC<StudyTimerProps> = ({
  onSessionComplete,
  className = '',
  variant = 'compact',
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<TimerMode>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return parseInt(localStorage.getItem(`roadmap_ai_sessions_${today}`) || '0', 10);
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle Web Audio chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // AudioContext unavailable
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();

            // Track completed sessions
            const today = new Date().toISOString().split('T')[0];
            const updated = completedSessions + 1;
            setCompletedSessions(updated);
            try {
              localStorage.setItem(`roadmap_ai_sessions_${today}`, updated.toString());
            } catch {
              // ignore
            }

            if (onSessionComplete) {
              onSessionComplete(selectedMinutes);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedMinutes, soundEnabled, completedSessions, onSessionComplete]);

  const handleModeChange = (mode: TimerMode) => {
    setSelectedMinutes(mode);
    setIsRunning(false);
    setTimeLeftSeconds(mode * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(selectedMinutes * 60);
  };

  const toggleRunning = () => {
    if (timeLeftSeconds === 0) {
      setTimeLeftSeconds(selectedMinutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeftSeconds) / totalSeconds) * 100);

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card shadow-subtle ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-ink dark:text-dark-ink">
          <Clock className={`w-3.5 h-3.5 ${isRunning ? 'text-vermilion animate-pulse' : 'text-graphite dark:text-dark-muted'}`} />
          <span className="tabular-nums tracking-wider">{formattedTime}</span>
        </div>

        <button
          onClick={toggleRunning}
          className={`p-1 rounded text-xs transition-colors ${
            isRunning
              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
              : 'bg-vermilion hover:bg-vermilion-dark text-white'
          }`}
          title={isRunning ? 'Pause Pomodoro Timer' : 'Start Focus Session (25 min)'}
          aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>

        <button
          onClick={handleReset}
          className="p-1 rounded text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink hover:bg-paper-tint dark:hover:bg-dark-surface transition-colors"
          title="Reset timer"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>

        {completedSessions > 0 && (
          <span
            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sage-light dark:bg-sage/20 text-sage-dark dark:text-sage border border-sage/30 hidden sm:inline-block"
            title={`${completedSessions} focus block(s) completed today`}
          >
            {completedSessions}x Focus
          </span>
        )}
      </div>
    );
  }

  // Expanded View
  return (
    <div className={`p-6 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-card shadow-subtle space-y-5 ${className}`}>
      <div className="flex items-center justify-between border-b border-stone-light dark:border-dark-border pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-vermilion" />
          <span className="font-mono text-xs uppercase tracking-wider text-ink dark:text-dark-ink font-bold">
            Pomodoro Focus Companion
          </span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink hover:bg-paper-tint dark:hover:bg-dark-surface transition-colors"
          title={soundEnabled ? 'Chime sound enabled' : 'Muted'}
        >
          {soundEnabled ? <Bell className="w-3.5 h-3.5 text-vermilion" /> : <BellOff className="w-3.5 h-3.5 text-graphite" />}
        </button>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center justify-center gap-2">
        {[
          { label: '25m Focus', value: 25 as TimerMode },
          { label: '50m Deep', value: 50 as TimerMode },
          { label: '5m Rest', value: 5 as TimerMode },
          { label: '15m Break', value: 15 as TimerMode },
        ].map((m) => (
          <button
            key={m.value}
            onClick={() => handleModeChange(m.value)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              selectedMinutes === m.value
                ? 'bg-ink dark:bg-dark-ink text-paper dark:text-dark-bg font-bold shadow-xs'
                : 'bg-paper-tint dark:bg-dark-surface text-graphite dark:text-dark-muted hover:text-ink dark:hover:text-dark-ink border border-stone-light dark:border-dark-border'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Huge Editorial Digital Display */}
      <div className="text-center py-4 bg-paper dark:bg-dark-bg rounded border border-stone-light dark:border-dark-border relative overflow-hidden">
        {/* Subtle background progress bar */}
        <div
          className="absolute left-0 bottom-0 top-0 bg-vermilion/10 dark:bg-vermilion/15 transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="relative z-10">
          <div className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-ink dark:text-dark-ink tabular-nums">
            {formattedTime}
          </div>
          <div className="text-[10px] font-mono text-graphite dark:text-dark-muted uppercase tracking-widest mt-1">
            {isRunning ? 'FOCUS SESSION ACTIVE' : 'PAUSED // READY'} &bull; {progressPercent}% ELAPSED
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleRunning}
          className={`px-6 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-subtle ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-vermilion hover:bg-vermilion-dark text-white'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded border border-stone dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-paper-tint dark:hover:bg-dark-subtle text-xs font-mono font-semibold text-ink dark:text-dark-ink flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-graphite dark:text-dark-muted" />
          <span>Reset</span>
        </button>
      </div>

      {/* Daily Progress Counter */}
      <div className="pt-2 border-t border-stone-light dark:border-dark-border flex items-center justify-between text-[11px] font-mono text-graphite dark:text-dark-muted">
        <span>TODAY'S MASTERY BLOCKS:</span>
        <span className="font-bold text-ink dark:text-dark-ink flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark dark:text-sage" />
          {completedSessions} Sessions ({completedSessions * 25} min)
        </span>
      </div>
    </div>
  );
};

