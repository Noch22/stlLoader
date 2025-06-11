// WebXR utilities and feature detection
export async function isWebXRSupported(): Promise<boolean> {
  if (!('xr' in navigator)) {
    return false;
  }

  try {
    const isSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
    return isSupported;
  } catch (error) {
    console.warn('WebXR not supported:', error);
    return false;
  }
}

export async function initializeXR(): Promise<void> {
  if (!('xr' in navigator)) {
    throw new Error('WebXR not available');
  }

  try {
    // Check for hand tracking support (Lynx R1)
    const handTrackingSupported = await (navigator as any).xr.isSessionSupported('immersive-vr', {
      requiredFeatures: ['hand-tracking']
    });

    console.log('Hand tracking supported:', handTrackingSupported);

    // Check for controller support (Meta Quest)
    const controllerSupported = await (navigator as any).xr.isSessionSupported('immersive-vr', {
      requiredFeatures: ['local-floor']
    });

    console.log('Controller support:', controllerSupported);

  } catch (error) {
    console.warn('Error initializing WebXR:', error);
  }
}

export function getXRFeatures(): string[] {
  const features = ['local-floor'];
  
  // Add hand tracking if available (Lynx R1)
  if ('XRHand' in window) {
    features.push('hand-tracking');
  }
  
  return features;
}

export async function requestVRSession(): Promise<any> {
  if (!('xr' in navigator)) {
    throw new Error('WebXR not supported');
  }

  const features = getXRFeatures();
  
  try {
    const session = await (navigator as any).xr.requestSession('immersive-vr', {
      requiredFeatures: features,
      optionalFeatures: ['hand-tracking', 'bounded-floor']
    });
    
    return session;
  } catch (error) {
    console.error('Failed to start VR session:', error);
    throw error;
  }
}