
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { loadStone, getFont, union, intersect, subtractGeometry } from './utils/threeUtils'
import { useSelector } from 'react-redux';
import Bails from './Bails'
import { useControl } from 'react-three-gui';
import { ChangeMode } from '../ThreeGUIControls/guiContolsComponents'
// import { MODEL_GENERATED, GENERATING_MODEL } from '../../lib/constants/designPropsConstants';
// import { designProps as designPropsFunc } from '../../lib/actions/designAction';
import Symbols from './Symbols.js'
import { THREE_UNIT_TO_MM } from '../../lib/constants/designPropsConstants'



let targetStone = null, clickAway = false, geometryWithoutHoles
const bevelProps = {
    // bevelEnabled: true,
    // bevelThickness: 1.5,
    // bevelSize: 1.5,
    // bevelSegments: 10,
    // curveSegments: 50,
}

// let stoneCount = 0
extend({ TextGeometry, TransformControls })
let textGeometry = new TextGeometry()

const pendantModel = ({ controls, guiControls, zoom, model }) => {

    const { designProps } = useSelector(state => state.designProps)
    const {
        text,
        base,
        length,
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
        textGeometry = new TextGeometry(text, {
            font,
            size: length / THREE_UNIT_TO_MM,
            height: thickness / 10,
            ...bevelProps
        })
        geometryWithoutHoles = textGeometry
    }, [text, length, font, thickness, base])


    useEffect(() => {
        if (stoneGroup.current) stoneGroup.current.children = []
    }, [length, font, thickness,])

    const {
        camera,
        gl: { domElement }
    } = useThree()


    // will show a stone over mesh and follows the pointer
    const showStoneOnPendant = e => {
        if (!currStoneColor && !currStoneShape) return
        const { x, y, z } = e.point
        txtSurface.current.geometry.computeBoundingBox()
        // let _z = txtSurface.current.geometry.boundingBox.max.z
        // stone.current.position.set(x, y, thickness)
        stone.current.position.set(x, y, z)
        // stone.current.material.transparent = true
        // stone.current.material.opacity = .5
    }

    // will drop a stone on pendant mesh
    const placeStone = async (e) => {
        if (!currStoneColor && !currStoneShape) return
        const { x, y, z } = e.point
        // await dispatch({ type: GENERATING_MODEL })
        const dia = diamond.clone()
        dia.name = 'stone'
        dia.material.transparent = false
        dia.material.opacity = 1
        // stone.current.position.set(x, y, z - (stoneSize / 9.8))
        stone.current.position.set(x, y, z )
        stoneGroup.current.add(dia)

        textGeometry = subtractGeometry(txtSurface.current, dia)
        txtSurface.current.geometry = textGeometry
        // dispatch({ type: MODEL_GENERATED })
    }

    // removing stone from group
    const removeStone = (e, grp) => {
        if (e.button === 2 && targetStone) {
            let mesh = new THREE.Mesh(geometryWithoutHoles)
            let deletedGeom = intersect(targetStone, mesh)
            let deletedMesh = new THREE.Mesh(deletedGeom, txtSurface.current.material)
            // pendant.current.add(deletedMesh)
            textGeometry = union(deletedMesh, txtSurface.current)
            txtSurface.current.geometry = textGeometry
            grp.current.remove(targetStone)
        }

    }

    useEffect(() => {
        // listeners
        if (transform.current) {
            // disabling Orbit Controls when transform controls are enabled
            const tControls = transform.current
            const callback = (event) => (controls.current.enabled = !event.value)
            tControls.addEventListener('dragging-changed', callback)
            // remove stone listener
            window.addEventListener('pointerdown', (e) => removeStone(e, stoneGroup))
            domElement.addEventListener('click', canvasClickListener)

            // cleanup for listeners
            return () => {
                tControls.removeEventListener('dragging-changed', callback)
                domElement.removeEventListener('click', canvasClickListener)
                window.removeEventListener('pointerdown', (e) => removeStone(e, stoneGroup))
            }
        }
    }, [])

    // gui controls to change transform mode 
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

    // click away listener for transform controls 
    const canvasClickListener = () => {
        console.log(clickAway)
        if (clickAway) {

            transform.current?.detach()
            guiControls.current.style.display = 'none'
            clickAway = !clickAway
        }
    }


    // three render loop
    useFrame((state) => {
        const { x, y, z } = state.camera.position
        light.current.position.set(x, y, z + 10);

        // zoom controls
        if (zoom.isZooming) {
            if (zoom.mode === '-') {
                if (z > 150) return
                state.camera.position.z += 1
            } else {
                if (z < 10) return
                state.camera.position.z -= 1
            }
        }

        // get clicked stone for deletion 
        let intersects = state.raycaster.intersectObjects(stoneGroup.current.children);
        intersects.forEach(obj => {
            if (obj.object.name === 'stone') {
                targetStone = obj.object
            }
        })
        if (intersects.length === 0) targetStone = null

        // click away listener for transform controls 
        let children = [pendant.current.parent]
        // let tControls = transform.current
        // if (tControls) children.push(tControls)
        let intersectsTrans = state.raycaster.intersectObjects(children);
        // console.log(intersectsTrans)
        if (intersectsTrans.length > 0) {
            clickAway = false
        } else {
            clickAway = true
        }

    })

    const onUpdateTxtGeometry = (mesh) => {
        let geometry = mesh.geometry
        geometry.center()
    }




    return (
        <>
            <spotLight angle={1} penumbra={0} ref={light} intensity={.5} />
            <group ref={model}  >
                <group name='pendant' ref={pendant} >
                    <mesh
                        geometry={textGeometry}
                        ref={txtSurface}
                        onClick={placeStone}
                        onPointerMove={showStoneOnPendant}
                        onPointerEnter={() => diamond.visible = true}
                        onPointerLeave={() => diamond.visible = false}
                        onUpdate={onUpdateTxtGeometry}
                    >
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
                    <primitive scale={stoneSize / (10*THREE_UNIT_TO_MM)} ref={stone} object={diamond} color={currStoneColor} visible={false} />
                </group>
                <Symbols props={{
                    txtSurface, guiControls, controls, transform
                }} />
                <Bails txtSurface={txtSurface} controls={controls} guiControls={guiControls} transform={transform} />
            </group>
            <group>
                <transformControls
                    ref={transform}
                    args={[camera, domElement]}
                    mode={mode}
                />
            </group>
        </>
    )
}


export default pendantModel;


