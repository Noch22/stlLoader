import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { WebXRManager } from '../utils/webxr-manager';
import { VRMovement } from './VRMovement';

interface VRSceneProps {
  modelUrl: string | null;
  vrActive: boolean;
  vrSupported: boolean;
}

// STL Model Component with VR interaction
function STLModel({ url }: { url: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const { gl } = useThree();

  useEffect(() => {
    if (!url) return;

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();
        const size = new THREE.Box3().setFromObject(new THREE.Mesh(geometry)).getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        geometry.scale(2 / maxDim, 2 / maxDim, 2 / maxDim);
        setGeometry(geometry);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading STL:', error);
      }
    );
  }, [url]);

  // Handle VR interactions
  useEffect(() => {
    if (!meshRef.current || !gl.xr.isPresenting) return;

    const mesh = meshRef.current;
    const controller1 = gl.xr.getController(0);
    const controller2 = gl.xr.getController(1);

    const onSelectStart = (event: any) => {
      const controller = event.target;
      const intersections = getIntersections(controller, [mesh]);
      
      if (intersections.length > 0) {
        setIsGrabbed(true);
        controller.userData.selected = mesh;
        mesh.material.emissive.setHex(0x444444);
      }
    };

    const onSelectEnd = (event: any) => {
      const controller = event.target;
      if (controller.userData.selected === mesh) {
        setIsGrabbed(false);
        controller.userData.selected = undefined;
        mesh.material.emissive.setHex(0x000000);
      }
    };

    const getIntersections = (controller: THREE.Group, objects: THREE.Object3D[]) => {
      const tempMatrix = new THREE.Matrix4();
      const raycaster = new THREE.Raycaster();
      
      tempMatrix.identity().extractRotation(controller.matrixWorld);
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
      
      return raycaster.intersectObjects(objects, false);
    };

    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);

    return () => {
      controller1.removeEventListener('selectstart', onSelectStart);
      controller1.removeEventListener('selectend', onSelectEnd);
      controller2.removeEventListener('selectstart', onSelectStart);
      controller2.removeEventListener('selectend', onSelectEnd);
    };
  }, [geometry, gl.xr.isPresenting]);

  // Auto-rotation for desktop mode
  useFrame((state) => {
    if (meshRef.current && !state.camera.userData.isVR && !isGrabbed) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 1, 0]}>
      <meshStandardMaterial
        color="#00D4FF"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// VR Controller Visualization
function VRControllers() {
  const { gl } = useThree();

  useEffect(() => {
    if (!gl.xr.isPresenting) return;

    const controller1 = gl.xr.getController(0);
    const controller2 = gl.xr.getController(1);
    
    // Add controller ray visualization
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    ]);
    
    const material = new THREE.LineBasicMaterial({ color: 0x00D4FF });
    
    const line1 = new THREE.Line(geometry, material);
    const line2 = new THREE.Line(geometry, material);
    
    controller1.add(line1);
    controller2.add(line2);

    return () => {
      controller1.clear();
      controller2.clear();
    };
  }, [gl.xr.isPresenting]);

  return null;
}

// Hand Tracking Component for Lynx R1
function HandTracking() {
  const { gl } = useThree();

  useEffect(() => {
    if (!gl.xr.isPresenting) return;

    const hand1 = gl.xr.getHand(0);
    const hand2 = gl.xr.getHand(1);
    
    const onHandConnected = (event: any) => {
      console.log('Hand tracking connected:', event);
      const hand = event.target;
      
      // Add hand visualization
      const handGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const handMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
      const handMesh = new THREE.Mesh(handGeometry, handMaterial);
      
      hand.add(handMesh);
    };

    hand1.addEventListener('connected', onHandConnected);
    hand2.addEventListener('connected', onHandConnected);

    return () => {
      hand1.removeEventListener('connected', onHandConnected);
      hand2.removeEventListener('connected', onHandConnected);
    };
  }, [gl.xr.isPresenting]);

  return null;
}

// Scene Setup Component
function SceneSetup({ vrActive }: { vrActive: boolean }) {
  const { gl, camera } = useThree();
  const xrManagerRef = useRef<WebXRManager | null>(null);

  useEffect(() => {
    if (!gl.xr) return;

    xrManagerRef.current = new WebXRManager(gl);
    
    if (vrActive) {
      xrManagerRef.current.startVRSession();
      camera.userData.isVR = true;
    } else {
      xrManagerRef.current.endVRSession();
      camera.userData.isVR = false;
    }

    return () => {
      if (xrManagerRef.current) {
        xrManagerRef.current.endVRSession();
      }
    };
  }, [vrActive, gl, camera]);

  return null;
}

export function VRScene({ modelUrl, vrActive, vrSupported }: VRSceneProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
        <pointLight position={[10, -10, 10]} intensity={0.5} color="#10B981" />

        {/* Environment */}
        <Environment preset="night" />
        
        {/* Grid floor */}
        <Grid
          renderOrder={-1}
          position={[0, 0, 0]}
          infiniteGrid
          cellSize={0.6}
          cellThickness={0.6}
          sectionSize={3.3}
          sectionThickness={1.5}
          sectionColor={'#00D4FF'}
          cellColor={'#6366f1'}
          fadeDistance={30}
          fadeStrength={1}
        />

        {/* STL Model */}
        {modelUrl && <STLModel url={modelUrl} />}

        {/* VR Movement */}
        <VRMovement vrActive={vrActive} speed={0.1} />

        {/* VR Components */}
        {vrSupported && vrActive && (
          <>
            <VRControllers />
            <HandTracking />
          </>
        )}

        {/* Desktop Controls */}
        {!vrActive && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
            target={[0, 1, 0]}
          />
        )}

        {/* Scene Setup */}
        <SceneSetup vrActive={vrActive} />
      </Canvas>

      {/* Loading indicator */}
      {modelUrl && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur rounded-lg px-3 py-2">
          <p className="text-white text-sm">Loading model...</p>
        </div>
      )}
    </div>
  );
}