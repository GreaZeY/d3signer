import Bail from './Bail'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { extend, useThree } from '@react-three/fiber'
import { useControl } from 'react-three-gui';
import {ChangeMode} from '../ThreeGUIControls/guiContolsComponents'

// import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'

// const gui = new GUI()
// const cubeFolder = gui.addFolder('Cube')
// cubeFolder.add(0, 'x', 0, Math.PI * 2)
// cubeFolder.add(0, 'y', 0, Math.PI * 2)
// cubeFolder.add(0, 'z', 0, Math.PI * 2)
// cubeFolder.open()


extend({ TransformControls })

const Bails = ({ controls, guiControls }) => {
    // guiControls.current.style.display = 'none'

    // const rotationX = useControl('Rotation X', { type: 'number' });
    // const rotationY = useControl('Rotation Y', { type: 'number' });
    // const rotationZ = useControl('Rotation Z', { type: 'number' });

   

    let mode = useControl('Mode1', {
        type: 'custom',
        value: 'translate',
        component: ChangeMode,
    });

    const closeControls = ()=>{
        transform.current?.detach()
        guiControls.current.style.display = 'none'
    }
    
    useControl('Close', { type: 'button', onClick:closeControls });

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

            guiControls.current.style.display = 'block'
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
                            mode={mode}
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

