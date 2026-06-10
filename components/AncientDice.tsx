"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  rolling: boolean;
  rollValue?: number;
  onRollComplete?: (value: number) => void;
  size?: number;
};

type ThreeModule = typeof import("three");

export function AncientDice({ rolling, rollValue, onRollComplete, size = 132 }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const latestRef = useRef({ rolling, rollValue });
  const runtimeRef = useRef<{
    cleanup: () => void;
    setRolling: (rolling: boolean) => void;
    setRollValue: (value?: number) => void;
  } | null>(null);
  const [fallback, setFallback] = useState(false);

  latestRef.current = { rolling, rollValue };

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      try {
        const THREE = await import("three");
        if (cancelled || !mountRef.current) {
          return;
        }

        runtimeRef.current = createDiceScene(THREE, mountRef.current, size);
        runtimeRef.current.setRollValue(latestRef.current.rollValue);
        runtimeRef.current.setRolling(latestRef.current.rolling);
      } catch {
        setFallback(true);
      }
    }

    mount();

    return () => {
      cancelled = true;
      runtimeRef.current?.cleanup();
      runtimeRef.current = null;
    };
  }, [size]);

  useEffect(() => {
    runtimeRef.current?.setRolling(rolling);
  }, [rolling]);

  useEffect(() => {
    runtimeRef.current?.setRollValue(rollValue);
    if (!rolling && rollValue) {
      onRollComplete?.(rollValue);
    }
  }, [onRollComplete, rollValue, rolling]);

  if (fallback) {
    return (
      <div className={`simple-dice-fallback mx-auto mt-2 ${rolling ? "simple-dice-fallback-rolling" : ""}`}>
        <span>{toDiceGlyph(rollValue)}</span>
      </div>
    );
  }

  return (
    <div className="ancient-dice-canvas-wrap mx-auto mt-2" style={{ width: size, height: size }}>
      <div ref={mountRef} className="h-full w-full" />
      <span className="ancient-dice-canvas-shadow" />
    </div>
  );
}

function createDiceScene(THREE: ThreeModule, mount: HTMLDivElement, size: number) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.14, 4.8);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(size, size);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffe5bb, 1.15));

  const key = new THREE.DirectionalLight(0xffd27a, 2.5);
  key.position.set(3.2, 4.4, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0x8de6c8, 1.4, 8);
  rim.position.set(-2.8, -1.4, 3.5);
  scene.add(rim);

  const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9a5529,
    roughness: 0.66,
    metalness: 0.22,
    clearcoat: 0.36,
    clearcoatRoughness: 0.68,
    emissive: 0x1d0a04,
    emissiveIntensity: 0.18
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.66, 1.66, 1.66, 6, 6, 6), cubeMaterial);
  group.add(cube);

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xe0b95f,
    transparent: true,
    opacity: 0.34
  });
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry), edgeMaterial);
  group.add(edges);

  const faces = [
    { position: [0, 0, 0.842], rotation: [0, 0, 0], glyph: "壹" },
    { position: [0, 0, -0.842], rotation: [0, Math.PI, 0], glyph: "貳" },
    { position: [0.842, 0, 0], rotation: [0, Math.PI / 2, 0], glyph: "叄" },
    { position: [-0.842, 0, 0], rotation: [0, -Math.PI / 2, 0], glyph: "肆" },
    { position: [0, 0.842, 0], rotation: [-Math.PI / 2, 0, 0], glyph: "伍" },
    { position: [0, -0.842, 0], rotation: [Math.PI / 2, 0, 0], glyph: "陸" }
  ] as const;

  const faceMeshes: Array<import("three").Mesh> = [];
  const faceGeometry = new THREE.PlaneGeometry(0.92, 0.92);
  faces.forEach((face, index) => {
    const material = new THREE.MeshPhysicalMaterial({
      map: createFaceTexture(THREE, face.glyph, index === 0),
      transparent: true,
      roughness: 0.58,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1
    });
    const mesh = new THREE.Mesh(faceGeometry, material);
    mesh.position.set(face.position[0], face.position[1], face.position[2]);
    mesh.rotation.set(face.rotation[0], face.rotation[1], face.rotation[2]);
    mesh.renderOrder = 2;
    faceMeshes.push(mesh);
    group.add(mesh);
  });

  const bandMaterial = new THREE.LineBasicMaterial({
    color: 0xf1cb78,
    transparent: true,
    opacity: 0.28
  });
  const band = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.74, 1.74, 1.74)), bandMaterial);
  group.add(band);

  let rolling = false;
  let targetRotation = new THREE.Euler(0.38, -0.54, 0.22);
  let frame = 0;
  let animationFrame = 0;
  const clock = new THREE.Clock();

  function setRollValue(value?: number) {
    const front = faceMeshes[0].material as import("three").MeshPhysicalMaterial;
    front.map?.dispose();
    front.map = createFaceTexture(THREE, toDiceGlyph(value), true);
    front.needsUpdate = true;
  }

  function setRolling(nextRolling: boolean) {
    if (rolling && !nextRolling) {
      targetRotation = new THREE.Euler(
        0.32 + Math.random() * 0.24,
        -0.7 + Math.random() * 1.4,
        -0.18 + Math.random() * 0.36
      );
    }
    rolling = nextRolling;
  }

  function animate() {
    const delta = clock.getDelta();
    frame += delta;

    if (rolling) {
      group.rotation.x += delta * 10.5;
      group.rotation.y += delta * 13.6;
      group.rotation.z += delta * 8.4;
      group.position.y = Math.sin(frame * 17) * 0.18;
      group.scale.setScalar(1 + Math.sin(frame * 21) * 0.035);
    } else {
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.08;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.08;
      group.rotation.z += (targetRotation.z - group.rotation.z) * 0.08;
      group.position.y += (0 - group.position.y) * 0.12;
      group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
    }

    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(animate);
  }

  animate();

  return {
    setRolling,
    setRollValue,
    cleanup() {
      cancelAnimationFrame(animationFrame);
      renderer.dispose();
      cube.geometry.dispose();
      cubeMaterial.dispose();
      edgeMaterial.dispose();
      faceGeometry.dispose();
      bandMaterial.dispose();
      for (const mesh of faceMeshes) {
        const material = mesh.material as import("three").MeshPhysicalMaterial;
        material.map?.dispose();
        material.dispose();
      }
      mount.removeChild(renderer.domElement);
    }
  };
}

function createFaceTexture(THREE: ThreeModule, glyph: string, primary: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 256, 256);

  const panel = ctx.createRadialGradient(84, 72, 10, 128, 128, 120);
  panel.addColorStop(0, primary ? "#ffe1a0" : "#dca45e");
  panel.addColorStop(0.55, primary ? "#bc6d32" : "#935329");
  panel.addColorStop(1, "#351508");
  ctx.fillStyle = panel;
  ctx.beginPath();
  ctx.arc(128, 128, primary ? 106 : 92, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 221, 139, .62)";
  ctx.lineWidth = primary ? 8 : 6;
  ctx.beginPath();
  ctx.arc(128, 128, primary ? 96 : 82, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#221006";
  ctx.font = primary ? "900 102px serif" : "900 72px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, 128, primary ? 132 : 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function toDiceGlyph(value?: number) {
  const values = ["壹", "貳", "叄", "肆", "伍", "陸"];
  return typeof value === "number" && value >= 1 && value <= 6 ? values[value - 1] : "?";
}
