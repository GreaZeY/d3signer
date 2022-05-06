// import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { useRef, useEffect, useState } from 'react'

// import { useFrame, } from 'react-three-fiber'

const Bail = (props) => {
   
    
    const { position, args, base ,bailRef,camera,domElement,controls} = props

    controls.current.enabled = true

console.log('bail cam drag',camera, domElement)





    return (
        <>
        <mesh ref={bailRef} position={position} onPointerEnter={()=>controls.current.enabled = false}  onPointerLeave={()=>controls.current.enabled = true}>
            <torusGeometry args={args} />
            <meshPhysicalMaterial attach="material" color={base} metalness={.9} roughness={0.35} />
            
        </mesh>
        <dragControls   args={[[bailRef.current], camera, domElement]} />
       </>
    )
}

export default Bail