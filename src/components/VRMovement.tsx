import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface VRMovementProps {
  vrActive: boolean;
  speed?: number;
}

export function VRMovement({ vrActive, speed = 0.1 }: VRMovementProps) {
  const { camera, gl } = useThree();
  const moveVector = useRef(new THREE.Vector3());
  const tempVector = useRef(new THREE.Vector3());
  const cameraDirection = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!vrActive || !gl.xr.isPresenting) return;

    // Get VR controllers
    const controller1 = gl.xr.getController(0);
    const controller2 = gl.xr.getController(1);

    // Reset movement vector
    moveVector.current.set(0, 0, 0);

    // Check controller inputs for movement
    if (controller1.userData.gamepad) {
      const gamepad = controller1.userData.gamepad;
      
      // Left thumbstick for movement (axes 2,3)
      if (gamepad.axes && gamepad.axes.length >= 4) {
        const xAxis = gamepad.axes[2];
        const yAxis = gamepad.axes[3];
        
        if (Math.abs(xAxis) > 0.1 || Math.abs(yAxis) > 0.1) {
          // Get camera forward direction
          camera.getWorldDirection(cameraDirection.current);
          cameraDirection.current.y = 0; // Keep movement horizontal
          cameraDirection.current.normalize();
          
          // Calculate right direction
          const rightDirection = new THREE.Vector3();
          rightDirection.crossVectors(cameraDirection.current, camera.up);
          
          // Apply movement
          tempVector.current.copy(cameraDirection.current).multiplyScalar(-yAxis * speed);
          moveVector.current.add(tempVector.current);
          
          tempVector.current.copy(rightDirection).multiplyScalar(xAxis * speed);
          moveVector.current.add(tempVector.current);
        }
      }
    }

    // Apply movement to camera
    if (moveVector.current.length() > 0) {
      camera.position.add(moveVector.current);
    }
  });

  // Handle controller connection events
  useEffect(() => {
    if (!vrActive || !gl.xr) return;

    const onControllerConnected = (event: any) => {
      const controller = event.target;
      controller.userData.gamepad = event.data.gamepad;
      console.log('VR Controller connected:', event.data);
    };

    const onControllerDisconnected = (event: any) => {
      const controller = event.target;
      controller.userData.gamepad = null;
      console.log('VR Controller disconnected');
    };

    const controller1 = gl.xr.getController(0);
    const controller2 = gl.xr.getController(1);

    controller1.addEventListener('connected', onControllerConnected);
    controller1.addEventListener('disconnected', onControllerDisconnected);
    controller2.addEventListener('connected', onControllerConnected);
    controller2.addEventListener('disconnected', onControllerDisconnected);

    return () => {
      controller1.removeEventListener('connected', onControllerConnected);
      controller1.removeEventListener('disconnected', onControllerDisconnected);
      controller2.removeEventListener('connected', onControllerConnected);
      controller2.removeEventListener('disconnected', onControllerDisconnected);
    };
  }, [vrActive, gl.xr]);

  return null;
}