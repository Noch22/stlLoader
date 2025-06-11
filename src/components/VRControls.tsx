import React from 'react';
import { 
  Move3D, 
  RotateCcw, 
  ZoomIn, 
  Hand, 
  Gamepad2, 
  Info,
  Navigation,
  Grab
} from 'lucide-react';

interface VRControlsProps {
  vrActive: boolean;
}

export function VRControls({ vrActive }: VRControlsProps) {
  const desktopControls = [
    { icon: Move3D, label: 'Left click + drag', description: 'Rotate view' },
    { icon: ZoomIn, label: 'Mouse wheel', description: 'Zoom in/out' },
    { icon: RotateCcw, label: 'Right click + drag', description: 'Pan view' },
  ];

  const vrControls = [
    { icon: Navigation, label: 'Left Thumbstick', description: 'Move around the scene' },
    { icon: Grab, label: 'Trigger Button', description: 'Grab and manipulate objects' },
    { icon: Hand, label: 'Hand Gestures (Lynx R1)', description: 'Pinch to grab, move to manipulate' },
    { icon: Gamepad2, label: 'Controllers (Meta Quest)', description: 'Point and trigger to interact' },
  ];

  const activeControls = vrActive ? vrControls : desktopControls;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
        <Info className="w-5 h-5" />
        <span>{vrActive ? 'VR Controls' : 'Desktop Controls'}</span>
      </h3>

      <div className="space-y-3">
        {activeControls.map((control, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <control.icon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">{control.label}</p>
                <p className="text-gray-400 text-xs mt-1">{control.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vrActive && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-4">
          <h4 className="text-blue-400 font-medium text-sm mb-2">VR Movement Tips</h4>
          <ul className="text-blue-300/80 text-xs space-y-1">
            <li>• Use left thumbstick to walk around the scene</li>
            <li>• Look around naturally to change direction</li>
            <li>• Point at objects and pull trigger to grab them</li>
            <li>• Move grabbed objects in 3D space</li>
            <li>• Walk closer to examine fine details</li>
          </ul>
        </div>
      )}

      {!vrActive && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mt-4">
          <h4 className="text-purple-400 font-medium text-sm mb-2">Desktop Mode</h4>
          <p className="text-purple-300/80 text-xs">
            Select a model from the folder above and use mouse controls to examine your 3D model. 
            Enable VR mode for immersive interaction and movement.
          </p>
        </div>
      )}
    </div>
  );
}