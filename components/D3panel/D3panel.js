import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import PendentModel from './PendentModel'
import { OrbitControls } from "@react-three/drei";
import { store } from "../../lib/store";
import { Provider } from "react-redux";
const D3panel = ({ model }) => {

  const controls = useRef()
console.log('d3panel rendered')
  return (
    <Canvas camera={{ position: [0, 0, 100] }} style={{ height: `78vh`, }} >
      <ambientLight intensity={1} />
      <OrbitControls enableDamping ref={controls} />
      
      <pointLight intensity={.2} position={[-50, 0, 0]} />
      <pointLight intensity={.5} position={[-1050, 0, 1000]} />
      <spotLight intensity={1} position={[0, 10, 0]} angle={-22 / 7} />
      <pointLight position={[-1, -1, -10]} />
      <Suspense fallback={"Loading"}>
        <group ref={model}  >
          <Provider store={store} >
            <PendentModel controls={controls} />
          </Provider >
        </group>
      </Suspense>
    </Canvas>

  )
}

export default D3panel;