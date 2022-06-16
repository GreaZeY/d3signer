import Bail from './Bail'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { extend, useThree } from '@react-three/fiber'
import { useControl } from 'react-three-gui';
import {ChangeMode} from '../ThreeGUIControls/guiContolsComponents'
import * as THREE from 'three'
// import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'

// const gui = new GUI()
// const cubeFolder = gui.addFolder('Cube')
// cubeFolder.add(0, 'x', 0, Math.PI * 2)
// cubeFolder.add(0, 'y', 0, Math.PI * 2)
// cubeFolder.add(0, 'z', 0, Math.PI * 2)
// cubeFolder.open()


extend({ TransformControls })
let box = {}
const Bails = ({ txtSurface, controls, guiControls, transform }) => {
    // guiControls.current.style.display = 'none'

    // const rotationX = useControl('Rotation X', { type: 'number' });
    // const rotationY = useControl('Rotation Y', { type: 'number' });
    // const rotationZ = useControl('Rotation Z', { type: 'number' });

    if (txtSurface.current?.geometry){
        box = new THREE.Box3().setFromObject(txtSurface.current);
    }
     const { max, min }= box
   

    // if(transform.current){
    //     transform.current.mode = mode || 'translate'
    // }
  
    
  
    
    

    const {
        camera,
        gl: { domElement }
    } = useThree()

    const { designProps } = useSelector(state => state.designProps)
    const { bails, base } = designProps
    

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
                                args={{
                                    radius: bail.sizes.diameter / 10 * 2,
                                    tube: bail.sizes.width / 10,
                                    position:[max.x-2,max.y,(max.z-min.z)/2]
                                }}
                                base={base}
                                currBailType={bail.type}
                                transform={transform}
                            />
                        ))
                    }
                        {/* <transformControls
                            mode={mode}
                            ref={transform}
                            args={[camera, domElement]}
                        /> */}

                </>
            }

        </>
    )



}

export default Bails;

