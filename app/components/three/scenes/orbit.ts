import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import type {Material} from "three";
import {glowTexture} from "~/components/three/textures";
import type {MountScene} from "~/components/three/types";
import {
  PALETTE,
  clamp,
  createLabel,
  createRenderer,
  disposeScene,
  easeInOut,
  fitPerspective,
  lerp,
  placeLabel,
  segment,
  syncRendererSize,
} from "~/components/three/utils";

export type OrbitData = {
  /** Inner ring — what we do. */
  services: string[];
  /** Outer ring — who we've done it for. */
  clients: string[];
};

const unitCircle = () => {
  const points: Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new Vector3(Math.cos(angle), 0, Math.sin(angle)));
  }
  return new BufferGeometry().setFromPoints(points);
};

/**
 * Capabilities: "your business" at the centre, services orbiting close and
 * clients further out. Scroll grows the rings and tilts the camera from
 * side-on to overhead.
 */
export const mountOrbit: MountScene<OrbitData> = ({canvas, labels}, {services, clients}) => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);

  scene.add(new AmbientLight(0xffffff, 1.2));
  const sun = new DirectionalLight(0xffe2cc, 2);
  sun.position.set(3, 8, 5);
  scene.add(sun);

  const core = new Mesh(
    new SphereGeometry(0.8, 48, 48),
    new MeshStandardMaterial({
      color: 0x2a1a10,
      emissive: PALETTE.accent,
      emissiveIntensity: 0.6,
      roughness: 0.35,
    }),
  );
  const shell = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(1.18, 1)),
    new LineBasicMaterial({color: PALETTE.accent, transparent: true, opacity: 0.35}),
  );
  const glowMaterial = new SpriteMaterial({
    map: glowTexture(),
    color: PALETTE.accent,
    transparent: true,
    opacity: 0.55,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const glow = new Sprite(glowMaterial);
  glow.scale.set(5.5, 5.5, 1);
  scene.add(glow, core, shell);

  const coreAnchor = new Object3D();
  coreAnchor.position.set(0, -1.25, 0);
  scene.add(coreAnchor);
  const coreLabel = createLabel(labels, "core", "Your business");

  const makeRing = (
    names: string[],
    tone: "pill" | "faint",
    geometry: BufferGeometry,
    material: Material,
    tilt: number,
  ) => {
    const group = new Group();
    group.rotation.x = tilt;
    scene.add(group);
    const lineMaterial = new LineBasicMaterial({color: PALETTE.rule, transparent: true, opacity: 0});
    const line = new Line(unitCircle(), lineMaterial);
    group.add(line);
    const satellites = names.map((name) => {
      const mesh = new Mesh(geometry, material);
      group.add(mesh);
      return {mesh, label: createLabel(labels, tone, name)};
    });
    return {line, lineMaterial, satellites};
  };

  const inner = makeRing(
    services,
    "pill",
    new SphereGeometry(0.15, 24, 24),
    new MeshStandardMaterial({color: PALETTE.ink, emissive: 0x3a2c22, roughness: 0.4}),
    -0.1,
  );
  const outer = makeRing(
    clients,
    "faint",
    new OctahedronGeometry(0.1),
    new MeshBasicMaterial({color: PALETTE.accent}),
    0.28,
  );

  const world = new Vector3();

  return {
    frame: ({progress, time, pointer, width, height}) => {
      syncRendererSize(renderer, width, height);
      fitPerspective(camera, width, height, 0.24);

      const innerIn = easeInOut(segment(progress, 0, 0.45));
      const outerIn = easeInOut(segment(progress, 0.35, 0.85));
      const innerRadius = lerp(0.9, 2.6, innerIn);
      const outerRadius = lerp(1, 4, outerIn);
      const spin = time * 0.22 + progress * Math.PI;

      const rings = [
        {ring: inner, radius: innerRadius, reveal: innerIn, direction: 1, lineOpacity: 0.7},
        {ring: outer, radius: outerRadius, reveal: outerIn, direction: -0.6, lineOpacity: 0.6},
      ];

      rings.forEach(({ring, radius, reveal, direction, lineOpacity}) => {
        ring.line.scale.setScalar(radius);
        ring.lineMaterial.opacity = lineOpacity * reveal;
        ring.satellites.forEach(({mesh}, index) => {
          const angle = (index / ring.satellites.length) * Math.PI * 2 + spin * direction;
          mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          mesh.scale.setScalar(Math.max(0.001, reveal));
        });
      });

      const elevation = lerp(0.1, 0.95, easeInOut(progress));
      const distance = lerp(11, 16, progress);
      camera.position.set(
        pointer.x * 0.6,
        Math.sin(elevation) * distance,
        Math.cos(elevation) * distance,
      );
      camera.lookAt(0, 0, 0);

      core.rotation.y = time * 0.2;
      shell.rotation.set(time * 0.05, -time * 0.12, 0);
      glowMaterial.opacity = 0.45 + Math.sin(time * 1.6) * 0.1;

      scene.updateMatrixWorld();
      coreAnchor.getWorldPosition(world);
      placeLabel(coreLabel, world, camera, width, height, 1);

      rings.forEach(({ring, radius, reveal}) => {
        ring.satellites.forEach(({mesh, label}) => {
          mesh.getWorldPosition(world);
          // Satellites on the near side of the orbit read brighter.
          const nearness = clamp((world.z + radius) / (2 * radius));
          placeLabel(label, world, camera, width, height, reveal * (0.35 + 0.65 * nearness));
        });
      });

      renderer.render(scene, camera);
    },
    dispose: () => {
      disposeScene(scene);
      renderer.dispose();
    },
  };
};
