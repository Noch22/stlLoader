import React, { useState, useEffect } from "react";
import {
  STL_MODELS,
  STLModel,
  getModelUrl,
  checkModelExists,
} from "../data/stl-models";
import { Package, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface ModelSelectorProps {
  onModelSelect: (modelUrl: string, modelName: string) => void;
  selectedModel: string | null;
}

export function ModelSelector({
  onModelSelect,
  selectedModel,
}: ModelSelectorProps) {
  const [availableModels, setAvailableModels] = useState<STLModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkModels = async () => {
      setLoading(true);
      const checkedModels: STLModel[] = [];

      for (const model of STL_MODELS) {
        const exists = await checkModelExists(model.filename);
        if (exists) {
          checkedModels.push(model);
        }
      }

      setAvailableModels(checkedModels);
      setLoading(false);
    };

    checkModels();
  }, []);

  const handleModelSelect = (model: STLModel) => {
    const modelUrl = getModelUrl(model.filename);
    onModelSelect(modelUrl, model.name);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
        <span className="ml-2 text-white">Scanning models folder...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Models disponibles</h3>
        <span className="text-sm text-gray-400">
          ({availableModels.length} trouvés)
        </span>
      </div>

      {availableModels.length === 0 ? (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-amber-400 font-medium">No STL files found</p>
              <p className="text-amber-300/70 text-sm mt-1">
                Add STL files to the public/models folder
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availableModels.map((model) => {
            const modelUrl = getModelUrl(model.filename);
            const isSelected = selectedModel === modelUrl;

            return (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-400/50"
                      : "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        isSelected ? "text-cyan-400" : "text-white"
                      }`}
                    >
                      {model.name}
                    </p>
                    {model.description && (
                      <p className="text-gray-400 text-sm mt-1 truncate">
                        {model.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {model.filename}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-cyan-400 ml-2 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
