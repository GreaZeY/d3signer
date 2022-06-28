import { ThreeBSP } from '../three-csg'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useFBX } from '@react-three/drei';
import { fonts } from '../assets/allFonts';
import * as THREE from 'three'
//loading font
export const getFont = (currFont) => {
    let font = fonts.filter(font => font.original_font_information.fullName === currFont)[0]
    return new FontLoader().parse(font)
}

// loading FBX Stone Model 
export const loadStone = (shape, color) => {
    if (!shape) return new THREE.Group()
    let path = `/assets/crimps/fbx/${shape}.fbx`
    let dia = useFBX(path)?.children[0].clone()
    dia.rotation.set(Math.PI / 2, Math.PI, 0)
    dia.material = new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: .05 })
    return dia
}


// return subtracted minuend from subtrahend mesh
export const subtractGeometry = (minuendMesh, subtrahendMesh) => {
    const subtrahendBSP = new ThreeBSP(subtrahendMesh);
    const minuendBSP = new ThreeBSP(minuendMesh);
    const sub = minuendBSP.subtract(subtrahendBSP);
    return sub.toBufferGeometry();
}

// return intersected geometry of two mesh
export const intersect = (mesh1, mesh2) => {
    const mesh2BSP = new ThreeBSP(mesh2);
    const mesh1BSP = new ThreeBSP(mesh1);
    const sub = mesh1BSP.intersect(mesh2BSP);
    return sub.toBufferGeometry();
}

// return union geometry of two mesh
export const union = (mesh1, mesh2) => {
    const mesh2BSP = new ThreeBSP(mesh2);
    const mesh1BSP = new ThreeBSP(mesh1);
    const sub = mesh1BSP.union(mesh2BSP);
    return sub.toBufferGeometry();
}


