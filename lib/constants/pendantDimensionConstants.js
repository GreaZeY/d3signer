// all dimension boundaries

// pendant
export const thicknessBounds = { min: 0.7, max: 2 };
export const lengthBounds = { min: 5, max: 50 };

// bails
export const bailDiameterBounds = { min: 0.5, max: 1 };
export const bailThicknessBounds = { min: 0.1, max: 1 };

// letter spacing
export const letterSpacingBounds = { min: 0, max: 5 };

// line Heights
export const  lineHeightsBounds = { min: -2, max: 2 };

// stones
export const stoneSizeBounds = { min: 0.5, max: 10 };

// initial boundingBox with printable dimensions
export const initialBoundingBox = {
  max: {
    x: 10,
    y: 6.14,
    z: 0.35,
  },
  min: {
    x: -10,
    y: -6.14,
    z: -0.35,
  },
};

