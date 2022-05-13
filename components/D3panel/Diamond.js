import { useRef, useEffect, useState,useMemo } from 'react'
import {useFBX,useTexture} from '@react-three/drei'
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

  const norm = useTexture(`/assets/textures/ruby/NORM.jpg`)

  dia.children[0].rotation.set(-pi/2,0,0)
   
    console.log(dia)
    // const crimp = useRef()

    const instance = useRef();
    const { scene } = useThree();

    
    useEffect(() => {
   
    }, [txtSurface.current]);




    useEffect(() => {

    const geometry = txtSurface.current.geometry

    		const vertices = [];
    		const positionAttribute = geometry.getAttribute( 'position' );

        for ( let i = 0; i<positionAttribute.count; i ++ ){
          const vector = new THREE.Vector2();
           vector.fromBufferAttribute( positionAttribute, i );
          //  delete vector.z
           vertices.push(vector)

          }
          // console.log(vertices)
        //   setPoints(vertices)

        const pointsMaterial = new THREE.MeshPhysicalMaterial({ 
          // map: metalTilesbasecolor, 
          // normalMap:norm,
          // displacementMap:norm, 
          // displacementScale:0.1, 
       
          roughness: .35, 
          // aoMap: metalTilesambientOcclusionMap, 
          // metalnessMap: metalTilesmetallic, 
          metalness: 0.7, 
          // envMap: cubeRenderTarget.texture 
      });
      // console.log(pointsMaterial)
      // pointsMaterial.normalMap.wrapS = pointsMaterial.normalMap.wrapT = THREE.RepeatWrapping
      // pointsMaterial.normalMap.repeat.x =10
      // pointsMaterial.normalMap.repeat.y = 10
        const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

    		const points = new THREE.Mesh( pointsGeometry, pointsMaterial );
            points.position.set(-50,0,5)
    // scene.add( points );

    if (points&& instance.current) {
      const sampler = new MeshSurfaceSampler(points).build();
    
      const _position = new THREE.Vector3();
      const _matrix = new THREE.Matrix4();
     
      
      for (let i = 0; i < 5000; i++) {
        console.log(_position)
        sampler.sample(_position);
        
        _matrix.makeTranslation(_position.x, _position.y, _position.z);
 
// console.log(_matrix)
        // if(_position.x>)
        instance.current.setMatrixAt(i, _matrix);
      }
      
      instance.current.instanceMatrix.needsUpdate = true;
      scene.add(instance.current);
    }
   


}, [props])




  return (
    // null
    // <primitive position={[0,0,0]} object={dan} />

    <instancedMesh  position={[-50,0,5]}  ref={instance} args={[
      0,
      dia.children[0].material,
      10000
    ]}>

<sphereGeometry args={[.2]}/>
      <meshPhysicalMaterial attach='material'  metalness={1} roughness={.35} />

          
          
        </instancedMesh>
  )
}

export default Diamond