import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { store } from "../../lib/store";
import { Provider } from "react-redux";
import Diamond from './Diamond.js'
import { Environment, OrthographicCamera,Html } from "@react-three/drei";


const DiamondMenu = ({ color, model }) => {
    
    return (
      <Canvas style={{ width: "10rem", height: "3rem", cursor: "pointer" }}>
        <ambientLight intensity={1} />
        <OrthographicCamera makeDefault zoom={4.6} position={[0, 0, 5]} />
        <Provider store={store}>
          <Suspense fallback={<Html position={[-8,3.5,0]}>Loading...</Html>}>
            <Environment files={"workshop.hdr"} path={"/assets/hdrMap/"} />
            <Diamond color={color} model={model} />
          </Suspense>
        </Provider>
      </Canvas>
    );
}

export default DiamondMenu

