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
                <meshStandardMaterial 
                attach="material" 
                color={base} 
                metalness={1}
                roughness={0} />
            </mesh>
         
        </>
    )
}

export default Bail