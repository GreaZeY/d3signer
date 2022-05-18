import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import * as THREE from 'three'

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils"

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
  for (let i = 0; i < positionAttribute.count; i++) {
    const vector = new THREE.Vector2();
    vector.fromBufferAttribute(positionAttribute, i);
    vertices.push(vector)
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


const Diamond = ({ txtSurface }) => {
  const { designProps } = useSelector(state => state.designProps)
  const { text, crimps, font } = designProps

  
  const stone = useRef();

  useEffect(() => {
   
    const geometry = txtSurface.current.geometry
    // const vertices = generatePoints(geometry)

    stone.current.children =[]

    

    let mypoints = generatePoints(geometry)

    // BufferGeometryUtils.mergeVertices(mypoints)
    // const positionAttribute = geometry.getAttribute('position');
    // for (let i = 0; i < positionAttribute.count; i++) {
    //   const vector = new THREE.Vector2();
    //   vector.fromBufferAttribute(positionAttribute, i);
    //   mypoints.push({ x: vector.x, y: vector.y })
    // }

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

      if(crimps[itn]&&crimps[itn]!=='None') {
      let mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.5), new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: .35, color: crimps[itn] }),  alphabetPairs[itn].length * 5);

      mesh.position.set(-50 , 0, 4)

      console.log(mesh)

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
        mesh.instanceMatrix.needsUpdate = true;
        stone.current.add(mesh);
      }
      }
    }




  }, [text,crimps,font])




  return (
    <group ref={stone}>
    </group>
  )
}

export default Diamond