
import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend } from '@react-three/fiber'
import { fonts } from './assets/allFonts';
import { useSelector } from 'react-redux';
import Diamond from './Diamond'
import Bails from './Bails'
import Symbol from './Symbols.js'

import { useFrame } from '@react-three/fiber'

extend({ TextGeometry })

const PendentModel = ({controls}) => {

    const { designProps } = useSelector(state => state.designProps)
    const {
        text,
        base,
        length,
        width,
        thickness,
        font: currFont,
    } = designProps


    console.log('PendentModel rendered')

    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })
    // const [boundingBoxPoints2, setBoundingBox2Points] = useState({ max: {}, min: {} })

    const txtSurface = useRef()
    const textGroup = useRef()
    const textWsymGrp = useRef()
    const light = useRef()

    const font = new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0]);

    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(textGroup.current);
        setBoundingBoxPoints(helper)

    }, [designProps])

    useFrame((state,) => {
        const { x, y, z } = state.camera.position
        light.current.position.set(x, y, z + 10);


    })


    return (

        <group  >
            <directionalLight ref={light} intensity={.5} position={[0, 0, -2500]} />
            <group ref={textWsymGrp} >
                <group ref={textGroup} >
                    <mesh raycast={boundingBoxPoints} position={[-50, 0, 0]} ref={txtSurface}  >
                        <textGeometry args={[text, { font, size: length, height: thickness, curveSegments: 5, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelOffset: 0, bevelSegments: 3 }]} />
                        <meshStandardMaterial
                            attach='material'
                            color={base}
                            metalness={1}
                            roughness={.3} />
                    </mesh>
                </group>
                    <Symbol boundingBoxPoints={boundingBoxPoints} />
            </group>
          
                <Bails controls={ controls }/>

            {/* diamond and stone component */}
            {txtSurface.current && <Diamond txtSurface={ txtSurface } textGroup={textGroup} />}

        </group>

    )
}




export default PendentModel;






