import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { store } from "../../lib/store";
import { Provider } from "react-redux";
import Diamond from './Diamond.js'
import { Environment, OrthographicCamera } from "@react-three/drei";

const DiamondMenu = ({ color, model }) => {
    return (
        <Canvas style={{ width: '10rem', height: '3rem' }} >
            <ambientLight intensity={1} />
            <OrthographicCamera
                makeDefault
                zoom={4.6}
                position={[0, 0, 5]}
            />
            <Provider store={store} >
                <Suspense fallback={"Loading"}>
                    <Environment files={'workshop.hdr'} path={'/assets/hdrMap/'} />
                    <Diamond color={color} model={model} />
                </Suspense>
            </Provider>

        </Canvas>
    )
}

export default DiamondMenu

