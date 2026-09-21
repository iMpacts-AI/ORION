import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AssistantState } from '../../shared/types';

interface WorldGlobeProps {
  assistantState: AssistantState;
}

export const WorldGlobe: React.FC<WorldGlobeProps> = ({ assistantState }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Inner Wireframe Wire Sphere
    const innerGeo = new THREE.IcosahedronGeometry(6, 4);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Outer Technological Orbiting Rings
    const ring1Geo = new THREE.TorusGeometry(8.5, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xff2a5f, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(10.2, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // Dynamic Futuristic Dot Cloud Globe
    const particleCount = 1800;
    const positions = new Float32Array(particleCount * 3);
    const radius = 6.2;

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      opacity: 0.8
    });

    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Ambient Pulsing Core Node
    const coreGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff2a5f,
      transparent: true,
      opacity: 0.25
    });
    const coreNode = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreNode);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // State-responsive speeds and dynamics
      let speedMultiplier = 1;
      if (assistantState === 'THINKING') {
        speedMultiplier = 2.5;
        particleMat.color.setHex(0xff2a5f);
        coreMat.color.setHex(0xff2a5f);
      } else if (assistantState === 'EXECUTING') {
        speedMultiplier = 2.0;
        particleMat.color.setHex(0x00f0ff);
        coreMat.color.setHex(0x00f0ff);
      } else if (assistantState === 'LISTENING') {
        speedMultiplier = 1.4;
        particleMat.color.setHex(0xffb703);
        coreMat.color.setHex(0xffb703);
      } else if (assistantState === 'VISION') {
        speedMultiplier = 1.8;
        particleMat.color.setHex(0x00f0ff);
      } else if (assistantState === 'ERROR') {
        speedMultiplier = 0.5;
        particleMat.color.setHex(0xff0000);
        coreMat.color.setHex(0xff0000);
      } else {
        speedMultiplier = 1.0;
        particleMat.color.setHex(0x00f0ff);
        coreMat.color.setHex(0xff2a5f);
      }

      particleCloud.rotation.y = elapsedTime * 0.12 * speedMultiplier;
      innerSphere.rotation.y = -elapsedTime * 0.08 * speedMultiplier;
      ring1.rotation.z = elapsedTime * 0.15 * speedMultiplier;
      ring2.rotation.x = elapsedTime * 0.1 * speedMultiplier;

      // Pulse core scale
      const scale = 1 + Math.sin(elapsedTime * 3) * 0.15;
      coreNode.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      particleGeo.dispose();
      particleMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [assistantState]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full max-w-[650px] max-h-[550px]" />
      
      {/* Visual Overlay Tech Elements */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between items-start text-[10px] text-arvis-dim font-mono tracking-widest uppercase">
          <div className="border-l-2 border-arvis-accent pl-2">
            GLOBAL_TELEMETRY // SPHERE_NODE_01<br />
            LAT: 25.2048° N | LON: 55.2708° E
          </div>
          <div className="text-right border-r-2 border-arvis-cyan pr-2">
            GRID_RESOL: 1800_NODES<br />
            ORBIT_VEL: 0.12_RAD/S
          </div>
        </div>

        <div className="flex justify-between items-end text-[10px] text-arvis-dim font-mono tracking-widest uppercase">
          <div>
            PROJECTION: THREE_SPHERICAL<br />
            MOD_STATUS: OK_NOMINAL
          </div>
          <div className="text-right">
            SEC_CHANNEL: ENCRYPTED<br />
            PRIVACY: CONFIRMED
          </div>
        </div>
      </div>
    </div>
  );
};
