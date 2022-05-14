import { useRef, useEffect, useState, useMemo } from 'react'
import { useFBX, useTexture } from '@react-three/drei'
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { useThree } from '@react-three/fiber';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
const pi = 3.14


const Diamond = ({ props }) => {

  const { txtSurface,text } = props


  const loadDia = (path) => {
    return useFBX(path)
  }
  const dia = useMemo(() => loadDia(`/assets/crimps/DIAMOND.fbx`), []);

  // const norm = useTexture(`/assets/textures/ruby/NORM.jpg`)

  dia.children[0].rotation.set(-pi / 2, 0, 0)

  console.log(dia)
  // const crimp = useRef()

  const instance = useRef();
  const { scene } = useThree();
  const stone = useRef();








  useEffect(() => {
 
 
    const geometry = txtSurface.current.geometry

    const vertices = [];
    const positionAttribute = geometry.getAttribute('position');
    const mypoints = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      const vector = new THREE.Vector2();
      vector.fromBufferAttribute(positionAttribute, i);
      //  delete vector.z

     
      
     
      vertices.push(vector)
      mypoints.push({ x: vector.x, y: vector.y })

    }


    // const sgeometry = new THREE.SphereGeometry( 1 );
    const material = new THREE.MeshBasicMaterial( { color: 'red' } );
   
    // for(let i=0 ;i<vertices.length;i++){
      
      
    //   const sphere = new THREE.Mesh( sgeometry, material );
    //   scene.add(sphere)
    //   sphere.position.set(vertices[i].x,vertices[i].y ,10)
    // }


    function compareX( a, b ) {
      if ( a.x < b.x ){
        return -1;
      }
      if ( a.x > b.x ){
        return 1;
      }
      return 0;
    }

    function compareY( a, b ) {
      // if (a.x === b.x) {
      //   // Price is only important when cities are the same
      //   return b.y - a.y;
      // }
      return a.x > b.x ? 1 : -1;
    }

    // mypoints.sort(compareX);
    // mypoints.sort(compareY);



    //console.log(vertices)
    //   setPoints(vertices)

    const pointsMaterial = new THREE.MeshNormalMaterial({
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
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);

    const points = new THREE.Mesh(pointsGeometry, pointsMaterial);
    //points.position.set(-50,0,15)
    // scene.add( points );


    

 
    // if (points && instance.current) {
    //   // const sampler = new MeshSurfaceSampler(points).build();

    //   // const _position = new THREE.Vector3();
    //   const _matrix = new THREE.Matrix4();

    //   console.log(vertices.length)

    //   // _matrix.makeTranslation(vertices[0].x, vertices[0].y, 7);
    //   // instance.current.setMatrixAt(0, _matrix);



    //   // _matrix.makeTranslation(vertices[vertices.length/2].x, vertices[vertices.length/2].y, 7);
    //   // instance.current.setMatrixAt(1, _matrix);



    //   // _matrix.makeTranslation(vertices[vertices.length-1].x, vertices[vertices.length-1].y, 7);
    //   // instance.current.setMatrixAt(2, _matrix);

    //   // _matrix.makeTranslation(0, 0, 0);
    //   // instance.current.setMatrixAt(1, _matrix);

    //   let matCounter = 0
    //   let upwordType = true;
    //   let drawnPoints  = [];
  
    //   for(var i = 0; i < mypoints.length; i++){
    //     // if(mypoints[i].x < mypoints[i+1].x && false) {
    //     //   break;
    //     // } else {
    //       //_matrix.makeTranslation(10, 10, 5);
          
    //       var canDraw = true;

    //       var xnearPoints = drawnPoints.filter((p) => Math.abs(p.x - mypoints[i].x) <  2) || [];
    //       if((xnearPoints || []).length > 0 ) {
    //         var ynearPoints = xnearPoints.filter((p) => Math.abs(p.y - mypoints[i].y) <  2) || [];
    //         if((ynearPoints || []).length > 0){
    //           canDraw = false;
    //         }
    //       }

    //       if(canDraw) {
    //         drawnPoints.push(mypoints[i])
    //       }
    //       // for(var d = 0 ; d< nearPoints.length; d++){
    //       //   if( Math.abs(drawnPoints[d].x - mypoints[i].x) <  2) {
    //       //     canDraw = false;
    //       //   }
    //       // }

    //       if(canDraw) {
    //         _matrix.makeTranslation(mypoints[i].x, mypoints[i].y, 0);
    //         instance.current.setMatrixAt(matCounter, _matrix);
    //         matCounter++;
    //         drawnPoints.push(mypoints[i])
    //       }

         


    //     //}
    //   }


    //   //if(drawnPoints)
    //   _matrix.makeTranslation(0, 10, 0);
    //   instance.current.setMatrixAt(matCounter, _matrix);


    //   for (let i = 100000000000; i < vertices.length; i=i+1000) {

    //  // for (let i = 0; i < vertices.length; i=i+1000) {
    

    //     //sampler.sample(_position);
   
    //     _matrix.makeTranslation(vertices[i].x, vertices[i].y, 7);

    //     // _matrix.makeTranslation(_position.x, _position.y, _position.z);

    //     instance.current.setMatrixAt(i, _matrix);






    //   }

    //   instance.current.instanceMatrix.needsUpdate = true;
    //   stone.current.remove(stone.current.children[0])
    //   stone.current.add(instance.current);
    // }



  }, [text])



console.log(scene)
  return (
    // null
    // <primitive position={[0,0,0]} object={dan} />
<group ref={stone}>
    <instancedMesh position={[-50, 0, 5]} ref={instance} args={[
      0,
      dia.children[0].material,
      10000
    ]}>

      <sphereGeometry args={[.5]} />
      <meshPhysicalMaterial attach='material' metalness={1} roughness={.35} />



    </instancedMesh>
    </group>
  )
}

export default Diamond