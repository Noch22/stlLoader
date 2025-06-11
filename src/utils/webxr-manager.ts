import * as THREE from 'three';

export class WebXRManager {
  private renderer: THREE.WebGLRenderer;
  private session: any = null;
  private frameId: number = 0;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.setupWebXR();
  }

  private setupWebXR() {
    // Enable WebXR support in Three.js
    this.renderer.xr.enabled = true;
  }

  async startVRSession(): Promise<void> {
    if (!('xr' in navigator)) {
      throw new Error('WebXR not supported');
    }

    try {
      // Request VR session with hand tracking and controller support
      this.session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'bounded-floor']
      });

      // Set up the session
      await this.renderer.xr.setSession(this.session);
      
      // Handle session end
      this.session.addEventListener('end', this.onSessionEnd.bind(this));
      
      console.log('VR session started successfully');
      
    } catch (error) {
      console.error('Failed to start VR session:', error);
      throw error;
    }
  }

  endVRSession(): void {
    if (this.session) {
      this.session.end();
    }
  }

  private onSessionEnd(): void {
    this.session = null;
    console.log('VR session ended');
  }

  // Hand tracking utilities
  getHandPose(handIndex: number): any {
    if (!this.session || !this.renderer.xr.getHand) {
      return null;
    }

    const hand = this.renderer.xr.getHand(handIndex);
    return hand;
  }

  // Controller utilities  
  getController(controllerIndex: number): THREE.Group {
    return this.renderer.xr.getController(controllerIndex);
  }

  getControllerGrip(controllerIndex: number): THREE.Group {
    return this.renderer.xr.getControllerGrip(controllerIndex);
  }

  // Check if currently in VR
  isPresenting(): boolean {
    return this.renderer.xr.isPresenting;
  }

  // Get current VR camera
  getCamera(): THREE.Camera {
    return this.renderer.xr.getCamera();
  }
}