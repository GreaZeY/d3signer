import Bail from './Bail'

const Bails = ({props}) => {
    const { bails, base, boundingBoxPoints } = props
    const { min, max } = boundingBoxPoints
    console.log(boundingBoxPoints)
  return (
    bails.map(bail => (
        bail.position === 'Right' ?
            <Bail
                position={[max.x + bail.sizes.diameter / 20 * 2, 0, (max.z + min.z) / 2]}
                args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} 
                base={base}
            />
            :
            (
            bail.position === 'Center' ?
                <Bail
                    position={[((max.x + min.x) / 2 + 3), max.y / 1.1, (max.z + min.z) / 2]}
                    args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                    base={base}
                />
                :
                (

                bail.position === 'Left' ?
                    <Bail
                        position={[min.x + -bail.sizes.diameter / 20 * 2, 0, (max.z + min.z) / 2]}
                        args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                        base={base}
                    />
                    :
                    <Bail
                        position={[max.x + bail.sizes.diameter / 20, 0, (max.z + min.z) / 2]}
                        args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                        base={base}
                    />


                )


            )
    ))
    
  )
}

export default Bails