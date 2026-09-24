import {
  BufferAttribute,
  BufferGeometry,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
} from "three";
import {posterTextures} from "~/components/three/textures";
import type {MountScene} from "~/components/three/types";
import {
  PALETTE,
  clamp,
  createRenderer,
  disposeScene,
  fitPerspective,
  lerp,
  syncRendererSize,
} from "~/components/three/utils";

export type ParallaxData = {posters: string[]};

/** Distance between screens along the fly-through, in world units. */
const GAP = 5;
/** Camera-to-screen distance at which a screen is in sharp focus. */
const FOCUS = 8.5;

/**
 * Work: the camera glides past real client screenshots. Depth of field is a
 * crossfade between a sharp and a pre-blurred copy of each screen — the look of
 * a bokeh pass for a fraction of the GPU cost.
 */
export const mountParallax: MountScene<ParallaxData> = ({canvas}, {posters}) => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  scene.fog = new Fog(PALETTE.paper, 10, 30);
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);

  const screens = posters.map((src, index) => {
    const {sharp, soft} = posterTextures(src);
    const sharpMaterial = new MeshBasicMaterial({map: sharp, transparent: true});
    const softMaterial = new MeshBasicMaterial({map: soft, transparent: true, depthWrite: false});

    const softPlane = new Mesh(new PlaneGeometry(3.3, 2.06), softMaterial);
    softPlane.position.z = -0.02;
    const group = new Group();
    group.add(softPlane, new Mesh(new PlaneGeometry(3.2, 2), sharpMaterial));
    group.position.set(index % 2 ? 0.55 : -0.35, ((index % 3) - 1) * 0.3, -index * GAP);
    scene.add(group);
    return {group, sharpMaterial, softMaterial};
  });

  const dustCount = 700;
  const dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dust[i * 3] = (Math.random() - 0.5) * 14;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 8;
    dust[i * 3 + 2] = 8 - Math.random() * (posters.length * GAP + 10);
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new BufferAttribute(dust, 3));
  const particles = new Points(
    dustGeometry,
    new PointsMaterial({color: PALETTE.accent, size: 0.035, transparent: true, opacity: 0.55}),
  );
  scene.add(particles);

  const travel = -(posters.length - 1) * GAP;

  return {
    frame: ({progress, time, pointer, width, height}) => {
      syncRendererSize(renderer, width, height);
      fitPerspective(camera, width, height, 0.2);

      const cameraZ = lerp(FOCUS, travel + FOCUS, progress);
      camera.position.set(pointer.x * 0.3, -pointer.y * 0.2, cameraZ);
      camera.lookAt(0, 0, cameraZ - FOCUS);

      screens.forEach(({group, sharpMaterial, softMaterial}, index) => {
        const distance = cameraZ - group.position.z;
        const defocus = Math.abs(distance - FOCUS);
        const focus = clamp(1 - defocus / (GAP * 0.7));
        // Screens the camera is passing fade out well before they fill the frame.
        const visible = clamp((distance - (FOCUS - GAP * 0.6)) / (GAP * 0.35));

        sharpMaterial.opacity = Math.pow(focus, 1.4) * visible;
        softMaterial.opacity = (1 - focus) * 0.9 * visible;
        group.rotation.y = (index % 2 ? -0.2 : 0.2) * (1 - focus) + pointer.x * 0.06;
        group.rotation.x = Math.sin(time * 0.6 + index) * 0.03;
      });
      particles.rotation.z = time * 0.01;

      renderer.render(scene, camera);
    },
    dispose: () => {
      disposeScene(scene);
      renderer.dispose();
    },
  };
};
