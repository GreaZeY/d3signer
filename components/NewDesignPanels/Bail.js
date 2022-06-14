import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'


const Bail = (props) => {

    const { position, base, transform, currBailType } = props

    const bailGeometry = useMemo(() => loadBail(currBailType), [currBailType]);
    console.log(bailGeometry)



    return (
        <>
            <mesh rotation={[0, 3.14 / 2, 0]} geometry={bailGeometry.clone()} style={{ cursor: 'pointer' }} onClick={(e) => transform.current.attach(e.object)} position={position} >
                {/* <torusGeometry args={args} /> */}
                <meshStandardMaterial 
                attach="material" 
                color={base} 
                metalness={1}
                roughness={.2} />
            </mesh>
         
        </>
    )
}

export default Bail

const loadBail = bail =>{
    return useLoader(STLLoader, `/assets/bails/stl/${bail}.stl`)
}