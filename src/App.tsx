import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Activity, Terminal, Cpu, AlertTriangle } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toISOString()), 100);
    return () => clearInterval(timer);
  }, []);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-glitch-black relative font-pixel">
      {/* Glitch Overlays */}
      <div className="static-overlay" />
      <div className="screen-tear" style={{ animationDelay: '0.5s' }} />
      <div className="screen-tear" style={{ animationDelay: '1.2s', height: '2px', background: 'rgba(255, 0, 255, 0.3)' }} />
      
      {/* System Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-6xl mb-8 z-10 flex flex-col md:flex-row justify-between items-end border-b-2 border-glitch-magenta pb-4"
      >
        <div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter glitch-text" data-text="SERPENT.EXE">
            SERPENT.EXE
          </h1>
          <p className="text-glitch-magenta text-sm mt-2 tracking-[0.5em] animate-pulse">
            [ STATUS: UNSTABLE // CORE_TEMP: CRITICAL ]
          </p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-glitch-cyan text-xs opacity-50 mb-1">SYSTEM_TIME_STAMP</div>
          <div className="text-glitch-cyan text-xl">{systemTime}</div>
        </div>
      </motion.header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        {/* DATA_STREAM - Stats */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="glitch-border p-6">
            <div className="flex items-center gap-3 mb-6 text-glitch-magenta">
              <Activity size={20} className="animate-bounce" />
              <h2 className="text-2xl uppercase tracking-widest">DATA_LOG</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-xs text-glitch-cyan/50 uppercase mb-1">CURRENT_YIELD</div>
                <div className="text-5xl font-bold text-glitch-cyan">{score.toString().padStart(6, '0')}</div>
              </div>
              <div className="h-px bg-glitch-magenta/30" />
              <div>
                <div className="text-xs text-glitch-magenta/50 uppercase mb-1">PEAK_EFFICIENCY</div>
                <div className="text-5xl font-bold text-glitch-magenta">{highScore.toString().padStart(6, '0')}</div>
              </div>
            </div>
          </div>

          <div className="glitch-border p-4 bg-glitch-magenta/5">
            <div className="flex items-center gap-2 text-glitch-yellow mb-2">
              <AlertTriangle size={14} />
              <span className="text-xs uppercase">Kernel_Warning</span>
            </div>
            <p className="text-[10px] leading-tight text-white/40 uppercase">
              Unauthorized access detected in sector 7G. Memory leak imminent. Please refrain from terminating the process.
            </p>
          </div>
        </motion.div>

        {/* CORE_PROCESS - Game */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-glitch-cyan/20 pointer-events-none" />
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
        </motion.div>

        {/* SIGNAL_PROCESSOR - Music */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 flex flex-col gap-6"
        >
          <div className="glitch-border p-4 flex items-center gap-4 bg-glitch-cyan/5">
            <Cpu size={24} className="text-glitch-cyan animate-pulse" />
            <div className="text-xs uppercase tracking-tighter">
              <div className="text-glitch-cyan">Neural_Link: Active</div>
              <div className="text-white/30">Latency: 0.002ms</div>
            </div>
          </div>
          
          <MusicPlayer />
          
          <div className="p-4 border-l-4 border-glitch-magenta bg-black/40">
            <div className="flex items-center gap-2 text-glitch-magenta mb-2">
              <Terminal size={14} />
              <span className="text-xs uppercase tracking-widest">Terminal_Output</span>
            </div>
            <div className="text-[10px] font-mono text-white/30 overflow-hidden h-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap">
                  {`> EXECUTE_CMD: FETCH_AUDIO_BUFFER_${Math.random().toString(16).slice(2, 8)}... SUCCESS`}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Machine Footer */}
      <footer className="mt-12 text-glitch-cyan/20 text-[10px] uppercase tracking-[0.5em] z-10 flex items-center gap-4">
        <span>[ MANUFACTURING_UNIT: CAMBRIDGE_22ISE ]</span>
        <span className="w-2 h-2 bg-glitch-magenta animate-ping" />
        <span>[ REVISION: 0.9.4-BETA ]</span>
      </footer>
    </div>
  );
}
