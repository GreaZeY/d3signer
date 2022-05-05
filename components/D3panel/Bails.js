import Bail from './Bail'
let diffY =0,diffX
const Bails = ({props}) => {
    const { bails, base, boundingBoxPoints,symbol } = props
    const { min, max } = boundingBoxPoints
//  console.log('bails', min,max )

if(symbol){
    if(symbol==='♡'||symbol==='∞'){
    
    diffX=0
    diffY=0
}else{
    diffX=3
    diffY=max.y-1.5
    }
}else{
    diffX=0
    diffY=0
}
console.log(diffX,diffY)
  return (
    bails.map(bail => (
        bail.position === 'Right' ?
            <Bail
                position={[(max.x + bail.sizes.diameter / 20 * 2)-diffX, diffY, (max.z + min.z) / 2]}
                args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} 
                base={base}
            />
            :
            (
            bail.position === 'Center' ?
                <Bail
                    position={[((max.x + min.x) / 2 +2), max.y / 1.1, (max.z + min.z) / 2]}
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