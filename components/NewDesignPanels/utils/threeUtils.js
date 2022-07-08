import { ThreeBSP } from "../three-csg";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { useFBX, useGLTF } from "@react-three/drei";
import { fonts } from "../assets/allFonts";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

//loading font
export const getFont = (currFont) => {
  let font = fonts.filter(
    (font) => font.original_font_information.fullName === currFont
  )[0];
  return new FontLoader().parse(font);
};

// loading FBX Stone Model
export const loadStone = (shape, color) => {
  if (!shape) return new THREE.Group();
  let path = `/assets/crimps/fbx/${shape}.fbx`;
  let dia = useFBX(path)?.children[0].clone();
  dia.rotation.set(Math.PI / 2, Math.PI, 0);
  dia.material = new THREE.MeshStandardMaterial({
    color,
    metalness: 1,
    roughness: 0.05,
  });
  dia.geometry.center();
  return dia;
};

// return subtracted minuend from subtrahend mesh
export const subtractGeometry = (minuendMesh, subtrahendMesh) => {
  const subtrahendBSP = new ThreeBSP(subtrahendMesh);
  const minuendBSP = new ThreeBSP(minuendMesh);
  const sub = minuendBSP.subtract(subtrahendBSP);
  return sub.toBufferGeometry();
};

// return intersected geometry of two mesh
export const intersect = (mesh1, mesh2) => {
  const mesh2BSP = new ThreeBSP(mesh2);
  const mesh1BSP = new ThreeBSP(mesh1);
  const sub = mesh1BSP.intersect(mesh2BSP);
  return sub.toBufferGeometry();
};

// return union geometry of two mesh
export const union = (mesh1, mesh2) => {
  const mesh2BSP = new ThreeBSP(mesh2);
  const mesh1BSP = new ThreeBSP(mesh1);
  const sub = mesh1BSP.union(mesh2BSP);
  return sub.toBufferGeometry();
};

export const createShape = (symbol) => {
  const shape = new THREE.Shape();
  if (symbol === "Heart") {
    shape.moveTo(25, 25);
    shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    shape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    shape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    shape.bezierCurveTo(35, 0, 25, 25, 25, 25);
    return shape;
  }
  if (symbol === "Star") {
    shape.moveTo(0, 50);
    shape.lineTo(0, 50);
    shape.lineTo(10, 10);
    shape.lineTo(40, 10);
    shape.lineTo(20, -10);
    shape.lineTo(30, -50);
    shape.lineTo(0, -20);
    shape.lineTo(-30, -50);
    shape.lineTo(-20, -10);
    shape.lineTo(-40, 10);
    shape.lineTo(-10, 10);
    return shape;
  }
  if (symbol) {
    const { paths } = useLoader(SVGLoader, `/assets/symbols/${symbol}.svg`);
    var shapes = [];
    for (var i = 0; i < paths.length; i++) {
      Array.prototype.push.apply(shapes, SVGLoader.createShapes(paths[i]));
    }
    return shapes;
  }
};

export const createShapeFromPoints = (points) => {
  console.log(points);
  const shape = new THREE.Shape();
  points.forEach((pts, i) => {
    if (i === 0) {
      shape.moveTo(pts.x, pts.y);
    }
    shape.lineTo(pts.x, pts.y);
  });
  return shape;
};

export const load3DModel = (url) => {
  let model = useGLTF(url);
  return model;
};
