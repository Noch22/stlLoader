import React, { useState, useEffect } from 'react';
import { VRScene } from './components/VRScene';
import { ModelSelector } from './components/ModelSelector';
import { VRControls } from './components/VRControls';
import { isWebXRSupported, initializeXR } from './utils/webxr';
import { AlertCircle, Headphones, Maximize } from 'lucide-react';

function App() {
  const [vrSupported, setVrSupported] = useState<boolean>(false);
  const [vrActive, setVrActive] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedModelName, setSelectedModelName] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const checkVRSupport = async () => {
      const supported = await isWebXRSupported();
      setVrSupported(supported);
      
      if (supported) {
        await initializeXR();
      }
    };

    checkVRSupport();

    // Auto-enter fullscreen
    const enterFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    };

    // Enter fullscreen on first user interaction
    const handleFirstInteraction = () => {
      enterFullscreen();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleModelSelect = (modelUrl: string, modelName: string) => {
    setSelectedModel(modelUrl);
    setSelectedModelName(modelName);
  };

  const handleVRToggle = () => {
    setVrActive(!vrActive);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Headphones className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">VR STL Viewer</h1>
              {selectedModelName && (
                <p className="text-sm text-cyan-400">{selectedModelName}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <Maximize className="w-5 h-5" />
            </button>

            {!vrSupported && (
              <div className="flex items-center space-x-2 text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">WebXR not supported</span>
              </div>
            )}
            
            {vrSupported && (
              <button
                onClick={handleVRToggle}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  vrActive
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                }`}
              >
                {vrActive ? 'Exit VR' : 'Enter VR'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex h-full pt-16">
        {/* Left panel - Model selector and controls */}
        <div className={`bg-gray-800/50 backdrop-blur border-r border-gray-700 flex flex-col transition-all duration-300 ${
          vrActive ? 'w-0 overflow-hidden' : 'w-80'
        }`}>
          <div className="p-4 border-b border-gray-700">
            <ModelSelector 
              onModelSelect={handleModelSelect}
              selectedModel={selectedModel}
            />
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <VRControls vrActive={vrActive} />
          </div>
        </div>

        {/* Right area - 3D Scene */}
        <div className="flex-1 relative">
          <VRScene 
            modelUrl={selectedModel} 
            vrActive={vrActive}
            vrSupported={vrSupported}
          />
        </div>
      </div>

      {/* VR Instructions overlay */}
      {vrActive && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/80 backdrop-blur rounded-lg px-6 py-3 text-white text-center">
            <p className="text-sm">
              <span className="font-medium">Movement:</span> Use left thumbstick to move around
              <span className="mx-2">•</span>
              <span className="font-medium">Interaction:</span> Point and trigger to grab objects
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen hint */}
      {!isFullscreen && (
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-400 text-sm">
            Click anywhere to enter fullscreen
          </div>
        </div>
      )}
    </div>
  );
}

export default App;