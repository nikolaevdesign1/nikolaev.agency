"use client";

import { useEffect, useRef, useState } from "react";

type Figure3DProps = {
  /** Low-poly model with a "Figure" root and a "Head" pivot node. */
  model: string;
  /** Still image shown until WebGL has drawn the first frame, and kept when it cannot. */
  poster: string;
  label: string;
  className?: string;
};

/** Camera framing in model units (metres): the figure is 1.89 tall and stands on y = 0. */
const VIEW = { fov: 19, distance: 6.3, eye: 1.0, target: 0.94 };

/** Eases the head between glances so it settles instead of swinging like a pendulum. */
function headYaw(t: number) {
  const cycle = t % 9;
  const ease = (x: number) => x * x * (3 - 2 * x);
  if (cycle < 2.5) return 0;
  if (cycle < 3.4) return 0.42 * ease((cycle - 2.5) / 0.9);
  if (cycle < 5) return 0.42;
  if (cycle < 6.4) return 0.42 - 0.74 * ease((cycle - 5) / 1.4);
  if (cycle < 7.8) return -0.32;
  return -0.32 * (1 - ease((cycle - 7.8) / 1.2));
}

/**
 * The agency figure drawn live with WebGL, so its facets stay sharp at any pixel density.
 * three.js is imported on demand: pages without the figure never download it.
 */
export function Figure3D({ model, poster, label, className }: Figure3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      } catch {
        return; // No WebGL: the poster stays.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(VIEW.fov, 3 / 4, 0.1, 30);
      camera.position.set(0, VIEW.eye, VIEW.distance);
      camera.lookAt(0, VIEW.target, 0);

      scene.add(new THREE.HemisphereLight(0xf4f1ec, 0x6f7078, 1.0));
      const key = new THREE.DirectionalLight(0xffeeda, 3.0);
      key.position.set(-2.4, 3.2, 3.4);
      const rim = new THREE.DirectionalLight(0xb9d0ff, 2.5);
      rim.position.set(2.6, 2.2, -2.6);
      scene.add(key, rim);

      const gltf = await new GLTFLoader().loadAsync(model);
      if (disposed) {
        renderer.dispose();
        return;
      }
      const figure = gltf.scene;
      figure.traverse((node) => {
        const mesh = node as import("three").Mesh;
        if (!mesh.isMesh) return;
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          const standard = material as import("three").MeshStandardMaterial;
          standard.flatShading = true;
          standard.side = THREE.DoubleSide;
          standard.roughness = 0.85;
          standard.metalness = 0;
        }
      });
      scene.add(figure);
      const head = figure.getObjectByName("Head");

      const resize = () => {
        const { clientWidth, clientHeight } = canvas;
        if (!clientWidth || !clientHeight) return;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      resize();

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const draw = (ms: number) => {
        const t = ms / 1000;
        if (!still) {
          if (head) {
            head.rotation.y = headYaw(t);
            head.rotation.x = 0.025 * Math.sin(t * 0.9);
          }
          figure.rotation.y = 0.05 * Math.sin(t * 0.5);
        }
        renderer.render(scene, camera);
      };
      draw(0);
      setReady(true);
      if (!still) renderer.setAnimationLoop(draw);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        observer.disconnect();
        figure.traverse((node) => {
          const mesh = node as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose();
        });
        renderer.dispose();
      };
    })().catch(() => {});

    return () => {
      disposed = true;
      cleanup();
    };
  }, [model]);

  return (
    <div role="img" aria-label={label} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a plain placeholder that the canvas replaces */}
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
