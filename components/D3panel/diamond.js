import { useRef, useEffect, useState,useMemo } from 'react'
import {useFBX} from '@react-three/drei'
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
const pi=3.14

import {useThree } from '@react-three/fiber'
const Diamond = ({props}) => {

  const {txtSurface} =  props


  const loadDia=(path)=>{
    return useFBX(path)
   }
  const dia = useMemo(() => loadDia(`/assets/crimps/DIAMOND.fbx`), []);
   
    console.log(dia)
    // const crimp = useRef()

    const instance = useRef();
    const { scene } = useThree();

    
    useEffect(() => {
      if (txtSurface.current && instance.current) {
        const sampler = new MeshSurfaceSampler(txtSurface.current).build();
        const _position = new THREE.Vector3();
        const _matrix = new THREE.Matrix4();
  
        for (let i = 0; i < 100; i++) {
          sampler.sample(_position);
          _matrix.makeTranslation(_position.x, _position.y, _position.z);
          instance.current.setMatrixAt(i, _matrix);
        }
        instance.current.instanceMatrix.needsUpdate = true;
        scene.add(instance.current);
      }
    }, [txtSurface.current]);


  return (
    // <primitive ref={crimp} position={[0,0,0]} object={dia} />

    <instancedMesh rotate={[-pi/2,0,0]} position={[-50,0,0]} ref={instance} args={[
      dia.children[0].geometry,
      dia.children[0].material,
      1000
    ]}>

      
          
          
        </instancedMesh>
  )
}

export default Diamond