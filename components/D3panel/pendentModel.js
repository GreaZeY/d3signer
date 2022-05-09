
import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend } from '@react-three/fiber'
import { fonts } from './assets/allFonts';


import Diamond from './diamond'
import Bails from './Bails'
import Symbol from './Symbols.js'

import { useFrame,useThree } from '@react-three/fiber'

import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
// import {useTexture} from '@react-three/drei'
// import { Union } from '@react-three/drei';


extend({ TextGeometry })
extend({ DragControls })

const PendentModel = (props) => {
    const {
        camera,
        gl: { domElement }
      } = useThree()
    const {
        text,
        base,
        length,
        width,
        thickness,
        font: currFont,
        bails,
        symbol,
        controls
    } = props


    console.log(props)

    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })
    const [boundingBoxPoints2, setBoundingBox2Points] = useState({ max: {}, min: {} })

    const text3d = useRef()
    const textGroup = useRef()
    const textWsymGrp = useRef()
    const light = useRef()
    const bailRef = useRef()
    // const crimptxtr = useTexture('/assets/crimps/dmdtxt.png');




    const font = new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0]);



    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(textGroup.current);
        setBoundingBoxPoints(helper)

       
    //     setTimeout(()=>{
    //         var boundingBox = new THREE.Box3().setFromObject(textWsymGrp.current);
    //     setBoundingBox2Points(boundingBox)        
    // },100)


    }, [props])

  


 
        useFrame((state, delta) => {
            const {x,y,z} =state.camera.position
         light.current.position.set(x,y,z+10);
        })



    //         useEffect(()=>{
    //     let TEXTcontrols = new DragControls([bailRef.current],camera,gl.domElement)
    //     TEXTcontrols.addEventListener('dragstart', event => {

    //       });
    
    //       TEXTcontrols.addEventListener('dragend', event => {
           
    //       });
          
    // },[])



    return (

        <group  >
             <directionalLight ref={light}  intensity={.5} position={[-50, 0, -2500]} />
            <group ref={textWsymGrp} >
                <group ref={textGroup} >
                    <mesh position={[-50, 0, 0]}>
                        <textGeometry ref={text3d} args={[text, { font, size: length, height: thickness, curveSegments: 5, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelOffset: 0,bevelSegments:3 }]} />
                        <meshPhysicalMaterial attach='material' color={base} metalness={1} roughness={.35} />
                    </mesh>
                </group>
                {
                symbol&&
                    <Symbol props={{symbol,setBoundingBox2Points, boundingBoxPoints,base,length,thickness }} />
                }
            </group>
            {bails.length>0&&
                <Bails
                props={{bails ,base, boundingBoxPoints,symBB: boundingBoxPoints,symbol,bailRef,camera,domElement,controls}}
            />}
          

          
                {/* <Diamond  props={{boundingBoxPoints }}/> */}
          



        </group>

    )
}

export default PendentModel






