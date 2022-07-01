import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import PendantModel from './PendantModel'
import { OrbitControls, Environment, OrthographicCamera } from "@react-three/drei";
import { store } from "../../lib/store";
import { Provider } from "react-redux";
import { Controls, withControls } from 'react-three-gui';

const CanvasWithControls = withControls(Canvas);

const D3panel = ({ model, zoom }) => {
  const controls = useRef()
  const guiControls = useRef()

  return (
    <Controls.Provider>
      <CanvasWithControls gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, .5] }}>
        {/* <OrthographicCamera
          makeDefault
          position={[0, 0, .3]}
        /> */}
      <OrbitControls enableDamping ref={controls} />
      <Suspense fallback={"Loading"}>
        <Environment files={'home.hdr'} path={'/assets/hdrMap/'} />
          <Provider store={store} >
              <PendantModel controls={controls} guiControls={guiControls} zoom={zoom} model={model} />
          </Provider >
      </Suspense>
      </CanvasWithControls>
      <div ref={guiControls}  style={{ display: 'none' }} >
        <Controls title={'Transform Controls'} width={200} collapsed={true} anchor={'top_right'} style={{zIndex:100}}/>
      </div>
      </Controls.Provider>
  )
}

export default D3panel;


// room env
// const pmremGenerator = new THREE.PMREMGenerator(gl);
// scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;