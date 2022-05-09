// import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { useRef} from 'react'

// import { useSelector } from 'react-redux';

const Bail = (props) => {
   
    // const { user } = useSelector(state => state.user)
    // console.log(designProps)
    const { position, args, base ,camera,domElement,controls} = props

    const bailRef = useRef()

    controls.current.enabled = true

    return (
        <>
        <mesh ref={bailRef} position={position} onPointerEnter={()=>controls.current.enabled = false}  onPointerLeave={()=>controls.current.enabled = true}>
            <torusGeometry args={args} />
            <meshPhysicalMaterial attach="material" color={base} metalness={.9} roughness={0.35} />
        </mesh>
        <dragControls args={[[bailRef.current], camera, domElement]} />
       </>
    )
}

export default Bail