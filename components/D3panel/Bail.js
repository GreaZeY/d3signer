
const Bail = (props) => {

    const { position, args, base } = props

    return (
        <mesh position={position} >
            <torusGeometry args={args} />
            <meshStandardMaterial attach="material" color={base} metalness={.6} roughness={0.2} />
        </mesh>
    )
}

export default Bail