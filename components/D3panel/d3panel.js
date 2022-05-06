
import { Suspense,useRef } from 'react'
import { Canvas} from '@react-three/fiber'
import PendentModel from './pendentModel'
import { OrbitControls } from "@react-three/drei";
import { useSelector } from 'react-redux';
const D3panel = ({ model }) => {

  const { designProps } = useSelector(state => state.designProps)

  const controls = useRef()

  return (
    
      <Canvas camera={{ position: [0, 0, 100] }} style={{ width: `100%`, height: `72.5vh`, cursor: 'pointer', zIndex: 10 }} >
        {/* <ambientLight  intensity={1}  /> */}

        {/* <spotLight intensity={.5} position={[-50, 0, 100]} /> */}
        <OrbitControls ref={controls} />
        {/* <pointLight intensity={.5} position={[-50, 0, 100]} /> */}
        {/* <pointLight intensity={.5} position={[-50, 0, -100]} /> */}
       
        <Suspense fallback={"Loading"}>
        <group ref={model}  >
        <PendentModel  {...designProps} controls={controls}  />
       
        </group>
        </Suspense>
      </Canvas>
   
  )
}

export default D3panel