import Bail from './Bail'


let diffY = 0, diffX
const Bails = ({ props }) => {
    const { bails, base, boundingBoxPoints, symbol, symBB, bailRef, camera, domElement, controls } = props
    const { min, max } = boundingBoxPoints
    const { min: smin, max: smax } = symBB


    if (symbol) {
        if (symbol === '♡' || symbol === '∞') {

            diffX = 0
            diffY = 0
        } else {
            diffX = 3.5
            diffY = max.y - 1.5
        }
    } else {
        diffX = 0
        diffY = 0
    }


    // const bailProps = {
    //     base,
    //     camera,
    //     domElement,
    //     controls,
    // }

    return (
        bails.map(bail => (
                <Bail
                    position={[(smax.x + bail.sizes.diameter / 20 * 2) - diffX, symbol ? smax.y : 0, (smax.z + smin.z) / 2]}
                    args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                    base={base}
                    camera={camera}
                    domElement={domElement}
                    controls={controls}
                />
        ))

    )
           


}

export default Bails