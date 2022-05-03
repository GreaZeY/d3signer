
import { Canvas } from '@react-three/fiber'
import TextMesh from './textMesh'
import { OrbitControls } from "@react-three/drei";
import { useSelector } from 'react-redux';
const D3panel = ({model}) => {

  const {designProps} = useSelector(state=>state.designProps)  
  

  return (

    <Canvas  camera={{ position: [0, 0, 100]}} style={{width: `100%`, height: `72.5vh`, cursor:'pointer',zIndex:10 }} >
    <ambientLight intensity={.5} />

    <spotLight intensity={.2} position={[-50, 0, 100]} />
    <OrbitControls />
    <pointLight  intensity={.2} position={[-50, 0, 100]} />

    <TextMesh  {...designProps} model={model} />
  </Canvas>
  
  )
}

export default D3panel