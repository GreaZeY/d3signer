import Bail from './Bail';
import { useEffect } from 'react'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { useSelector } from 'react-redux';
import { extend } from '@react-three/fiber'
import * as THREE from 'three'


extend({ TransformControls })
let box = {}
const Bails = ({ txtSurface, transform, guiControls }) => {

    if (txtSurface.current?.geometry){
        box = new THREE.Box3().setFromObject(txtSurface.current);
    }
    const { max, min }= box
    const { designProps } = useSelector(state => state.designProps)
    const { bails, base } = designProps;

    useEffect(()=>{
        transform.current?.detach()
        if(guiControls.current?.style?.display) {
            guiControls.current.style.display = 'none'
        }
    },[bails])
    
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
                                guiControls={guiControls}
                            />
                        ))
                    }
                </>
            }

        </>
    )



}

export default Bails;

