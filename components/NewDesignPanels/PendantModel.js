
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFBX } from '@react-three/drei';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend, useFrame, useThree } from '@react-three/fiber'
import { fonts } from './assets/allFonts';
import { useSelector } from 'react-redux';
import Bails from './Bails'
import { useControl } from 'react-three-gui';
import { ChangeMode } from '../ThreeGUIControls/guiContolsComponents'
// import { MODEL_GENERATED, GENERATING_MODEL } from '../../lib/constants/designPropsConstants';
// import { designProps as designPropsFunc } from '../../lib/actions/designAction';

import Symbol from './Symbols.js'
import { ThreeBSP } from './three-csg'

// import Diamond from './Diamond'
// import { importAll } from '../../lib/utils';
// const stoneModels = importAll(require.context('public/assets/crimps/fbx', false, /\.(fbx)$/));


let targetStone = null, clickAway=false
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

const pendantModel = ({ controls, guiControls, zoom, model }) => {

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

    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })

    const txtSurface = useRef()
    const pendant = useRef()
    const light = useRef()
    const stone = useRef()
    const stoneGroup = useRef()
    const transform = useRef()
    // const instance = useRef()
    // const dispatch = useDispatch()

    const font = useMemo(() => getFont(currFont), [currFont]);

    const diamond = useMemo(() => loadStone(currStoneShape, currStoneColor), [currStoneShape, currStoneColor]);

    useEffect(() => {
        setBoundingBoxPoints(null)
        textGeometry = new TextGeometry(text, {
            font,
            size: length,
            height: thickness * 10,
            ...bevelProps
        })


        // new THREE.Box3().setFromObject(txtSurface.current).getCenter(txtSurface.current.position).multiplyScalar(-1)

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


    const {
        camera,
        gl: { domElement }
    } = useThree()


    // will show a stone over mesh and follows the pointer
    const showStoneOnPendant = e => {
        if (!currStoneColor && !currStoneShape) return
        const point = e.point
        let helper = new THREE.Box3().setFromObject(txtSurface.current);
        stone.current.position.set(point.x, point.y, helper.max.z - (stoneSize / 9.8))
        // stone.current.material.transparent = true
        // stone.current.material.opacity = .5
    }
    // will drop a stone on pendant mesh
    const placeStone = async (e) => {
        if (!currStoneColor && !currStoneShape) return
        const point = e.point
        // await dispatch({ type: GENERATING_MODEL })
        const dia = diamond.clone()
        dia.name = 'stone'
        dia.material.transparent = false
        dia.material.opacity = 1
        let helper = new THREE.Box3().setFromObject(txtSurface.current);
        dia.position.set(point.x, point.y, helper.max.z - (stoneSize / 9.8))
        stoneGroup.current.add(dia)

        // let cloneTxt = txtSurface.current.clone()
        // cloneTxt.scale.set(1)
        textGeometry = subtractGeometry(txtSurface.current, dia)
        txtSurface.current.geometry = textGeometry
        // txtSurface.current.position.set(0, 0, 0)


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

    useEffect(() => {
        if (transform.current) {
            // disabling Orbit Controls when transform controls are enabled
            const tControls = transform.current
            const callback = (event) => (controls.current.enabled = !event.value)
            tControls.addEventListener('dragging-changed', callback)
            window.addEventListener('pointerdown', (e) => onPointerDown(e, stoneGroup))
            domElement.addEventListener('click', canvasClickListener)

            return () => {
                tControls.removeEventListener('dragging-changed', callback)
                domElement.removeEventListener('click', canvasClickListener)
                window.removeEventListener('pointerdown', (e) => onPointerDown(e, stoneGroup))
            }
        }
    })


    const closeControls = () => {
        transform.current?.detach()
        guiControls.current.style.display = 'none'
    }

    let mode = useControl('Mode', {
        type: 'custom',
        value: 'translate',
        component: ChangeMode,
    });

    useControl('Close', { type: 'button', onClick: closeControls });


    const canvasClickListener = (e) => {

        if (clickAway) {
            // transform.current?.detach()
            // guiControls.current.style.display = 'none'
            // clickAway = false
        }
    }


    // three render loop
    useFrame((state) => {
        const { x, y, z } = state.camera.position
        light.current.position.set(x, y, z + 10);
        if (zoom.isZooming) {
            if (zoom.mode === '-') {
                if (z > 150) return
                state.camera.position.z += 1
            } else {
                if (z < 10) return
                state.camera.position.z -= 1
            }
        }

        let intersects = state.raycaster.intersectObjects(stoneGroup.current.children);
        intersects.forEach(obj => {
            if (obj.object.name === 'stone') {
                targetStone = obj.object
            }
        })

        if (intersects.length === 0) targetStone = null

        // click away listener for transform controls 
        let intersectsTrans = state.raycaster.intersectObjects(pendant.current.parent.children);
        if (intersectsTrans.length === 1) clickAway = true

    })


    return (
        <>
            <spotLight angle={1} penumbra={0} ref={light} intensity={.5} />
            <group ref={model}  >
            <group name='pendant' ref={pendant} >
                <mesh
                    geometry={textGeometry}
                    ref={txtSurface}
                    scale-x={width}
                    onClick={placeStone}
                    onPointerMove={showStoneOnPendant}
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
                <primitive scale={stoneSize / 6} ref={stone} object={diamond} color={currStoneColor} visible={false} />
            </group>
            {txtSurface.current && <Symbol txtSurface={txtSurface} guiControls={guiControls} controls={controls} transform={transform} />}
            <Bails txtSurface={txtSurface} controls={controls} guiControls={guiControls} transform={transform} />

            {/* <Html position={[-50, 0, 0]}>
                <div style={{background:'black',color:'white',position:'fixed',top:0,right:0}} >
                    Length:20mm
                </div>
                
            </Html> */}
            </group>
            <group>
            <transformControls
                ref={transform}
                args={[camera, domElement]}
                mode={mode}
            // onUpdate={self => self.attach(symbolRef.current)}
            />
            </group>
        </>
    )
}


export default pendantModel;

//loading font
const getFont = (currFont) => {
    let font = fonts.filter(font => font.original_font_information.fullName === currFont)[0]
    return new FontLoader().parse(font)
}

// loading FBX Stone Model 
export const loadStone = (shape, color) => {
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

const subtractGeometry = (subtractFrom, subtrahendMesh) => {
    const subtrahendBSP = new ThreeBSP(subtrahendMesh);
    const subtractFromBSP = new ThreeBSP(subtractFrom);
    const sub = subtractFromBSP.subtract(subtrahendBSP);
    return sub.toBufferGeometry();
}



