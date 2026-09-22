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
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for the entire ORION emblem assembly
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // 1. Core Planetary Torus ("O")
    const torusGeo = new THREE.TorusGeometry(5.2, 1.4, 32, 120);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false
    });
    const mainTorus = new THREE.Mesh(torusGeo, torusMat);
    emblemGroup.add(mainTorus);

    // Inner wireframe lattice for high-tech holographic texture
    const wireTorusGeo = new THREE.TorusGeometry(5.22, 1.42, 16, 60);
    const wireTorusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireTorus = new THREE.Mesh(wireTorusGeo, wireTorusMat);
    emblemGroup.add(wireTorus);

    // 2. Tilted Sweeping Orbital Ring (Torus with thin tube)
    const ringGeo = new THREE.TorusGeometry(8.2, 0.12, 16, 160);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.95
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI / 2.7;
    orbitalRing.rotation.y = -Math.PI / 6;
    emblemGroup.add(orbitalRing);

    // Outer faint secondary energy ring
    const outerRingGeo = new THREE.TorusGeometry(9.6, 0.04, 12, 140);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.35
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2.5;
    outerRing.rotation.y = -Math.PI / 5;
    emblemGroup.add(outerRing);

    // 3. 4-Point Celestial Star Flare at Top-Right (Intersection vertex)
    const starGroup = new THREE.Group();
    starGroup.position.set(5.8, 4.2, 2.5);

    const starShape = new THREE.Shape();
    const starR1 = 1.6;
    const starR2 = 0.25;
    for (let i = 0; i < 8; i++) {
      const radius = i % 2 === 0 ? starR1 : starR2;
      const angle = (i * Math.PI) / 4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starGeo = new THREE.ShapeGeometry(starShape);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starGroup.add(starMesh);
    emblemGroup.add(starGroup);

    // 4. Ambient & Directional Space Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3.5, 40);
    blueLight.position.set(-10, 8, 12);
    scene.add(blueLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 4.0, 40);
    violetLight.position.set(12, -8, 10);
    scene.add(violetLight);

    const starGlowLight = new THREE.PointLight(0xffffff, 2.0, 15);
    starGlowLight.position.copy(starGroup.position);
    scene.add(starGlowLight);

    // 5. Deep Space Particle Field (1,500 Stars)
    const starCount = 1500;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 60;
      starCoords[i + 1] = (Math.random() - 0.5) * 45;
      starCoords[i + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    const starFieldGeo = new THREE.BufferGeometry();
    starFieldGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starFieldMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.12,
      transparent: true,
      opacity: 0.65
    });
    const starPoints = new THREE.Points(starFieldGeo, starFieldMat);
    scene.add(starPoints);

    // Mouse Tracking for Smooth Parallax Tilt
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotation dynamics based on state
      const speedMultiplier =
        assistantState === 'THINKING' ? 3.0 :
        assistantState === 'EXECUTING' ? 2.2 :
        assistantState === 'LISTENING' ? 1.5 : 0.8;

      mainTorus.rotation.z = elapsedTime * 0.15 * speedMultiplier;
      wireTorus.rotation.z = -elapsedTime * 0.12 * speedMultiplier;
      orbitalRing.rotation.z = elapsedTime * 0.3 * speedMultiplier;
      outerRing.rotation.z = -elapsedTime * 0.2 * speedMultiplier;

      // Star flare twinkle
      const starScale = 1.0 + 0.25 * Math.sin(elapsedTime * 5.0);
      starGroup.scale.set(starScale, starScale, starScale);

      // Smooth Parallax towards mouse position
      emblemGroup.rotation.y += (mouseX * 0.35 - emblemGroup.rotation.y) * 0.05;
      emblemGroup.rotation.x += (-mouseY * 0.35 - emblemGroup.rotation.x) * 0.05;

      // Color/Glow Shifts based on state
      if (assistantState === 'THINKING') {
        torusMat.emissive.setHex(0x0284c7);
        ringMat.emissive.setHex(0x38bdf8);
      } else if (assistantState === 'EXECUTING') {
        torusMat.emissive.setHex(0x7c3aed);
        ringMat.emissive.setHex(0xc084fc);
      } else if (assistantState === 'SPEAKING') {
        torusMat.emissive.setHex(0x059669);
        ringMat.emissive.setHex(0x34d399);
      } else {
        torusMat.emissive.setHex(0x1e3a8a);
        ringMat.emissive.setHex(0x8b5cf6);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [assistantState]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full flex-1 min-h-[300px] flex items-center justify-center cursor-pointer" />

      {/* Atmospheric Horizon Curved Glow (matching bottom of logo kit example) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-36 rounded-[100%] bg-gradient-to-t from-blue-600/30 via-indigo-600/15 to-transparent blur-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
      </div>

      {/* Official Typography from Brand Kit */}
      <div className="absolute bottom-3 flex flex-col items-center select-none pointer-events-none z-10">
        <h1 className="text-2xl font-black tracking-[0.3em] text-white font-sans drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
          ORION
        </h1>
        <div className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 font-semibold uppercase mt-0.5">
          COMMAND • ASSIST • CREATE
        </div>
        <div className="text-[9px] font-mono tracking-[0.2em] text-slate-400 mt-0.5">
          YOUR AI. YOUR COMPUTER. YOUR WORLD.
        </div>
      </div>
    </div>
  );
};
