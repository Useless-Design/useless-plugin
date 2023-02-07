export const calcShadowSize = (
  width: number,
  height: number
): calcShadowSizeResult => {
  return {
    x: Math.floor(width / 20),
    y: Math.floor(height / 20),
    insetX: -Math.floor(width / 20),
    insetY: -Math.floor(height / 20),
    blur: Math.floor(Math.max(width, height) / 16),
  };
};
