import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, Check, Loader2 } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export function CameraView() {
  const { isCameraOpen, setCameraOpen, addMeal, selectedDate } = useStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleOpen = useCallback(() => {
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setAnalysisResult(null);
    setCameraOpen(false);
  }, [stopCamera, setCameraOpen]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        analyzeImage();
      }
    }
  }, [stopCamera]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis (in production, this would call Claude Vision API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Demo result
    setAnalysisResult({
      name: 'Grilled Chicken Salad',
      calories: 380,
      protein: 42,
      carbs: 15,
      fat: 18,
    });
    setIsAnalyzing(false);
  };

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  }, [startCamera]);

  const confirmMeal = useCallback(() => {
    if (analysisResult) {
      const meal = {
        id: uuidv4(),
        user_id: 'demo-user',
        name: analysisResult.name,
        calories: analysisResult.calories,
        protein: analysisResult.protein,
        carbs: analysisResult.carbs,
        fat: analysisResult.fat,
        photo_url: capturedImage || undefined,
        category: 'lunch' as const,
        foods: [],
        created_at: new Date().toISOString(),
        date: format(selectedDate, 'yyyy-MM-dd'),
      };
      addMeal(meal);
      handleClose();
    }
  }, [analysisResult, capturedImage, selectedDate, addMeal, handleClose]);

  return (
    <AnimatePresence onExitComplete={stopCamera}>
      {isCameraOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            if (isCameraOpen) handleOpen();
          }}
          className="fixed inset-0 bg-black z-50 flex flex-col"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
            <button
              onClick={handleClose}
              className="p-2 bg-black/50 rounded-full"
            >
              <X size={24} className="text-white" />
            </button>
            <span className="text-white font-medium">
              {capturedImage ? 'Review Photo' : 'Take Photo'}
            </span>
            <div className="w-10" />
          </div>

          {/* Camera/Image View */}
          <div className="flex-1 relative">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured food"
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Analysis Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 size={48} className="text-white animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">Analyzing your meal...</p>
                  <p className="text-white/70 text-sm mt-1">
                    AI is detecting food items
                  </p>
                </div>
              </div>
            )}

            {/* Analysis Result */}
            {analysisResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
              >
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {analysisResult.name}
                </h3>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <p className="text-2xl font-bold text-text-primary">
                      {analysisResult.calories}
                    </p>
                    <p className="text-sm text-text-tertiary">calories</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="font-semibold text-protein">
                        {analysisResult.protein}g
                      </p>
                      <p className="text-xs text-text-tertiary">protein</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-carbs">
                        {analysisResult.carbs}g
                      </p>
                      <p className="text-xs text-text-tertiary">carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-fat">{analysisResult.fat}g</p>
                      <p className="text-xs text-text-tertiary">fat</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 py-3 bg-surface rounded-xl font-semibold text-text-secondary flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Retake
                  </button>
                  <button
                    onClick={confirmMeal}
                    className="flex-1 py-3 bg-accent rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Add Meal
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Capture Button */}
          {!capturedImage && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Camera size={32} className="text-accent" />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
