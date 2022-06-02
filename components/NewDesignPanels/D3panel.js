import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import PendantModel from './PendantModel'
import Bails from './Bails'
import { OrbitControls,Environment } from "@react-three/drei";
import { store } from "../../lib/store";
import { Provider } from "react-redux";
const D3panel = ({ model }) => {
  const controls = useRef()
 
  return (
    <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 90] }} style={{ height: `78vh`, }} >
      <ambientLight intensity={1} />
      <OrbitControls enableDamping ref={controls} />
      <pointLight intensity={.2} position={[-50, 0, 0]} />
      <pointLight intensity={.5} position={[-1050, 0, 1000]} />
      <spotLight intensity={1} position={[0, 10, 0]} angle={-22 / 7} />
      <pointLight position={[-1, -1, -10]} />
      
      <Suspense fallback={"Loading"}>
      <Environment files={'cayley.hdr'} path={'/assets/hdrMap/'} />
        <group ref={model}  >
          <Provider store={store} >
            <PendantModel/>
            <Bails controls={controls} />
          </Provider >
        </group>
      </Suspense>
    </Canvas>

  )
}

export default D3panel;