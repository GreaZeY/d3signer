
import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend } from '@react-three/fiber'
import { fonts } from './assets/allFonts';

import {useTexture} from '@react-three/drei'

import Diamond from './Diamond'
import Bails from './Bails'
import Symbol from './Symbols.js'

import { useFrame,useThree } from '@react-three/fiber'

import {
    sRGBEncoding,
    WebGLCubeRenderTarget,
    RGBFormat,
    LinearMipmapLinearFilter
  } from "three";



const cubeRenderTarget = new WebGLCubeRenderTarget(128, {
    format: RGBFormat,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    encoding: sRGBEncoding
});


extend({ TextGeometry })


const PendentModel = (props) => {
    const {
        camera,
        scene,
        gl,
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

    const txtSurface = useRef()
    const textGroup = useRef()
    const textWsymGrp = useRef()
    const light = useRef()
   
    // const crimptxtr = useTexture('/assets/crimps/dmdtxt.png');




    const font = new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0]);



    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(textGroup.current);
        setBoundingBoxPoints(helper)

       
    //     setTimeout(()=>{
    //         var boundingBox = new THREE.Box3().setFromObject(textWsymGrp.current);
    //     setBoundingBox2Points(boundingBox)        
    // },100)
    // txtSurface.current.material.normalMap.wrapS = txtSurface.current.material.normalMap.wrapT = THREE.RepeatWrapping
    // txtSurface.current.material.normalMap.repeat.x =10
    // txtSurface.current.material.normalMap.repeat.y = 10


    }, [props])

    
  


 
        useFrame((state,) => {
            const {x,y,z} =state.camera.position
         light.current.position.set(x,y,z+10);
        })




    // const texture = useTexture(`/assets/textures/ruby/NORM.jpg`)

    // const textureColor = useTexture(`/assets/textures/ruby/COLOR.jpg`)
    // const disMap = useTexture(`/assets/textures/ruby/DISP.png`)
    // const aoMap = useTexture(`/assets/textures/ruby/OCC.jpg`)

   

    return (

        <group  >
             <directionalLight ref={light}  intensity={.5} position={[0, 0, -2500]} />
             
            <group ref={textWsymGrp} >
                <group ref={textGroup} >
                    <mesh  position={[-50, 0, 0]} ref={txtSurface}>
                        <textGeometry  args={[text, { font, size: length, height: thickness, curveSegments: 5, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelOffset: 0,bevelSegments:3 }]} />
                        <meshStandardMaterial  
                        attach='material' 
                         
                        color={base} 
                        // map={textureColor} 
                        // displacementMap={disMap}
                        // aoMapIntensity={.5}
                        // displacementScale={.5}   
                        // aoMap={aoMap} 
                        // normalMap={texture}  
                        metalness={1} 
                       
                        roughness={.3} />
                    </mesh>
                </group>
                {
                symbol&&
                    <Symbol props={{symbol,setBoundingBox2Points, boundingBoxPoints,base,length,thickness }} />
                }
            </group>
            {bails.length>0&&
                <Bails
                props={{bails ,base, camera,domElement,controls}}
            />}
          

          
               {/* {txtSurface.current&& <Diamond props={{txtSurface,}} />} */}
          



        </group>

    )
}



export default PendentModel






