import { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { useSelector } from 'react-redux';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { extend, useThree } from '@react-three/fiber'

extend({ TransformControls })

let rotation = [3.14, 0, 0]
let scale, tf

const Symbols = ({ txtSurface, controls}) => {
  const { designProps } = useSelector(state => state.designProps)
  const { symbol, base, length, thickness } = designProps

  const { max } = new THREE.Box3().setFromObject(txtSurface.current);

  const [position, setPosition] = useState([max.x, 0, max.z])

  const shape = useMemo(() => createShape(symbol), [symbol]);

  const symbolRef = useRef()
  const {
    camera,
    gl: { domElement }
  } = useThree()
  const transform = useRef()

  useEffect(() => {
    if (!symbol) return
    switch (symbol) {
      case 'Heart':
        rotation = [3.14, 0, 0]
        scale = length / 300
        tf = 1
        setPosition([max.x - 2, max.y - 8, max.z])
        break;
      case 'Star':
        rotation = [3.14, 0, 3.14]
        scale = length / 150
        setPosition([max.x - 5, max.y - 10, max.z])
        tf = 1
        break;
      case 'Infinity':
        scale = length / 950
        rotation = [3.14, 0, 0]
        setPosition([max.x - 5, max.y-10, max.z])
        tf = 6.5
        break;
      case 'Octothorp':
        scale = length / 450
        rotation = [3.14, 0, 0]
        setPosition([max.x - 5, max.y, max.z - .1])
        tf = 4
        break;
      case 'Ampersand':
        scale = length / 450
        rotation = [3.14, 0, 0]
        setPosition([max.x - 5.2, max.y - 1, max.z - .1])
        tf = 4
        break;
      case 'Crown':
        scale = length / 450
        rotation = [3.14, 0, 0]
        setPosition([max.x - 5.2, max.y - 5, max.z - .1])
        tf =  2
        break;

      default:


    }

  }, [symbol, length, thickness])

  const extrudeSettings = {
    depth: thickness * 8 * tf,
    bevelEnabled: true,
    curveSegments: 10,
    bevelSegments: 30,
    steps: 0,
    bevelThickness: 10,
    bevelSize: 10,
  };


  useEffect(() => {
    if (transform.current) {
      const tControls = transform.current
      const callback = (event) => (controls.current.enabled = !event.value)
      tControls.addEventListener('dragging-changed', callback)
      return () => tControls.removeEventListener('dragging-changed', callback)
    }
  })

  if (!symbol) return<></>
  return (
    <>
      <mesh
        ref={symbolRef}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        <extrudeGeometry  attach="geometry" args={[shape, extrudeSettings]} />
        <meshStandardMaterial 
        attach='material' 
        color={base} 
        metalness={1}
        roughness={.2} 
        />
      </mesh>

      <transformControls
        ref={transform}
        args={[camera, domElement]}
        onUpdate={self => self.attach(symbolRef.current)} />
    </>
  )
}

export default Symbols



const createShape = (symbol) => {
  const shape = new THREE.Shape();
  if (symbol === 'Heart') {
    shape.moveTo(25, 25);
    shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    shape.bezierCurveTo(- 30, 0, - 30, 35, - 30, 35);
    shape.bezierCurveTo(- 30, 55, - 10, 77, 25, 95);
    shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    shape.bezierCurveTo(35, 0, 25, 25, 25, 25);
    return shape
  }
  if (symbol === 'Star') {
    shape.moveTo(0, 50);
    shape.lineTo(0, 50)
    shape.lineTo(10, 10)
    shape.lineTo(40, 10)
    shape.lineTo(20, -10)
    shape.lineTo(30, -50)
    shape.lineTo(0, -20)
    shape.lineTo(-30, -50)
    shape.lineTo(-20, -10)
    shape.lineTo(-40, 10)
    shape.lineTo(-10, 10)
    return shape
  }
  if (symbol) {
    const { paths } = useLoader(SVGLoader, `/assets/symbols/${symbol}.svg`)
    var shapes = [];
    for (var i = 0; i < paths.length; i++) {
      Array.prototype.push.apply(shapes, SVGLoader.createShapes(paths[i]));

    }
    return shapes
  }

}