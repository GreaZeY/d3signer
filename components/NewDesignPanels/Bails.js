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
    const { bails, base } = designProps
    const transform = useRef()

    const canvasClickListener = () => {
        if (transform.current?.children[0]?.object) {
            // transform.current?.detach()
        }
    }



    useEffect(() => {
        if (transform.current) {
            const tControls = transform.current
            const callback = (event) => (controls.current.enabled = !event.value)
            tControls.addEventListener('dragging-changed', callback)

            domElement.addEventListener('click', canvasClickListener)



            return () => {
                tControls.removeEventListener('dragging-changed', callback)
                domElement.removeEventListener('click', canvasClickListener)
            }
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
                                args={{
                                    radius: bail.sizes.diameter / 10 * 2,
                                    tube: bail.sizes.width / 10,
                                }}

                                base={base}
                                currBailType={bail.type}
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

