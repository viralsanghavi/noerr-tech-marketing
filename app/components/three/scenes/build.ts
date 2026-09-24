import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  RingGeometry,
  Scene,
  SphereGeometry,
  Vector3,
} from "three";
import {windowsTexture} from "~/components/three/textures";
import type {MountScene} from "~/components/three/types";
import {
  PALETTE,
  createRenderer,
  disposeScene,
  easeInOut,
  fitOrthographic,
  lerp,
  segment,
  syncRendererSize,
} from "~/components/three/utils";

/** Footprints of the little campus; `hero` is the one tower picked out in accent. */
const BLOCKS = [
  {x: -1.3, z: -0.8, w: 1, d: 1, h: 1.6, hero: false},
  {x: 0, z: -0.9, w: 0.95, d: 0.95, h: 2.5, hero: true},
  {x: 1.3, z: -0.6, w: 0.8, d: 1.1, h: 1.1, hero: false},
  {x: -1.1, z: 0.7, w: 1.2, d: 0.8, h: 0.8, hero: false},
  {x: 0.3, z: 0.6, w: 0.9, d: 0.9, h: 1.35, hero: false},
  {x: 1.6, z: 1, w: 0.7, d: 0.7, h: 0.6, hero: false},
] as const;

const plotOutline = () => {
  const halfW = 2.4;
  const halfD = 1.8;
  const corners: [number, number][] = [
    [-halfW, -halfD],
    [halfW, -halfD],
    [halfW, halfD],
    [-halfW, halfD],
    [-halfW, -halfD],
  ];
  const points: Vector3[] = [];
  for (let c = 1; c < corners.length; c++) {
    const [ax, az] = corners[c - 1] ?? [0, 0];
    const [bx, bz] = corners[c] ?? [0, 0];
    for (let k = 0; k <= 40; k++) points.push(new Vector3(lerp(ax, bx, k / 40), 0.01, lerp(az, bz, k / 40)));
  }
  return new BufferGeometry().setFromPoints(points);
};

/**
 * Method: the four steps as one build. Quarter by quarter the plot is marked
 * out, the design appears as outlines, the buildings rise, then the lights come
 * on and helpers circle — the part where we stay.
 */
export const mountBuild: MountScene<null> = ({canvas}) => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -60, 60);

  scene.add(new AmbientLight(0xffffff, 1.3));
  const sun = new DirectionalLight(0xffe2cc, 2.2);
  sun.position.set(4, 9, 3);
  scene.add(sun);

  const site = new Group();
  scene.add(site);
  site.add(new GridHelper(9, 18, 0x2e2824, 0x1d1916));

  const plotGeometry = plotOutline();
  const plotPoints = plotGeometry.getAttribute("position").count;
  site.add(new Line(plotGeometry, new LineBasicMaterial({color: PALETTE.accent})));

  const windows = windowsTexture();
  const blocks = BLOCKS.map(({x, z, w, d, h, hero}) => {
    const geometry = new BoxGeometry(w, h, d);
    geometry.translate(0, h / 2, 0);
    const walls = new MeshStandardMaterial({
      color: hero ? 0xb85a22 : 0x2b2420,
      map: windows,
      emissive: 0xffa860,
      emissiveMap: windows,
      emissiveIntensity: 0,
      roughness: 0.7,
    });
    const roof = new MeshStandardMaterial({color: hero ? PALETTE.accent : 0x3a312b, roughness: 0.6});
    // Box face order: +x, -x, +y, -y, +z, -z.
    const mesh = new Mesh(geometry, [walls, walls, roof, roof, walls, walls]);
    const outlineMaterial = new LineBasicMaterial({color: PALETTE.accent, transparent: true, opacity: 0});
    const outline = new LineSegments(new EdgesGeometry(geometry), outlineMaterial);
    mesh.position.set(x, 0, z);
    outline.position.copy(mesh.position);
    site.add(mesh, outline);
    return {mesh, walls, outlineMaterial};
  });

  const helpers = Array.from({length: 6}, () => {
    const helper = new Mesh(new SphereGeometry(0.07, 16, 16), new MeshBasicMaterial({color: PALETTE.accent}));
    site.add(helper);
    return helper;
  });

  const pulseMaterial = new MeshBasicMaterial({
    color: PALETTE.accent,
    transparent: true,
    opacity: 0,
    side: DoubleSide,
  });
  const pulse = new Mesh(new RingGeometry(1, 1.03, 96), pulseMaterial);
  pulse.rotation.x = -Math.PI / 2;
  pulse.position.y = 0.02;
  site.add(pulse);

  return {
    frame: ({progress, time, pointer, width, height}) => {
      syncRendererSize(renderer, width, height);
      fitOrthographic(camera, 3.3, width / height, 0.45, -0.05);
      camera.position.set(7, 6.5, 7);
      camera.lookAt(0, 0.8, 0);
      site.rotation.y = pointer.x * 0.06;

      const plan = segment(progress, 0, 0.22);
      const design = segment(progress, 0.25, 0.47);
      const build = segment(progress, 0.5, 0.72);
      const care = segment(progress, 0.75, 0.92);

      plotGeometry.setDrawRange(0, Math.floor(plotPoints * plan));

      blocks.forEach(({mesh, walls, outlineMaterial}, index) => {
        outlineMaterial.opacity =
          easeInOut(segment(design, index * 0.1, 0.5 + index * 0.1)) * (1 - 0.7 * build);
        const rise = easeInOut(segment(build, index * 0.08, 0.55 + index * 0.08));
        mesh.scale.set(1, Math.max(0.001, rise), 1);
        mesh.visible = rise > 0.002;
        walls.emissiveIntensity = care * (0.8 + Math.sin(time * 2 + index) * 0.2);
      });

      helpers.forEach((helper, index) => {
        const angle = (index / helpers.length) * Math.PI * 2 + time * 0.6;
        helper.position.set(Math.cos(angle) * 3, 2.4 + Math.sin(time * 2 + index) * 0.2, Math.sin(angle) * 2.3);
        helper.scale.setScalar(Math.max(0.001, easeInOut(care)));
      });

      const phase = (time * 0.5) % 1;
      pulse.scale.setScalar(1.5 + phase * 2.2);
      pulseMaterial.opacity = care * (1 - phase) * 0.6;

      renderer.render(scene, camera);
    },
    dispose: () => {
      disposeScene(scene);
      renderer.dispose();
    },
  };
};
