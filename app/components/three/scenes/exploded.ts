import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Vector3,
} from "three";
import type {Texture} from "three";
import {posterTextures, websiteLayerTexture} from "~/components/three/textures";
import type {MountScene} from "~/components/three/types";
import {
  PALETTE,
  createLabel,
  createRenderer,
  disposeScene,
  easeInOut,
  fitOrthographic,
  lerp,
  placeLabel,
  segment,
  syncRendererSize,
} from "~/components/three/utils";

export type ExplodedData = {
  /** A real client screenshot, used as the "your photos & words" layer. */
  poster: string;
};

/** Bottom to top — the order a website is actually built in. */
const LAYERS = [
  {title: "Fast, secure hosting", detail: "Your site stays up and loads quickly"},
  {title: "A design you approve", detail: "You say yes before anything is built"},
  {title: "Your photos & words", detail: "Easy for your team to update"},
  {title: "Bookings & payments", detail: "Customers book and pay online"},
  {title: "Looked after, every day", detail: "Checks, fixes and new features"},
] as const;

/** The real client screenshot — the only layer visible before scrolling. */
const SHOWCASE_LAYER = 2;

const layerTexture = (index: number, poster: string): Texture => {
  if (index === 0) return websiteLayerTexture("hosting");
  if (index === 1) return websiteLayerTexture("layout");
  if (index === 2) return posterTextures(poster).sharp;
  if (index === 3) return websiteLayerTexture("checkout");
  return websiteLayerTexture("care");
};

/**
 * Hero: a website pulled apart into the five things the client is paying for.
 * Scroll separates the layers and tilts the stack; labels fade in bottom-up.
 */
export const mountExploded: MountScene<ExplodedData> = ({canvas, labels}, {poster}) => {
  const renderer = createRenderer(canvas);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -60, 60);

  scene.add(new AmbientLight(0xffffff, 1.4));
  const sun = new DirectionalLight(0xffe2cc, 2.2);
  sun.position.set(4, 9, 3);
  scene.add(sun);

  const stack = new Group();
  scene.add(stack);

  const slab = new Mesh(
    new BoxGeometry(5, 0.2, 3.2),
    new MeshStandardMaterial({color: PALETTE.well, roughness: 0.85}),
  );
  slab.position.y = -0.14;
  stack.add(slab);

  const layers = LAYERS.map(({title, detail}, index) => {
    const layer = new Group();
    const isCare = index === LAYERS.length - 1;

    const planeMaterial = new MeshBasicMaterial({
      map: layerTexture(index, poster),
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    });
    const plane = new Mesh(new PlaneGeometry(4.8, 3), planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.renderOrder = index;

    const outlineOpacity = isCare ? 0.9 : 0.55;
    const outlineMaterial = new LineBasicMaterial({
      color: isCare ? PALETTE.accent : PALETTE.rule,
      transparent: true,
      opacity: outlineOpacity,
    });
    const outline = new LineSegments(new EdgesGeometry(new PlaneGeometry(4.8, 3)), outlineMaterial);
    outline.rotation.x = -Math.PI / 2;

    const anchor = new Object3D();
    anchor.position.set(2.4, 0, 1.5);

    layer.add(plane, outline, anchor);
    stack.add(layer);
    return {
      layer,
      anchor,
      planeMaterial,
      outlineMaterial,
      outlineOpacity,
      label: createLabel(labels, "tick", title, detail),
    };
  });

  const lookAt = new Vector3();
  const anchorWorld = new Vector3();

  return {
    frame: ({progress, time, pointer, width, height}) => {
      syncRendererSize(renderer, width, height);
      const eased = easeInOut(progress);
      const gap = lerp(0.05, 1, eased);

      // At rest it reads as one finished site; the other layers appear as it opens.
      const reveal = easeInOut(segment(progress, 0.04, 0.28));
      layers.forEach(({layer, planeMaterial, outlineMaterial, outlineOpacity}, index) => {
        layer.position.y = index * gap + Math.sin(time * 1.2 + index) * 0.04 * eased;
        const shown = index === SHOWCASE_LAYER ? 1 : reveal;
        planeMaterial.opacity = shown;
        outlineMaterial.opacity = outlineOpacity * shown;
      });
      stack.rotation.y = lerp(0, -0.45, eased) + pointer.x * 0.08;

      fitOrthographic(camera, lerp(3.1, 4, eased), width / height, 0.5, 0.02);
      lookAt.set(0, lerp(0.2, 2.1, eased), 0);
      camera.position.set(6, 5.2 + lookAt.y, 6);
      camera.lookAt(lookAt);

      scene.updateMatrixWorld();
      layers.forEach(({anchor, label}, index) => {
        anchor.getWorldPosition(anchorWorld);
        const opacity = easeInOut(segment(progress, 0.16 + index * 0.1, 0.36 + index * 0.1));
        placeLabel(label, anchorWorld, camera, width, height, opacity);
      });

      renderer.render(scene, camera);
    },
    dispose: () => {
      disposeScene(scene);
      renderer.dispose();
    },
  };
};
