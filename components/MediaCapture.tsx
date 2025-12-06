import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, Upload, StopCircle, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface MediaCaptureProps {
  mode: 'video' | 'image';
  onCapture: (file: File | Blob) => void;
  instruction?: string;
  maxDuration?: number; // seconds
  allowUpload?: boolean;
}

export const MediaCapture: React.FC<MediaCaptureProps> = ({ 
  mode, 
  onCapture, 
  instruction,
  maxDuration = 90,
  allowUpload = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Smart Camera State
  const [lightingStatus, setLightingStatus] = useState<'good' | 'poor'>('good');
  const [stabilityStatus, setStabilityStatus] = useState<'stable' | 'shaky'>('stable');

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 } }, 
        audio: mode === 'video' 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  // Simulated Quality Check Loop
  useEffect(() => {
    if (!stream || isRecording || previewUrl) return;

    const interval = setInterval(() => {
        // Simulate random fluctuations in lighting/stability for demo
        // In production, this would use Canvas API pixel analysis
        setLightingStatus(Math.random() > 0.1 ? 'good' : 'poor');
        setStabilityStatus(Math.random() > 0.1 ? 'stable' : 'shaky');
    }, 3000);

    return () => clearInterval(interval);
  }, [stream, isRecording, previewUrl]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      onCapture(blob);
      setTimer(0);
    };

    mediaRecorder.start();
    setIsRecording(true);
    mediaRecorderRef.current = mediaRecorder;

    // Timer
    timerRef.current = window.setInterval(() => {
      setTimer(prev => {
        if (prev >= maxDuration) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !stream) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onCapture(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.85);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onCapture(file);
    }
  };

  const reset = () => {
    setPreviewUrl(null);
    if (!stream) startCamera();
    else if (videoRef.current) videoRef.current.srcObject = stream;
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl relative aspect-video flex flex-col items-center justify-center">
      {/* Viewport */}
      {previewUrl ? (
        mode === 'video' ? (
          <video src={previewUrl} controls className="w-full h-full object-contain" />
        ) : (
          <img src={previewUrl} alt="Capture" className="w-full h-full object-contain" />
        )
      ) : stream ? (
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover transform scale-x-[-1]" 
        />
      ) : (
        <div className="text-center p-6 text-white">
          <p className="mb-4 text-gray-400">{instruction || "Start camera to begin"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={startCamera}>
              <Camera className="w-5 h-5 mr-2" /> Start Camera
            </Button>
            {allowUpload && (
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-5 h-5 mr-2" /> Upload File
              </Button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept={mode === 'video' ? "video/*" : "image/*"}
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}

      {/* Smart Camera Overlays */}
      {stream && !previewUrl && !isRecording && (
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium ${lightingStatus === 'good' ? 'bg-black/40 text-green-400' : 'bg-red-900/60 text-white'}`}
           >
              {lightingStatus === 'good' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {lightingStatus === 'good' ? 'Lighting Good' : 'Low Light'}
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium ${stabilityStatus === 'stable' ? 'bg-black/40 text-green-400' : 'bg-yellow-900/60 text-white'}`}
           >
              {stabilityStatus === 'stable' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {stabilityStatus === 'stable' ? 'Stable' : 'Movement Detected'}
           </motion.div>
        </div>
      )}

      {/* Overlays & Controls (Only if stream active and not reviewing) */}
      {stream && !previewUrl && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
          {mode === 'video' ? (
            isRecording ? (
              <button onClick={stopRecording} className="rounded-full bg-red-600 p-4 hover:bg-red-700 animate-pulse transition-all shadow-lg ring-4 ring-red-900/30">
                <StopCircle className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button onClick={startRecording} className="rounded-full bg-white p-4 hover:bg-gray-100 transition-all shadow-lg">
                <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white" />
              </button>
            )
          ) : (
            <button onClick={takePhoto} className="rounded-full bg-white p-4 hover:bg-gray-100 transition-all shadow-lg">
              <Camera className="w-8 h-8 text-gray-900" />
            </button>
          )}
        </div>
      )}

      {/* Timer Overlay */}
      {isRecording && (
        <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-white font-mono text-sm flex items-center shadow-lg">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} / {Math.floor(maxDuration / 60)}:{(maxDuration % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Reset Button (Only if reviewing) */}
      {previewUrl && (
        <button 
          onClick={reset}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};