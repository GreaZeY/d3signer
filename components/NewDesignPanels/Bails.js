import Bail from './Bail'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { extend, useThree } from '@react-three/fiber'

extend({ TransformControls })

const Bails = ({ controls }) => {
    const {
        camera,
        gl: { domElement }
    } = useThree()

    const { designProps } = useSelector(state => state.designProps)
    const { bails, base, currBailType } = designProps
    const transform = useRef()

    // const [selectedBail, setSelectedBail] = useState(null)

    useEffect(() => {
        if (transform.current) {
            const tControls = transform.current
            const callback = (event) => (controls.current.enabled = !event.value)
            tControls.addEventListener('dragging-changed', callback)
            return () => tControls.removeEventListener('dragging-changed', callback)
        }
    })

    transform.current?.detach()

    return (
        <>
            {bails.length > 0 &&
                <>
                    {
                        bails.map((bail, i) => (
                            <Bail
                                key={i}
                                position={[0, -10, 0]}
                                args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]}
                                base={base}
                                currBailType={currBailType}
                                // setSelectedBail={setSelectedBail}
                                transform={transform}

                            />
                        ))
                    }

                    {
                        // selectedBail &&
                        <transformControls
                            mode={'translate'}
                            ref={transform}
                            args={[camera, domElement]}
                        // onUpdate={self => self.attach(selectedBail.current)} 
                        />
                    }

                </>
            }

        </>
    )



}

export default Bails;

