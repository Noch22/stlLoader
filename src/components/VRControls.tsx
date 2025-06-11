import React from "react";
import {
  Move3D,
  RotateCcw,
  ZoomIn,
  Hand,
  Gamepad2,
  Info,
  Navigation,
  Grab,
} from "lucide-react";

interface VRControlsProps {
  vrActive: boolean;
}

export function VRControls({ vrActive }: VRControlsProps) {
  const desktopControls = [
    {
      icon: Move3D,
      label: "Click gauche + drag",
      description: "Rotation de la vue",
    },
    { icon: ZoomIn, label: "Roue de la souris", description: "Zoom/dézoom" },
    {
      icon: RotateCcw,
      label: "Click droit + drag",
      description: "Vue panoramique",
    },
  ];

  const vrControls = [
    {
      icon: Navigation,
      label: "Manette gauche",
      description: "Déplacer la vue dans l'espace",
    },
    {
      icon: Grab,
      label: "Button d'action",
      description: "Attraper et manipuler les objets",
    },
    {
      icon: Hand,
      label: "Mouvements des mains (Lynx R1)",
      description: "Pincer pour attraper, ouvrir pour relâcher",
    },
    {
      icon: Gamepad2,
      label: "Mannettes (meta Quest)",
      description: "Pointez and appuyer pour interagir avec les objets",
    },
  ];

  const activeControls = vrActive ? vrControls : desktopControls;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
        <Info className="w-5 h-5" />
        <span>{vrActive ? "VR Controls" : "Desktop Controls"}</span>
      </h3>

      <div className="space-y-3">
        {activeControls.map((control, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <control.icon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">
                  {control.label}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {control.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vrActive && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-4">
          <h4 className="text-blue-400 font-medium text-sm mb-2">
            Mouvements en VR
          </h4>
          <ul className="text-blue-300/80 text-xs space-y-1">
            <li>• Utilisez la manette de gauche pour vous déplacer</li>
            <li>• Regardez autour de vous pour changer de direction</li>
            <li>
              • Pointez un objet et appuyez sur la gachette pour l'attraper
            </li>
            <li>• Déplacez les objets 3d dans l'espace</li>
            <li>• Rapprochez vous pour examiner les objets</li>
          </ul>
        </div>
      )}

      {!vrActive && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mt-4">
          <h4 className="text-purple-400 font-medium text-sm mb-2">
            Mode ordinateur
          </h4>
          <p className="text-purple-300/80 text-xs">
            Séléctionnez un modèle 3D dans le panneau de gauche pour commencer.
            <br />
            Utilisez la souris pour naviguer dans la scène.
          </p>
        </div>
      )}
    </div>
  );
}
