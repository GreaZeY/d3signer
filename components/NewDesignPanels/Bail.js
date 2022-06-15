import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { TorusGeometry } from 'three'
// import { useControl } from 'react-three-gui';

const Bail = (props) => {

    const { position, base, args, transform, currBailType } = props
    let radius = args.radius

    const loadBail = bail => {
        if (bail === 'bail0') {
            const geometry = new TorusGeometry(radius, args.tube, 100, 100);
            return geometry
        }
        return useLoader(STLLoader, `/assets/bails/stl/${bail}.stl`)
    }

    const bailGeometry = useMemo(() => loadBail(currBailType), [currBailType, args]);

    return (
        <>
            <mesh 
            // rotation={[rotationX,rotationY,rotationZ]} 
            geometry={bailGeometry}
                scale={currBailType !== 'bail0' ? [radius / 4, radius / 4, radius / 4] : [1, 1, 1]}
                style={{ cursor: 'pointer' }} onClick={(e) => transform.current.attach(e.object)} position={position} >
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

