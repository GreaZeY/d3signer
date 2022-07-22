import { ThreeBSP } from "../three-csg";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { useFBX, useGLTF } from "@react-three/drei";
import { fonts } from "../assets/allFonts";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
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

// Exporters
export const stlExporter = (model, filename) => {
  import("three/examples/jsm/exporters/STLExporter").then((module) => {
    const exporter = new module.STLExporter();
    let str = exporter.parse(model, { binary: true }); // Export the scene
    let blob = new Blob([str], { type: "text/plain" }); // Generate Blob from the string
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

export const savePng = async (currDesign, alert) => {
  const dataURL = await getCanvasImgData(currDesign, alert);
  const blob = await fetch(dataURL).then((r) => r.blob());
  console.log(blob);
  saveAs(blob, currDesign.text + ".png");
};

export const getCanvasImgData = async (currDesign, alert) => {
  let canvas = document.getElementsByTagName("canvas");
  canvas = canvas[canvas.length - 1];
  const canvas2d = document.createElement("canvas");
  var context = canvas2d.getContext("2d");
  canvas2d.width = canvas.width;
  canvas2d.height = canvas.height;
  context.font = "12px Rubik";
  context.fillRect(0, 0, canvas2d.width, canvas2d.height);
  context.fillStyle = "white";
  const imObjFunction = () => {
    return new Promise((resolve) => {
      var imageObj = new Image();
      imageObj.onload = function () {
        context.drawImage(imageObj, 0, 0);
        context.fillText(`Width: ${currDesign.length}mm`, 20, 20);
        context.fillText(`Thickness: ${currDesign.thickness}mm`, 120, 20);
        context.fillText(`Stone Size: ${currDesign.stoneSize}mm`, 220, 20);
        context.fillText(`Base: ${currDesign.base}`, 320, 20);
        context.fillText(`No. of Bails: ${currDesign.bails.length}`, 420, 20);
        context.fillText(`Stone Size: ${currDesign.stoneSize}`, 520, 20);
        resolve(true);
      };
      imageObj.src = canvas.toDataURL("image/png");
    });
  };
  const isDrawn = await imObjFunction();
  // document.body.appendChild(canvas2d)
  if (isDrawn) return canvas2d.toDataURL("image/png");

  canvas2d.remove();
  alert.error("An Error Occurred!");
};



export const createText = () => {

  let canvas = getCanvas()
  console.log(canvas);

};


  const getCanvas = async () => {
    let text1 = document.createElement("div");
    text1.style.color = "black";
    text1.style.fontSize = "400px";
    text1.innerText = "JOD";
    console.log(text1);
    let canvas = await html2canvas(text1);
    console.log(document.body);
    document.body.appendChild(canvas);
    return canvas;
  };