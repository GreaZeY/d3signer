
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend, useFrame } from '@react-three/fiber'
import {Html} from '@react-three/drei'
import { fonts } from './assets/allFonts';
import { useSelector, useDispatch } from 'react-redux';

// import { MODEL_GENERATED, GENERATING_MODEL } from '../../lib/constants/designPropsConstants';
// import { designProps as designPropsFunc } from '../../lib/actions/designAction';

import Symbol from './Symbols.js'
import { useFBX } from '@react-three/drei';
import { ThreeBSP } from './three-csg'

// import Diamond from './Diamond'
// import { importAll } from '../../lib/utils';
// const stoneModels = importAll(require.context('public/assets/crimps/fbx', false, /\.(fbx)$/));


let targetStone = null
const bevelProps = {
    // bevelEnabled: true,
    // bevelThickness: 1.5,
    // bevelSize: 1.5,
    // bevelSegments: 10,
    curveSegments: 50,
}

// let stoneCount = 0
extend({ TextGeometry })
let textGeometry = new TextGeometry()

const pendantModel = ({ controls}) => {

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
        stoneSize
    } = designProps;

    const camera = useRef()

    // const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })

    const txtSurface = useRef()
    const pendant = useRef()
    const light = useRef()
    const stone = useRef()
    const stoneGroup = useRef()
    // const instance = useRef()
    // const dispatch = useDispatch()

    const font = useMemo(() => getFont(currFont), [currFont]);

    const diamond = useMemo(() => loadStone(currStoneShape, currStoneColor, stoneGroup), [currStoneShape, currStoneColor]);

    useEffect(() => {
        textGeometry = new TextGeometry(text, {
            font,
            size: length,
            height: thickness,
            ...bevelProps
        })

    //     setTimeout(()=>{

    //     if (!txtSurface.current.geometry) return console.log('returned from tto')
        
    //     // new THREE.Box3().setFromObject(txtSurface.current).getCenter(txtSurface.current.position).multiplyScalar(-1)

    //         let box3 = new THREE.Box3().setFromObject(txtSurface.current);
    //     console.log(box3)
    //     txtSurface.current.position.x = (box3.max.x - box3.min.x) / 2;
    //     txtSurface.current.position.y = (box3.max.y - box3.min.y) / 2;
    // },5000)


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
        let helper = new THREE.Box3().setFromObject(txtSurface.current);
        stone.current.position.set(point.x, point.y, helper.max.z-(stoneSize/9.8))
        // stone.current.material.transparent = true
        // stone.current.material.opacity = .5
    }
    const placeStone = async () => {
        if (!currStoneColor && !currStoneShape) return
        // await dispatch({ type: GENERATING_MODEL })
        const dia = diamond.clone()
        dia.name = 'stone'
        dia.material.transparent = false
        dia.material.opacity = 1
        stoneGroup.current.add(dia)

        textGeometry = subtractGeometry(txtSurface.current, dia)
        txtSurface.current.geometry = textGeometry
        txtSurface.current.position.set(0, 0, 0)


        // const _matrix = new THREE.Matrix4();

        
        // _matrix.makeTranslation(dia.position.x, dia.position.y, dia.position.z);

        // _matrix.makeRotationX(Math.PI / 2) 


        // instance.current.setMatrixAt(stoneCount, _matrix);
        
        
        // instance.current.instanceMatrix.needsUpdate = true;

        // // instance.current.position.copy(txtSurface.current.position)


        // stoneCount++




        // txtSurface.current.geometry = dia.geometry
        // setStones([...stones,[point.x,point.y,5]])

        // dispatch({ type: MODEL_GENERATED })
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
            <spotLight  angle={1} penumbra={0} ref={light} intensity={.5} />
            <perspectiveCamera ref={camera} />

            <group name='pendant' ref={pendant} >
                <mesh 
                geometry={textGeometry} 
                position={[-50, 0, 0]} 
                ref={txtSurface} 
                onClick={placeStone} 
                onPointerMove={handlePointerMove} 
                onPointerEnter={() => diamond.visible = true} 
                onPointerLeave={() => diamond.visible = false}>
                    
                    <meshStandardMaterial
                        attach='material'
                        color={base}
                        metalness={.98}
                        roughness={.15}
                    />
                </mesh>
            </group>
            {/* <instancedMesh position={[-50, 0, 10]} ref={instance} args={[
                diamond.geometry,
                diamond.material,
                1000
            ]}></instancedMesh> */}
            <group name='stoneGroup' ref={stoneGroup}>
                <primitive scale={stoneSize/6} ref={stone} object={diamond} color={currStoneColor} visible={false} />
            </group>
            {txtSurface.current && <Symbol txtSurface={txtSurface} controls={controls}/>}

            {/* <Html position={[-50, 0, 0]}>
                <div style={{background:'black',color:'white',position:'fixed',top:0,right:0}} >
                    Length:20mm
                </div>
                
            </Html> */}
        </>
    )
}




export default pendantModel;

//loading font
const getFont = (currFont) => {
    return new FontLoader().parse(fonts.filter(font => font.original_font_information.fullName === currFont)[0])
}

// loading FBX Stone Model 
const loadStone = (shape, color) => {
    if (!shape) return new THREE.Group()
    let path = `/assets/crimps/fbx/${shape}.fbx`
    let dia = useFBX(path)?.children[0].clone()
    dia.rotation.set(Math.PI / 2, Math.PI, 0)
    dia.material = new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: .05 })
    return dia
}

const onPointerDown = (e, grp) => {
    if (e.button === 2 && targetStone) {
        grp.current.remove(targetStone)
    }

}

const subtractGeometry = (subtractFrom, subtrahendMesh)=>{
    const subtrahendBSP = new ThreeBSP(subtrahendMesh);
    const subtractFromBSP = new ThreeBSP(subtractFrom);
    const sub = subtractFromBSP.subtract(subtrahendBSP);
    return sub.toBufferGeometry();
}
