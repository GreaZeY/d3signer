import Bail from './Bail'
import { useFrame, useThree} from 'react-three-fiber'

let diffY =0,diffX
const Bails = ({props}) => {
    const { bails, base, boundingBoxPoints,symbol,symBB,bailRef,camera,domElement,controls } = props
    const { min, max } = boundingBoxPoints
    const { min:smin, max:smax } = symBB
 console.log('bails', min,max )

 console.log(symBB)

if(symbol){
    if(symbol==='♡'||symbol==='∞'){
    
    diffX=0
    diffY=0
}else{
    diffX=3.5
    diffY=max.y-1.5
    }
}else{
    diffX=0
    diffY=0
}
console.log(diffX,diffY)

    // useFrame((state, delta) => {
    //   console.log(state,delta)

      

    // })


  return (
    bails.map(bail => (
        bail.position === 'Right' ?
            <Bail
                position={[(smax.x + bail.sizes.diameter / 20 * 2)-diffX, symbol?smax.y:0, (smax.z + smin.z) / 2]}
                args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} 
                base={base}
                bailRef={bailRef}
                camera={camera}
                domElement={domElement}
                controls={controls}
            />
            :
            (
            bail.position === 'Center' ?
                <Bail
                    position={[((max.x + min.x) / 2 +2), max.y / 1.1, (max.z + min.z) / 2]}
                    args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                    base={base}
                    bailRef={bailRef}
                    camera={camera}
                domElement={domElement}
                controls={controls}
                />
                :
                (

                bail.position === 'Left' ?
                    <Bail
                        position={[min.x + -bail.sizes.diameter / 20 * 2, 0, (max.z + min.z) / 2]}
                        args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                        base={base}
                        bailRef={bailRef}
                        camera={camera}
                domElement={domElement}
                controls={controls}
                    />
                    :
                    <Bail
                        position={[max.x + bail.sizes.diameter / 20, 0, (max.z + min.z) / 2]}
                        args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                        base={base}
                        bailRef={bailRef}
                        camera={camera}
                domElement={domElement}
                controls={controls}
                    />


                )


            )
    ))
    
  )
}

export default Bails