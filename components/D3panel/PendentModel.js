
import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend } from '@react-three/fiber'
import { fonts } from './assets/allFonts';
import { useSelector,useDispatch } from 'react-redux';
import { designProps as designPropsFunc } from '../../lib/actions/designAction';
import Bails from './Bails'
import Symbol from './Symbols.js'
import { useFrame ,useThree} from '@react-three/fiber'
import { useFBX } from '@react-three/drei';

// import Diamond from './Diamond'
// import { importAll } from '../../lib/utils';
// const stoneModels = importAll(require.context('public/assets/crimps/fbx', false, /\.(fbx)$/));
// console.log(stoneModels)

let targetStone = null
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
        currStoneColor,
        currStoneShape,
    } = designProps

    const {
        camera,
        gl,scene
    } = useThree()


    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })
    // const [boundingBoxPoints2, setBoundingBox2Points] = useState({ max: {}, min: {} })

    const txtSurface = useRef()
    const textGroup = useRef()
    const pendent = useRef()
    const light = useRef()
    const stone = useRef()
    // const dispatch = useDispatch()

    const font = useMemo(() => getFont(currFont), [currFont]);
    const diamond = useMemo(() => loadStone(currStoneColor, currStoneShape), [currStoneColor, currStoneShape]);

    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(textGroup.current);
        setBoundingBoxPoints(helper)
    }, [designProps])


    const handlePointerMove = e => {
        if(!currStoneColor&&!currStoneShape) return
        const dia = stone.current.clone()
        dia.visible = true
        const point = e.point
        stone.current.position.set(point.x, point.y, 5)
        // stone.current.material.transparent = true
        // stone.current.material.opacity = .5
    }
    const placeStone = e => {
        const point = e.point
        // setStones([...stones,[point.x,point.y,5]])
        const dia = stone.current.clone()
        dia.position.set(point.x, point.y, 5)
        // dia.material.transparent = false
        // dia.material.opacity = 1
        dia.name= 'stone'
        pendent.current.add(dia)
    }


    // const [stones,setStones] = useState([])
    useEffect(() => {
        // dispatch(designPropsFunc({...designProps,stones}))

        window.addEventListener('mousedown',(e)=>{
            if(e.button===2&&targetStone){
                pendent.current.remove(targetStone)
            }
        })
      }, [])


    useFrame((state,) => {
        const { x, y, z } = state.camera.position
        light.current.position.set(x, y, z + 10);

        let intersects = state.raycaster.intersectObjects(pendent.current.children);
        intersects.forEach(obj=>{
            if(obj.object.name==='stone'){
                targetStone = obj.object
            }
        })
        if(intersects.length===0) targetStone = null
        
    })

    return (

        <group  >
            <directionalLight ref={light} intensity={.5} position={[0, 0, -2500]} />
            <group ref={pendent} >
                <group ref={textGroup} >
                    <mesh position={[-50, 0, 0]} ref={txtSurface} onClick={placeStone} onPointerMove={handlePointerMove} onPointerEnter={() => stone.current.visible = true} onPointerLeave={() => stone.current.visible = false}>
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
                <primitive  ref={stone} object={diamond.clone()} />
                </group>


            <Bails controls={controls} />

            {/* diamond and stone component */}
            {/* {txtSurface.current && <Diamond txtSurface={txtSurface} textGroup={textGroup} />} */}

        </group>

    )
}




export default PendentModel;

//loading font
const getFont = (currFont) => {
    return new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0])
}

// loading FBX Stone Model 
const loadStone = (currStoneColor, currStoneShape) => {
    if (!currStoneShape) return new THREE.Group()
    let path = `/assets/crimps/fbx/${currStoneShape}.fbx`
    let dia = useFBX(path)?.children[0].clone()
    dia.rotation.set(Math.PI / 2, Math.PI, 0)
    dia.material = new THREE.MeshPhysicalMaterial({ color: currStoneColor, metalness: 1, roughness: .35 })
    return dia
}





