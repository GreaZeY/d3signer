
import React, { useRef, useEffect, useState } from 'react'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { extend,useLoader } from '@react-three/fiber'
import { fonts } from './assets/allFonts';

import * as THREE from 'three'

// import { Union } from '@react-three/drei';


extend({ TextGeometry })


const TextMesh = (props) => {

    const {
        text,
        base,
        length,
        width,
        thickness,
        font: currFont,
        model,
        bails
    } = props

    const [boundingBoxPoints, setBoundingBoxPoints] = useState({ max: {}, min: {} })
    const text3d = useRef()
    const textGroup = useRef()

    // const diamond = useLoader(
    //     FBXLoader,
    //     `./assets/cripms/Idle.fbx`
    //   ); 


    //   const dracoLoader = new DRACOLoader()
    //   dracoLoader.setDecoderPath('/js/libs/draco/')
      
    //   const loader = new FBXLoader()
    //   loader.setDRACOLoader(dracoLoader)
    //     loader.load(dia,(fbx)=>{
    //   console.log(fbx)
    //     });


    const font = new FontLoader().parse(fonts.filter(ff => ff.familyName === currFont)[0]);



    useEffect(() => {
        var helper = new THREE.Box3().setFromObject(textGroup.current);
        setBoundingBoxPoints(helper)
     }, [props])




    useEffect(()=>{
        // model.current.remove( textGroup.current.children[1] );
        // const geometry = text3d.current
        // geometry.deleteAttribute( 'normal' );
		// 		geometry.deleteAttribute( 'uv' );
		// 		const vertices = [];
		// 		const positionAttribute = geometry.getAttribute( 'position' );

        //     for ( let i = 0; i<positionAttribute.count; i ++ ){
        //       const vector = new THREE.Vector2();
        //        vector.fromBufferAttribute( positionAttribute, i );
        //       //  delete vector.z
        //        vertices.push(vector)
             
        //       }
        //       console.log(vertices)
        //     //   setPoints(vertices)

        //     const pointsMaterial = new THREE.MeshBasicMaterial( {

        //         color: 0x0080ff,
                
          
      
        //       } );
        //     const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

		// 		const points = new THREE.Mesh( pointsGeometry, pointsMaterial );
        //         points.position.set(-50,0,-10)
				// model.current.add( points );

    },[props])




    const { min, max } = boundingBoxPoints

    console.log(max.x)

    return (

        <group ref={model}  >
            <group ref={textGroup} >
                <mesh position={[-50, 0, 0]}>
                    <textGeometry ref={text3d} args={[text, { font, size: length, height: thickness, curveSegments: 100, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelOffset: 0, }]} />
                    <meshStandardMaterial attach='material' color={base} metalness={.6} roughness={0.2} />
                </mesh>


            </group>
            {/* <mesh position={[x, 0, 0]}>
                <meshStandardMaterial attach='material' color={base} metalness={.6} roughness={0.2} />
                <textGeometry args={['gfg', { font, size: length, height: thickness, curveSegments: 100, bevelEnabled: false, bevelThickness: 1, bevelSize: 1, bevelOffset: 0, }]} />

            </mesh> */}


            {bails.map(bail => (
                bail.position === 'Right' ?
                    <mesh position={[max.x + bail.sizes.diameter / 20 * 2, 0, (max.z + min.z)/2]} >
                        <torusGeometry args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} />
                        <meshStandardMaterial attach="material" color={base} metalness={.6} roughness={0.2} />
                    </mesh>
                    :
                    (

                        bail.position === 'Center' ?
                            <mesh position={[((max.x + min.x) / 2 + 3), max.y / 1.1, (max.z + min.z)/2]} >
                                <torusGeometry args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} />
                                <meshStandardMaterial attach="material" color={base} metalness={.6} roughness={0.2} />
                            </mesh>
                            :
                            (

                                bail.position === 'Left' ?
                                    <mesh position={[min.x + -bail.sizes.diameter / 20 * 2, 0, (max.z + min.z)/2]} >
                                        <torusGeometry args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} />
                                        <meshStandardMaterial attach="material" color={base} metalness={.6} roughness={0.2} />
                                    </mesh>
                                    :
                                    <mesh position={[max.x + bail.sizes.diameter / 20, 0, (max.z + min.z)/2]} >
                                        <torusGeometry args={[bail.sizes.diameter / 10 * 2, bail.sizes.width / 10, 100, 100]} />
                                        <meshStandardMaterial attach="material" color={base} metalness={.6} roughness={0.2} />
                                    </mesh>


                            )


                    )
            ))
            }






        </group>

    )
}

export default TextMesh