
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, CheckCircle, RefreshCw, PenTool, AlertCircle, ArrowRight, MousePointer2, Smartphone, Zap } from 'lucide-react';
import { Button } from './Button';

interface Point {
  x: number;
  y: number;
  pressure: number;
  time: number;
}

interface Stroke {
  points: Point[];
}

interface Metrics {
  speed: number;
  pressure: number;
  smoothness: number;
  confidence: number;
}

interface LiveHandwritingAnalysisProps {
  onCapture: (blob: Blob) => void;
}

export const LiveHandwritingAnalysis: React.FC<LiveHandwritingAnalysisProps> = ({ onCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [inputType, setInputType] = useState<'mouse' | 'touch' | 'pen'>('mouse');

  // Metrics State
  const [metrics, setMetrics] = useState<Metrics>({
    speed: 0,
    pressure: 0.5,
    smoothness: 100,
    confidence: 0
  });

  const [activeTip, setActiveTip] = useState<string>("Start writing to see analysis");

  // Initialize Canvas with High-DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      // High DPI Scaling
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale down with CSS to match layout size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // In a real app, we would redraw existing strokes here
      }
    };

    window.addEventListener('resize', resize);
    // Initial size
    const timer = setTimeout(resize, 100);

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(timer);
    };
  }, []);

  // Analysis Logic
  const analyzeStroke = useCallback((points: Point[]) => {
    if (points.length < 2) return;

    // 1. Calculate Speed (pixels per ms)
    const lastPoint = points[points.length - 1];
    const prevPoint = points[points.length - 2];
    const dist = Math.hypot(lastPoint.x - prevPoint.x, lastPoint.y - prevPoint.y);
    const timeDiff = lastPoint.time - prevPoint.time;
    const currentSpeed = timeDiff > 0 ? dist / timeDiff : 0;

    // 2. Calculate Pressure (direct from pointer event)
    const currentPressure = lastPoint.pressure;

    // 3. Calculate Smoothness (angle variance)
    let smoothness = 100;
    if (points.length > 3) {
      const p1 = points[points.length - 3];
      const p2 = points[points.length - 2];
      const p3 = points[points.length - 1];

      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      const angleDiff = Math.abs(angle1 - angle2);

      // Heuristic: Sharp changes reduce smoothness
      if (angleDiff > 0.5) smoothness = 60;
      else if (angleDiff > 0.2) smoothness = 80;
    }

    setMetrics(prev => ({
      speed: currentSpeed * 10 + prev.speed * 0.9, // Smoothing
      pressure: currentPressure,
      smoothness: (smoothness + prev.smoothness * 9) / 10,
      confidence: Math.min(100, prev.confidence + 0.5)
    }));

    // Generate Tips
    if (currentPressure < 0.2 && currentPressure > 0 && inputType === 'pen') setActiveTip("Try pressing a little harder");
    else if (currentPressure > 0.8) setActiveTip("Relax your hand pressure");
    else if (currentSpeed > 2.0) setActiveTip("Slow down for better control");
    else if (smoothness < 70) setActiveTip("Try to make smoother strokes");
    else setActiveTip("Great consistency! Keep going.");

  }, [inputType]);

  // Drawing Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const type = e.pointerType as 'mouse' | 'touch' | 'pen';
    setInputType(type);

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);

    const rect = e.currentTarget.getBoundingClientRect();
    // Clamp coordinates to canvas bounds
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const point = {
      x,
      y,
      pressure: e.pressure !== 0.5 ? e.pressure : (type === 'pen' ? e.pressure : 0.5),
      time: Date.now()
    };
    setCurrentStroke([point]);

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();
    // Strict Boundary Detection: Clamp strokes to visible area
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    let pressure = e.pressure;
    if (e.pointerType === 'touch' && (pressure === 0 || pressure === 1)) {
      pressure = 0.5;
    }

    const point = { x, y, pressure, time: Date.now() };

    // Dynamic line width
    ctx.lineWidth = Math.max(1.5, point.pressure * 6);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    const newStroke = [...currentStroke, point];
    setCurrentStroke(newStroke);
    analyzeStroke(newStroke);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes([...strokes, { points: currentStroke }]);
    }
  };

  const clearCanvas = () => {
    if (strokes.length > 0) {
      if (!window.confirm("Are you sure you want to clear your drawing? This cannot be undone.")) {
        return;
      }
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      setStrokes([]);
      setMetrics({ speed: 0, pressure: 0.5, smoothness: 100, confidence: 0 });
      setActiveTip("Canvas cleared");
    }
  };

  // H0-6: Undo function
  const undoLastStroke = () => {
    if (strokes.length === 0) return;
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);

    // Redraw canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Redraw remaining strokes
      newStrokes.forEach(stroke => {
        if (stroke.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach((point, i) => {
          if (i > 0) {
            ctx.lineWidth = Math.max(1.5, point.pressure * 6);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        });
      });

      setActiveTip("Undid last stroke");
    }
  };

  const handleFinish = () => {
    canvasRef.current?.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200">

      {/* Top Toolbar (Controls + Clear) */}
      <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <PenTool className="w-4 h-4" />
          <span className="font-medium">Digital Ink Mode</span>
        </div>
        <div className="flex gap-2">
          {/* H0-6: Undo button */}
          <Button variant="outline" size="sm" onClick={undoLastStroke} disabled={strokes.length === 0} title="Undo last stroke">
            <RefreshCw className="w-4 h-4 mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={clearCanvas} disabled={strokes.length === 0}>
            <Eraser className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row relative overflow-hidden">
        {/* Drawing Area - LARGE SURFACE AREA */}
        <div
          className="flex-1 relative cursor-crosshair bg-white min-h-[500px]"
          ref={containerRef}
          style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />

          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="block touch-none w-full h-full relative z-10"
            role="img"
            aria-label="Handwriting practice canvas. Use mouse, touch, or stylus to draw. Your writing will be analyzed in real-time."
            tabIndex={0}
          />

          {!isDrawing && strokes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="text-center text-gray-400">
                <PenTool className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-xl font-story">Write or draw here</p>
                <p className="text-sm mt-2 opacity-60">Optimized for Stylus & Touch</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Analysis Panel - NO OVERLAP */}
        <div className="w-full md:w-72 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col p-4 z-20 shadow-inner">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Live Metrics</h4>
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                {inputType === 'pen' ? <PenTool className="w-3 h-3" /> : inputType === 'touch' ? <Smartphone className="w-3 h-3" /> : <MousePointer2 className="w-3 h-3" />}
                {inputType}
              </div>
            </div>

            {/* Show empty state when no strokes - P0-10 fix */}
            {strokes.length === 0 ? (
              <div className="bg-gray-100 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-2">Start writing to see live analysis</p>
                <p className="text-xs text-gray-400">Metrics will appear as you draw</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Speed/Fluency - with tooltip */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 cursor-help" title="Measures smoothness and consistency of pen strokes. Higher scores indicate fluid, uninterrupted writing.">Fluency ℹ️</span>
                    <span className="font-mono font-medium text-gray-900">{metrics.speed.toFixed(1)} px/sec</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.min(100, metrics.speed * 40)} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div className="h-full bg-blue-500" animate={{ width: `${Math.min(100, metrics.speed * 40)}%` }} />
                  </div>
                </div>

                {/* Pressure - with tooltip */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 cursor-help" title="Measures how hard you press while writing. Consistent pressure indicates good motor control.">Pressure ℹ️</span>
                    <span className="font-mono font-medium text-gray-900">{(metrics.pressure * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={metrics.pressure * 100} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div className="h-full bg-purple-500" animate={{ width: `${metrics.pressure * 100}%` }} />
                  </div>
                </div>

                {/* Control/Smoothness - with tooltip */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 cursor-help" title="Measures stroke control and angle consistency. Higher scores mean smoother, more controlled strokes.">Control ℹ️</span>
                    <span className="font-mono font-medium text-gray-900">{metrics.smoothness.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={metrics.smoothness} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className={`h-full ${metrics.smoothness > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      animate={{ width: `${metrics.smoothness}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Smart Tip */}
          <div className="flex-1">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border-2 border-indigo-100 p-3 rounded-xl shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <div className="bg-indigo-100 p-1.5 rounded-full mt-0.5">
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-900 mb-1">AI Coach</p>
                    <p className="text-sm text-indigo-800 leading-tight">{activeTip}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Finish Action */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button onClick={handleFinish} disabled={strokes.length === 0} className="w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
              Finish Analysis <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
