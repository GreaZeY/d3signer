import { useRef, useEffect, useState, useMemo } from 'react'
import { useFBX, useTexture, Point, Points } from '@react-three/drei'
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { useThree } from '@react-three/fiber';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
const pi = 3.14


function compareX(a, b) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

function compareY(a, b) {
  if (a.x === b.x) {
    // Price is only important when cities are the same
    return b.y - a.y;
  }
  return a.x > b.x ? 1 : -1;
}

const generatePoints = (geometry) => {
  let vertices = []
  const positionAttribute = geometry.getAttribute('position');
  const mypoints = [];
  for (let i = 0; i < positionAttribute.count; i++) {
    const vector = new THREE.Vector2();
    vector.fromBufferAttribute(positionAttribute, i);
    //  delete vector.z




    vertices.push(vector)
    mypoints.push({ x: vector.x, y: vector.y })

  }

  return vertices

}

const splitArrayIntoChunksOfLen = (arr, len) => {
  var chunks = [], i = 0, n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}


const Diamond = ({ props }) => {

  const { txtSurface, text, crimps } = props

  
  const stone = useRef();

  useEffect(() => {
    console.log("generate start" , new Date())
    const geometry = txtSurface.current.geometry
    // const vertices = generatePoints(geometry)

    stone.current.children =[]
    console.log('fsfs',stone)
    

    let mypoints = []
    const positionAttribute = geometry.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
      const vector = new THREE.Vector2();
      vector.fromBufferAttribute(positionAttribute, i);
      mypoints.push({ x: vector.x, y: vector.y })
    }

    let alphabetCount = text.length;
    let drawnPoints = [];
    for (var i = 0; i < mypoints.length; i++) {
      var canDraw = true;
      var xnearPoints = drawnPoints.filter((p) => Math.abs(p.x - mypoints[i].x) < 3) || [];
      if ((xnearPoints || []).length > 0) {
        var ynearPoints = xnearPoints.filter((p) => Math.abs(p.y - mypoints[i].y) < 2) || [];
        if ((ynearPoints || []).length > 0) {
          canDraw = false;
        }
      }

      if (canDraw) {
        drawnPoints.push(mypoints[i])
      }
    }
    drawnPoints.sort(compareX);
    var alphabetPairs=splitArrayIntoChunksOfLen(drawnPoints, drawnPoints.length / alphabetCount); //split into chunks of two
    

    var setMatrixAt = 0;
 
    for (var itn = 0; itn < alphabetPairs.length; itn++) {

      if(crimps[itn]) {
      let mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.5), new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: .35, color: crimps[itn] }),  alphabetPairs[itn].length * 5);
      //mesh.position.set(-50 + itn * 10, 0, 5)

      console.log("mesh point", alphabetPairs[itn][0].x);

      //mesh.position.set(-50 + alphabetPairs[itn][0].x, 0, 5)

      mesh.position.set(-50 , 0, 5)

      if (mesh) {
        const _matrix = new THREE.Matrix4();
        var pointsTouse = alphabetPairs[itn];
        var toSkip  = Math.ceil( pointsTouse.length * .1);
        toSkip = 2;
        for (let i = toSkip; i < pointsTouse.length - toSkip ; i = i + 1) {
          _matrix.makeTranslation(pointsTouse[i].x, pointsTouse[i].y, 1);
          mesh.setMatrixAt(setMatrixAt, _matrix);
          setMatrixAt ++;
        }
        //mesh.instanceMatrix.needsUpdate = true;
        // stone.current.remove(stone.current.children[0])
        stone.current.add(mesh);
      }
      }
    }


    console.log("generate end" , new Date())


  }, [text,crimps])




  return (
    // null
    // <primitive position={[0,0,0]} object={dan} />

    <group ref={stone}>
      {/* <instancedMesh position={[-50, 0, 5]} ref={instance} args={[
        0,
        dia.children[0].material,
        10000
      ]}>

        <sphereGeometry args={[.5]} />
        <meshPhysicalMaterial attach='material' metalness={1} roughness={.35} />



      </instancedMesh> */}




    </group>
  )
}

export default Diamond