import { ThreeBSP } from "./three-csg";
import { FontLoader } from "./FontLoader";
import { useFBX, useGLTF } from "@react-three/drei";
import { fonts } from "../assets/allFonts";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { saveAs } from "file-saver";

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
  let mesh = dia.clone();
  return mesh;
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
  // if (symbol === "Heart") {
  //   shape.moveTo(25, 25);
  //   shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
  //   shape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  //   shape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  //   shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
  //   shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
  //   shape.bezierCurveTo(35, 0, 25, 25, 25, 25);
  //   return shape;
  // }
  // if (symbol === "Star") {
  //   shape.moveTo(0, -50);
  //   shape.lineTo(0, -50);
  //   shape.lineTo(10, -10);
  //   shape.lineTo(40, -10);
  //   shape.lineTo(20, 10);
  //   shape.lineTo(30, 50);
  //   shape.lineTo(0, 20);
  //   shape.lineTo(-30, 50);
  //   shape.lineTo(-20, 10);
  //   shape.lineTo(-40, -10);
  //   shape.lineTo(-10, -10);
  //   return shape;
  // }
  if (symbol) {
    const { paths } = useLoader(SVGLoader, `/assets/symbols/${symbol}.svg`);
    var shapes = [];
    for (var i = 0; i < paths.length; i++) {
      Array.prototype.push.apply(shapes, SVGLoader.createShapes(paths[i]));
    }
    return shapes;
  }
};

// loading bail geometry
export const loadBail = (bail, radius, tube) => {
  let geometry;
  if (bail === "bail0") {
    geometry = new THREE.TorusGeometry(radius, tube, 100, 100);
  } else {
    geometry = useLoader(STLLoader, `/assets/bails/stl/${bail}.stl`);
  }
  geometry.center();
  return geometry;
};

export const load3DModel = (url) => {
  let model = useGLTF(url);
  return model;
};

// Exporters
export const stlExporter = (model, filename) => {
  import("three/examples/jsm/exporters/STLExporter").then((module) => {
    const exporter = new module.STLExporter();
    let str = exporter.parse(model, { binary: true }); // Export the scene
    let blob = new Blob([str], { type: "application/vnd.ms-pki.stl" }); // Generate Blob from the string
    saveAs(blob, filename + ".stl");
  });
};

export const objExporter = (model, filename) => {
  import("three/examples/jsm/exporters/OBJExporter").then((module) => {
    const exporter = new module.OBJExporter();
    let str = exporter.parse(model, { binary: true }); // Export the scene
    let blob = new Blob([str], { type: "text/plain" }); // Generate Blob from the string
    saveAs(blob, filename + ".obj");
  });
};

export const gltfExporter = (model, filename) => {
  import("three/examples/jsm/exporters/GLTFExporter").then((module) => {
    const exporter = new module.GLTFExporter();
    // Export the scene
    exporter.parse(
      model,
      (gltf) => {
        let str = JSON.stringify(gltf, null, 2);
        let blob = new Blob([str], { type: "application/json" }); // Generate Blob from the string
        saveAs(blob, filename + ".gltf");
      },
      // called when there is an error in the generation of GLTF
      (err) => {
        console.log(err);
      }
    );
  });
};

export const getVolume = (geometry) => {
  try {
    if (!geometry.isBufferGeometry) {
      console.log(
        "'geometry' must be an indexed or non-indexed buffer geometry"
      );
      return 0;
    }
    var isIndexed = geometry.index !== null;
    let position = geometry.attributes.position;
    let sum = 0;
    let p1 = new THREE.Vector3(),
      p2 = new THREE.Vector3(),
      p3 = new THREE.Vector3();
    if (!isIndexed) {
      let faces = position.count / 3;
      for (let i = 0; i < faces; i++) {
        p1.fromBufferAttribute(position, i * 3 + 0);
        p2.fromBufferAttribute(position, i * 3 + 1);
        p3.fromBufferAttribute(position, i * 3 + 2);
        sum += signedVolumeOfTriangle(p1, p2, p3);
      }
    } else {
      let index = geometry.index;
      let faces = index.count / 3;
      for (let i = 0; i < faces; i++) {
        p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
        p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
        p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
        sum += signedVolumeOfTriangle(p1, p2, p3);
      }
    }
    return sum;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}
