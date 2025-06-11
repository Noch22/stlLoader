// STL Models Configuration
// Add your STL files to the public/models folder and list them here

export interface STLModel {
  id: string;
  name: string;
  filename: string;
  description?: string;
  thumbnail?: string;
}

export const STL_MODELS: STLModel[] = [
  {
    id: "dick",
    name: "Dickosaurus",
    filename: "dick.stl",
    description: "Classic 3D moel off dinausaurus",
  },
  {
    id: "jeancharles",
    name: "Jean Charles",
    filename: "jeancharles.stl",
    description: "3D model of Jean Charles",
  },
  {
    id: "thinker",
    name: "Thinker on toilets",
    filename: "think.stl",
    description: "Thinker on his toilets",
  },
];

// Helper function to get model URL
export function getModelUrl(filename: string): string {
  return `/models/${filename}`;
}

// Helper function to check if model exists
export async function checkModelExists(filename: string): Promise<boolean> {
  try {
    const response = await fetch(getModelUrl(filename), { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
