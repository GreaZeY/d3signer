import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { TorusGeometry } from 'three'

const Bail = (props) => {

    const { base, args, transform, currBailType, guiControls } = props
    let { radius, position } = args

    const loadBail = bail => {
        if (bail === 'bail0') {
            const geometry = new TorusGeometry(radius, args.tube, 100, 100);
            return geometry
        }
        return useLoader(STLLoader, `/assets/bails/stl/${bail}.stl`)
    }

    const bailGeometry = useMemo(() => loadBail(currBailType), [currBailType, args]);


    const attachTransformControl= (e) => {
        transform.current.attach(e.object)
        guiControls.current.style.display = 'block'

        console.log(e.object.geometry)
    }

    return (
        <>
            <mesh
                name='bail'
                // scale-z={args.tube}
                // scale-x={args.thickness}
                position={position}
                geometry={bailGeometry}
                scale={currBailType !== 'bail0' ? .01 : .1}
                rotation-y={currBailType === 'bail0' ? 0 : Math.PI/2}
                style={{ cursor: 'pointer' }}
                onClick={attachTransformControl} 
                onUpdate={mesh => mesh.geometry.center()}
                >
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

