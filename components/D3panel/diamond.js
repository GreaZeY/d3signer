import { useRef, useEffect, useState } from 'react'
import {useFBX} from '@react-three/drei'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
const pi=3.14
const Diamond = ({props}) => {

  const {boundingBoxPoints} = props
  const { min, max } = boundingBoxPoints

    const dia = useFBX(`/assets/crimps/DIAMOND.fbx`)
    // const dia = useLoader(OBJLoader, `/assets/crimps/dia.obj`)
    // console.log(dia)
    const crimp = useRef()

    useEffect(() => {
        let dmd= crimp.current
        dmd.scale.set(2,2,2)
        dmd.rotation.x=-pi/2
        dmd.position.set(-50,0,max.z)

       


    }, [])



  return (
    <primitive ref={crimp} position={[0,0,0]} object={dia} />
  )
}

export default Diamond