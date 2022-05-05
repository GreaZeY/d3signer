
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

let shape = new THREE.Shape();
let rotation = [3.14, 0, 0]
let scale, y = 7, tf

const Symbols = ({ props }) => {
  const { symbol, boundingBoxPoints, base, length, thickness, } = props

  const { min, max } = boundingBoxPoints
  const [position, setPosition] = useState([max.x, 0, max.z])
  const { paths:infy } = useLoader(SVGLoader, '/assets/symbols/infy.svg')
  const { paths:hash } = useLoader(SVGLoader, '/assets/symbols/hash.svg')
  const { paths:and } = useLoader(SVGLoader, '/assets/symbols/and.svg')
  const symbolRef = useRef()


  useEffect(() => {
    if (!symbol) return
    switch (symbol) {
      case '♡':
        shape = new THREE.Shape();
        shape.moveTo(25, 25);
        shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
        shape.bezierCurveTo(- 30, 0, - 30, 35, - 30, 35);
        shape.bezierCurveTo(- 30, 55, - 10, 77, 25, 95);
        shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
        shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
        shape.bezierCurveTo(35, 0, 25, 25, 25, 25);
        rotation = [3.14, 0, 0]
        scale = length / 150
        tf=1
        break;

      case '☆':
        shape = new THREE.Shape();
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
        rotation = [3.14,0, 3.14]
        scale = length / 150
        tf=1
        break;
      case '∞':
        shape = new THREE.Shape();
        var shapes = [];
        for (var i = 0; i < infy.length; i++) {
          Array.prototype.push.apply(shapes, SVGLoader.createShapes( infy[i] )); 
        
        }
        shape = shapes
        scale = length / 950
        rotation = [3.14, 0, 0]
        break;
      
        case '#':
        shape = new THREE.Shape();
        var shapes = [];
        for (var i = 0; i < hash.length; i++) {
          Array.prototype.push.apply(shapes, SVGLoader.createShapes( hash[i] )); 
        
        }
        shape = shapes
        scale = length / 450
        rotation = [3.14, 0, 0]
     
        break;

        case '&amp;':
          shape = new THREE.Shape();
          var shapes = [];
          for (var i = 0; i < and.length; i++) {
            Array.prototype.push.apply(shapes, SVGLoader.createShapes( and[i] )); 
          
          }
          shape = shapes
          scale = length / 450
          rotation = [3.14, 0, 0]
       
          break;

      default: break;

    }
 
  }, [symbol])

  useEffect(() => {
    if (!symbol) return
    switch (symbol) {
      case '∞':
        setPosition([max.x - 5, max.y, max.z])
        tf=6.5
        break;
      case '#':
          setPosition([max.x - 5, max.y, max.z - .1])
         tf=4
          break;
      case '&amp;':
            setPosition([max.x - 5.2, max.y-1, max.z - .1])
           tf=4
            break;

      default: setPosition([max.x, y, max.z - .1])

    }
  }, [symbol, length, thickness, boundingBoxPoints])



  const extrudeSettings = { depth: thickness * 8*tf, bevelEnabled: true, curveSegments: 100, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

  return (
    <group ref={symbolRef} >
    <mesh
      scale={scale}
      position={position}
      rotation={rotation}
    >
      <extrudeBufferGeometry attach="geometry" args={[shape, extrudeSettings]} />
      <meshStandardMaterial attach='material' color={base} metalness={.6} roughness={0.2} />
    </mesh>
    </group>
  )
}

export default Symbols