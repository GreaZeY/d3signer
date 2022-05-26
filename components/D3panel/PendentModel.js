
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


const bevelProps = {
    bevelEnabled: true,
    bevelThickness: 1.5,
    bevelSize: 1.5,
    bevelSegments: 30,
    curveSegments: 10,
}

extend({ TextGeometry })

const PendentModel = ({ controls }) => {

    const { designProps } = useSelector(state => state.designProps)
    const {
        text,
        base,
        length,
        width,
        thickness,
        font: currFont,
        currStone
    } = designProps


    console.log('PendentModel rendered')

    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })
    // const [boundingBoxPoints2, setBoundingBox2Points] = useState({ max: {}, min: {} })

    const txtSurface = useRef()
    const textGroup = useRef()
    const textWsymGrp = useRef()
    const light = useRef()
    const stone = useRef()

    const font = new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0]);

    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(textGroup.current);
        setBoundingBoxPoints(helper)

    }, [designProps])

    useFrame((state,) => {
        const { x, y, z } = state.camera.position
        light.current.position.set(x, y, z + 10);


    })

    const handlePointerMove = e => {
        stone.current.visible=true
        const point = e.point
        stone.current.position.set(point.x, point.y, 6)
    }
    const placeStone = e =>{
        const point = e.point
        const geometry = new THREE.SphereGeometry( .5, 32, 16 );
        const material = new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: .35, color: currStone })
        const dia = new THREE.Mesh( geometry, material );
        dia.position.set(point.x, point.y, 6)
        textWsymGrp.current.add(dia)

    }
    return (

        <group  >
            <directionalLight ref={light} intensity={.5} position={[0, 0, -2500]} />
            <group ref={textWsymGrp} >
                <group ref={textGroup} >
                    <mesh onClick={placeStone} onPointerMove={handlePointerMove} onPointerEnter={()=>stone.current.visible=true} onPointerLeave={()=>stone.current.visible=false} position={[-50, 0, 0]} ref={txtSurface}>
                        <textGeometry args={[text, { font, size: length, height: thickness, ...bevelProps }]} />
                        <meshStandardMaterial
                            attach='material'
                            color={base}
                            wireframe={false}
                            metalness={1}
                            roughness={.3} />
                    </mesh>
                </group>
                <Symbol boundingBoxPoints={boundingBoxPoints} />
                <mesh visible={false} ref={stone} >
                    <sphereBufferGeometry args={[.5, 24, 24]} />
                    <meshBasicMaterial transparent color={"grey"} />
                </mesh>
            </group>



            <Bails controls={controls} />

            {/* diamond and stone component */}
            {/* {txtSurface.current && <Diamond txtSurface={txtSurface} textGroup={textGroup} />} */}

        </group>

    )
}




export default PendentModel;






