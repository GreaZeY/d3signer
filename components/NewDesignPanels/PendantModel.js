
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend, useFrame } from '@react-three/fiber'
import { fonts } from './assets/allFonts';
import { useSelector, useDispatch } from 'react-redux';
import { MODEL_GENERATED, GENERATING_MODEL } from '../../lib/constants/designPropsConstants';
// import { designProps as designPropsFunc } from '../../lib/actions/designAction';

import Symbol from './Symbols.js'
import { useFBX } from '@react-three/drei';
import { ThreeBSP } from './three-csg'

// import Diamond from './Diamond'
// import { importAll } from '../../lib/utils';
// const stoneModels = importAll(require.context('public/assets/crimps/fbx', false, /\.(fbx)$/));
// console.log(stoneModels)

let targetStone = null
const bevelProps = {
    // bevelEnabled: true,
    // bevelThickness: 1.5,
    // bevelSize: 1.5,
    // bevelSegments: 10,
    // curveSegments: 10,
}

extend({ TextGeometry })

let textGeometry = new TextGeometry()

const pendantModel = () => {

    const { designProps } = useSelector(state => state.designProps)
    const {
        text,
        base,
        length,
        width,
        thickness,
        font: currFont,
        currStoneColor,
        currStoneShape,
    } = designProps;

    const camera = useRef()

    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })

    const txtSurface = useRef()
    const pendant = useRef()
    const light = useRef()
    const stone = useRef()
    const stoneGroup = useRef()
    const dispatch = useDispatch()

    const font = useMemo(() => getFont(currFont), [currFont]);
    const diamond = useMemo(() => loadStone(currStoneShape, currStoneColor, stoneGroup), [currStoneShape, currStoneColor]);

    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(pendant.current);
        setBoundingBoxPoints(helper)

        textGeometry = new TextGeometry(text, {
            font,
            size: length,
            height: thickness,
            ...bevelProps
        })
    }, [text, length, font, thickness, base])

    // useEffect(() => {
    //     stone.current?.material?.color.set(currStoneColor)
    // }, [currStoneColor])

    useEffect(() => {
        if (stoneGroup.current) stoneGroup.current.children = []
    }, [length, font, thickness])


    const handlePointerMove = e => {
        if (!currStoneColor && !currStoneShape) return
        const point = e.point
        stone.current.position.set(point.x, point.y, 3.5)
        // stone.current.material.transparent = true
        // stone.current.material.opacity = .5
    }
    const placeStone = () => {
        if (!currStoneColor && !currStoneShape) return
        dispatch({ type: GENERATING_MODEL })
        const dia = diamond.clone()
        dia.name = 'stone'
        dia.material.transparent = false
        dia.material.opacity = 1
        stoneGroup.current.add(dia)

        const sBSP = new ThreeBSP(dia);
        const bBSP = new ThreeBSP(txtSurface.current);

        const sub = bBSP.subtract(sBSP);
        const newMesh = sub.toMesh();

        // newMesh.material = txtSurface.current.material
        textGeometry = newMesh.geometry
        console.log(txtSurface)
        txtSurface.current.geometry = newMesh.geometry
        // txtSurface.current.position.copy(txtSurface.current.position) 

        txtSurface.current.position.set(0, 0, 0)




        // stoneGroup.current.add(newMesh)

        // txtSurface.current.geometry = dia.geometry
        // setStones([...stones,[point.x,point.y,5]])

        dispatch({ type: MODEL_GENERATED })
    }


    // const [stones,setStones] = useState([])
    useEffect(() => {
        // dispatch(designPropsFunc({...designProps,stones}))
        window.addEventListener('mousedown', (e) => onPointerDown(e, stoneGroup))
        return () => {
            window.removeEventListener('mousedown', (e) => onPointerDown(e, stoneGroup))
        }
    }, [])


    useFrame((state) => {
        const { x, y, z } = state.camera.position
        light.current.position.set(x, y, z + 10);

        let intersects = state.raycaster.intersectObjects(stoneGroup.current.children);
        intersects.forEach(obj => {
            if (obj.object.name === 'stone') {
                targetStone = obj.object
            }
        })
        if (intersects.length === 0) targetStone = null
    })


    return (
        <>
            <directionalLight ref={light} intensity={.5} />
            <perspectiveCamera ref={camera} />

            <group name='pendant' ref={pendant} >
                <mesh geometry={textGeometry} position={[-50, 0, 0]} ref={txtSurface} onClick={placeStone} onPointerMove={handlePointerMove} onPointerEnter={() => diamond.visible = true} onPointerLeave={() => diamond.visible = false}>
                    {/* <bufferGeometry geometry={new THREE.SphereGeometry(30)}  /> */}
                    <meshStandardMaterial
                        attach='material'
                        color={base}
                        wireframe={false}
                        metalness={1}
                        roughness={.3}
                    />
                </mesh>

            </group>
            <group name='stoneGroup' ref={stoneGroup}>
                <primitive ref={stone} object={diamond} color={currStoneColor} visible={false} />
            </group>
            <Symbol boundingBoxPoints={boundingBoxPoints} />
        </>
    )
}




export default pendantModel;

//loading font
const getFont = (currFont) => {
    return new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0])
}

// loading FBX Stone Model 
const loadStone = (shape, color, grp) => {
    if (!shape) return new THREE.Group()
    let path = `/assets/crimps/fbx/${shape}.fbx`
    let dia = useFBX(path)?.children[0].clone()
    dia.rotation.set(Math.PI / 2, Math.PI, 0)
    dia.material = new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: .35 })
    return dia
}

const onPointerDown = (e, grp) => {
    if (e.button === 2 && targetStone) {
        grp.current.remove(targetStone)
    }

}

