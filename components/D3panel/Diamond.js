import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber';
// import {mergeVertices}  from "three/examples/jsm/utils/BufferGeometryUtils";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const Diamond = ({ txtSurface }) => {
  const { designProps } = useSelector(state => state.designProps)
  const { text, crimps, font, length } = designProps

  const { scene,camera } = useThree()


  const stone = useRef();
  function onPointerMove( event ) {
 
  //   pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  //   pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  //   raycaster.setFromCamera( pointer, camera );

    
  //   const intersects = raycaster.intersectObjects( txtSurface.current.parent.children );
  // console.log(intersects)

  // if(intersects.length>1){
  //   intersects[ 0 ].object.material.color.set( 0xff0000 );
  //     console.log(pointer)

  // }
  
      
    
  
    
 
  
  }



  useEffect(() => {
    window.addEventListener( 'pointermove', onPointerMove );

  }, [text, crimps, font, length])




  return (
    <group ref={stone}>
    </group>
  )
}

export default Diamond