import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { store } from "../../lib/store";
import { Provider } from "react-redux";
import Diamond from './Diamond.js'
import { Environment } from "@react-three/drei";

const DiamondMenu = ({ color, model }) => {
    return (
        <Canvas style={{ width: '10rem', height: '3rem' }} camera={{ position: [0, 0, 10] }} >
            <ambientLight intensity={1} />
            <Provider store={store} >
            <Suspense fallback={"Loading"}>
                 <Environment files={'studio.hdr'} path={'/assets/hdrMap/'} />
                <Diamond color={color} model={model} />
            </Suspense>
            </Provider>

        </Canvas>
    )
}

export default DiamondMenu

