import { useRef, useEffect } from 'react'

const Bail = (props) => {

    const { position, args, base, setSelectedBail } = props
    const bailRef = useRef()

    useEffect(() => {
        setSelectedBail(bailRef)
    }, [])


    return (
        <>
            <mesh ref={bailRef} style={{ cursor: 'pointer' }} onClick={() => setSelectedBail(bailRef)} position={position} >
                <torusGeometry args={args} />
                <meshPhysicalMaterial attach="material" color={base} metalness={1} roughness={0.35} />
            </mesh>
         
        </>
    )
}

export default Bail