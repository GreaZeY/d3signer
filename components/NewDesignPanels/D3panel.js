import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import PendantModel from './PendantModel'
import Bails from './Bails'
import { OrbitControls,Environment } from "@react-three/drei";
import { store } from "../../lib/store";
import { Provider } from "react-redux";
import { Controls, useControl } from 'react-three-gui';
const D3panel = ({ model }) => {
  const controls = useRef()
  const env = useRef()
 
  return (
    <Controls.Provider>
    <Canvas gl={{ preserveDrawingBuffer: true }}camera={{ position: [0, 0, 90] }} style={{ height: `78vh`, }} >
      <OrbitControls enableDamping ref={controls} />
      {/* <ambientLight intensity={1} /> */}
      {/* <pointLight intensity={.2} position={[-50, 0, 0]} />
      <pointLight intensity={.5} position={[-1050, 0, 1000]} />
      <spotLight intensity={.5} position={[0, 10, 0]} angle={-22 / 7} />
      <pointLight position={[-1, -1, -10]} /> */}
      
      <Suspense fallback={"Loading"}>
        <Environment files={'home.hdr'} path={'/assets/hdrMap/'} ref={env} />
        <group ref={model}  >
          <Provider store={store} >
            <PendantModel controls={controls} />
            <Bails controls={controls} />
          </Provider >
        </group>
      </Suspense>
    </Canvas>
      </Controls.Provider>
  )
}

export default D3panel;


// room env
// const pmremGenerator = new THREE.PMREMGenerator(gl);
// scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;