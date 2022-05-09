import Bail from './Bail'


const Bails = ({ props }) => {
    const { bails, base, symbol, camera, domElement, controls } = props
  


    return (
        bails.map(bail => (
                <Bail
                    position={[0,-10,0]}
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