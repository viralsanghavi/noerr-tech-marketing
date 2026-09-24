import {CanvasTexture, SRGBColorSpace} from "three";

const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"IBM Plex Sans", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const makeCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas unavailable");
  return {canvas, context};
};

const toTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

const roundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
};

export type WebsiteLayer = "hosting" | "layout" | "checkout" | "care";

/**
 * The drawn layers of the hero's exploded website. The content layer is a real
 * client screenshot instead — see posterTextures.
 */
export const websiteLayerTexture = (layer: WebsiteLayer) => {
  const {canvas, context: g} = makeCanvas(960, 600);

  switch (layer) {
    case "hosting": {
      g.fillStyle = "#15110f";
      roundRect(g, 0, 0, 960, 600, 24);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.05)";
      for (let x = 40; x < 960; x += 40) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, 600);
        g.stroke();
      }
      for (let y = 40; y < 600; y += 40) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(960, y);
        g.stroke();
      }
      g.fillStyle = "rgba(242,238,232,0.45)";
      g.font = `500 24px ${MONO}`;
      g.fillText("HOSTING · SECURITY · SPEED", 48, 548);
      break;
    }
    case "layout": {
      g.setLineDash([14, 10]);
      g.strokeStyle = "rgba(242,238,232,0.55)";
      g.lineWidth = 3;
      const boxes: [number, number, number, number][] = [
        [40, 30, 880, 56],
        [40, 130, 400, 200],
        [490, 130, 430, 280],
        [40, 440, 270, 120],
        [345, 440, 270, 120],
        [650, 440, 270, 120],
      ];
      boxes.forEach(([x, y, w, h]) => {
        roundRect(g, x, y, w, h, 10);
        g.stroke();
      });
      g.setLineDash([]);
      g.fillStyle = "rgba(242,238,232,0.5)";
      g.font = `500 20px ${MONO}`;
      g.fillText("YOUR LOGO", 60, 66);
      g.fillText("HEADLINE", 60, 170);
      break;
    }
    case "checkout": {
      g.fillStyle = "rgba(242,238,232,0.96)";
      roundRect(g, 560, 250, 360, 300, 16);
      g.fill();
      g.fillStyle = "#1a1512";
      g.font = `600 28px ${SANS}`;
      g.fillText("Checkout", 592, 300);
      g.fillStyle = "#6b625b";
      g.font = `400 22px ${SANS}`;
      g.fillText("Order total", 592, 340);
      g.fillStyle = "#1a1512";
      g.font = `400 44px ${SERIF}`;
      g.fillText("₹2,499", 592, 408);
      g.fillStyle = "#ED7D31";
      roundRect(g, 592, 440, 296, 72, 10);
      g.fill();
      g.fillStyle = "#0B0A08";
      g.font = `600 24px ${SANS}`;
      g.fillText("Pay securely", 668, 485);
      g.fillStyle = "rgba(143,191,122,0.18)";
      roundRect(g, 40, 470, 330, 70, 35);
      g.fill();
      g.fillStyle = "#8FBF7A";
      g.font = `600 24px ${SANS}`;
      g.fillText("✓  Order confirmed", 72, 514);
      break;
    }
    case "care": {
      g.fillStyle = "rgba(255,255,255,0.05)";
      roundRect(g, 0, 0, 960, 600, 24);
      g.fill();
      g.strokeStyle = "rgba(237,125,49,0.9)";
      g.lineWidth = 4;
      roundRect(g, 2, 2, 956, 596, 24);
      g.stroke();
      g.fillStyle = "#ED7D31";
      g.font = `500 24px ${MONO}`;
      g.fillText("LOOKED AFTER BY NOERR", 48, 70);
      g.fillStyle = "rgba(242,238,232,0.9)";
      g.font = `500 30px ${SANS}`;
      g.fillText("✓ Checks    ✓ Fixes    ✓ New features", 48, 130);
      break;
    }
  }

  return toTexture(canvas);
};

/**
 * A client screenshot as two textures: sharp, and pre-blurred for the
 * depth-of-field fade. Both start blank and fill in when the image arrives.
 */
export const posterTextures = (src: string) => {
  const sharp = makeCanvas(1024, 640);
  const soft = makeCanvas(512, 320);
  sharp.context.fillStyle = "#1d1814";
  sharp.context.fillRect(0, 0, 1024, 640);
  soft.context.fillStyle = "#1d1814";
  soft.context.fillRect(0, 0, 512, 320);

  const sharpTexture = toTexture(sharp.canvas);
  const softTexture = toTexture(soft.canvas);

  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    sharp.context.drawImage(image, 0, 0, 1024, 640);
    // Safari ignores ctx.filter; the half-size copy still reads as soft there.
    soft.context.filter = "blur(7px)";
    soft.context.drawImage(image, 0, 0, 512, 320);
    sharpTexture.needsUpdate = true;
    softTexture.needsUpdate = true;
  };
  image.src = src;

  return {sharp: sharpTexture, soft: softTexture};
};

export const glowTexture = () => {
  const {canvas, context: g} = makeCanvas(256, 256);
  const gradient = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, 256, 256);
  return toTexture(canvas);
};

/** Lit windows for the isometric build — used as both colour and glow map. */
export const windowsTexture = () => {
  const {canvas, context: g} = makeCanvas(128, 256);
  g.fillStyle = "#231d19";
  g.fillRect(0, 0, 128, 256);
  g.fillStyle = "#f6c089";
  for (let y = 16; y < 240; y += 32) {
    for (let x = 14; x < 120; x += 36) g.fillRect(x, y, 20, 14);
  }
  return toTexture(canvas);
};
