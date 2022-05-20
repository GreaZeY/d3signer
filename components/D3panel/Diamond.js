import { ThreeDRotation } from '@material-ui/icons';
import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import * as THREE from 'three'
import { Mesh } from 'three';

import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";

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

const getAngle = (a, b) => {
  a.normalize();
  b.normalize();

  var cosAB = a.dot( b );
  return Math.acos( cosAB );
}

const Diamond = ({ txtSurface }) => {
  const { designProps } = useSelector(state => state.designProps)
  const { text, crimps, font, length } = designProps

  
  const stone = useRef();

  const oldMethod = () => {
    if(crimps.length===0) return
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
    

    alphabetPairs = mypoints.filter((p) => p.x < 20);

    var setMatrixAt = 0;
 
    for (var itn = 0; itn < 1; itn++) {

      if(crimps[itn] && crimps[itn] !=='None') {
      let mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.5), new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: .35, color: crimps[itn] }),  alphabetPairs[itn].length * 5);

      mesh.position.set(-50 , 0, 4)


      console.log(mesh)

      if (mesh) {
        
        const matrix = new THREE.Matrix4();
        //let pointsTouse = alphabetPairs[itn];

        //let pointsTouse = [];


        // let toSkip = 2;
        // var xPoint = 0;
        // var sets = [];
        // var charPoints = alphabetPairs[itn];
        // for (let i = toSkip; i < charPoints.length - toSkip ; i = i + 1) {
        //   if(pointsTouse.length > 0 && false) {
        //    var lastPoint = pointsTouse[pointsTouse.length-1];
        //   //  var a = getAngle(lastPoint , charPoints[i]) ;
        //   //  console.log(a);
        //   //  if(a < 3.14/4) {
        //   //   pointsTouse.push(charPoints[i]);
        //   //  } else {
        //     pointsTouse.push(new THREE.Vector2(lastPoint.x, charPoints[i].y));
        //    //}

        //   } else {
        //     pointsTouse.push(charPoints[i]);
        //   }
        // }

        var pointsTouse = drawnPoints;// alphabetPairs;
        
        for (let i = 0; i < pointsTouse.length  ; i = i + 1) {
          
          var yPoints =  alphabetPairs.find((p) => p.y === pointsTouse[i].y);

          matrix.makeTranslation(pointsTouse[i].x, pointsTouse[i].y, 1);
          mesh.setMatrixAt(setMatrixAt, matrix);
          setMatrixAt ++;
        }
        mesh.instanceMatrix.needsUpdate = true;
        stone.current.add(mesh);
      }
      }
    }
  }

  const newMethod = () => {
    if(crimps.length===0) return
    const geometry = txtSurface.current.geometry
    stone.current.children =[]
    let mypoints = generatePoints(geometry)


    // let alphabetCount = text.length;
    // let drawnPoints = [];
    // for (var i = 0; i < mypoints.length; i++) {
    //   var canDraw = true;
    //   var xnearPoints = drawnPoints.filter((p) => Math.abs(p.x - mypoints[i].x) < 3) || [];
    //   if ((xnearPoints || []).length > 0) {
    //     var ynearPoints = xnearPoints.filter((p) => Math.abs(p.y - mypoints[i].y) < 2) || [];
    //     if ((ynearPoints || []).length > 0) {
    //       canDraw = false;
    //     }
    //   }

    //   if (canDraw) {
    //     drawnPoints.push(mypoints[i])
    //   }
    // }
    // drawnPoints.sort(compareX);
    // var alphabetPairs=splitArrayIntoChunksOfLen(drawnPoints, drawnPoints.length / alphabetCount); //split into chunks of two
  
    mypoints.sort(compareX);
    //var alphabetPairs = mypoints.filter((p) => p.x < 20);
    let ySets = [2,,4,6,8, 10].map((n) => {
      return {
        n, 
        points: mypoints.filter((p) => p.y - n === 0 && p.x < 20) || []
      }
    });

    if(crimps[0]&&crimps[0]!=='None') {
      let mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.5), new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: .35, color: crimps[0] }),  100);
      mesh.position.set(-50 , 0, 4)

      if (mesh) {
        
        const matrix = new THREE.Matrix4();


        var setMatrixAt = 1;

        for(var y =0 ; y < ySets.length; y++) {
          var yPoints = ySets[y];

          console.log(yPoints.points)
          // matrix.makeTranslation(pointsTouse[i].x, pointsTouse[i].y, 1);
          // mesh.setMatrixAt(setMatrixAt, matrix);
          // setMatrixAt ++;
        }


        mesh.instanceMatrix.needsUpdate = true;
        stone.current.add(mesh);

      }


    }
    
  }


  const raycasterMethod = (textGeo)=>{
    const size = new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(txtSurface.current); // AABB
    box.getSize(size);

    const geometry = new THREE.BoxBufferGeometry(size.x + 10, size.y + 10, size.z + 10, 5, 5, 5);

    const gridGeometry = new THREE.GridBoxGeometry(geometry, true);
    const grid = new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({
      color: 'aqua'
    }));


    grid.position.y = 130;
    stone.current.add(grid);
  }

  useEffect(() => {
   
    // newMethod();
    //oldMethod();

//     let originalGeometry = new THREE.BoxGeometry(1, 1, 1);
// let subdivisionModifier = new THREE.SubdivisionModifier(3);
// let subdividedGeometry = originalGeometry.clone();
// subdivisionModifier.modify(subdividedGeometry);


// const mesh = new Mesh(subdividedGeometry,new THREE.MeshNormalMaterial())
    
// stone.current.add(mesh);


//     const count = 500
// const turns = 10

// const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.3), new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: .35, color: 'red' }),  count);

//       mesh.position.set(-50 , 0, 1)

//     if (mesh) {
      

//       const mat4 = new THREE.Matrix4()
//       const vec3 = new THREE.Vector3()
//       const color = new THREE.Color()

//       for (let i = 0; i < 500; i=i+20) {
      
//         mat4.setPosition(mypoints[i].x,mypoints[i].y,5)
//         console.log(mat4)
//         mesh.setMatrixAt(i, mat4)

//         // color.set((i / (count / turns)) * 0xffffff)
        
//       }
//       stone.current.add(mesh);
//     }

//newMethod();
// oldMethod();
// console.log(txtSurface.current.geometry)
// if(!txtSurface.current.geometry) return
// let textGeo = txtSurface.current
// raycasterMethod(textGeo)
  }, [text,crimps,font,length])




  return (
    <group ref={stone}>
    </group>
  )
}

export default Diamond