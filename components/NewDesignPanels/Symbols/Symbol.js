import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux';
import {createShape} from '../utils/threeUtils'

let rotation = [3.14, 0, 0]
let scale

const Symbols = ({ props }) => {
    const {symbol, boundingBox, index } =props
    const {max} = boundingBox

    const { designProps } = useSelector(state => state.designProps)
    const { base, length, thickness, symbolSize } = designProps
    const shape = useMemo(() => createShape(symbol), [symbol]);


    useEffect(() => {
        if (!symbol) return
        switch (symbol) {
            case 'Heart':
                rotation = [3.14, 0, 0]
                scale = length / 300
                break;
            case 'Star':
                rotation = [3.14, 0, 3.14]
                scale = length / 150
                break;
            case 'Infinity':
                scale = length / 950
                rotation = [3.14, 0, 0]
                break;
            case 'Octothorp':
                scale = length / 450
                rotation = [3.14, 0, 0]
                break;
            case 'Ampersand':
                scale = length / 750
                rotation = [3.14, 0, 0]
                break;
            case 'Crown':
                scale = length / 10750
                rotation = [3.14, 0, 0]
                break;

            default:


        }

    }, [symbol, length, thickness])

    const extrudeSettings = {
        depth: symbolSize*100 ,
        bevelEnabled: false,
        curveSegments: 10,
        bevelSegments: 30,
        bevelThickness: 10,
        bevelSize: 10,
    };

    if (!symbol) return <></>
    return (
        <>
            <mesh
                name={symbol}
                scale={.0005}
                position={max}
                userData={{type:'symbol', index, symbol }}
                // position-y={position[1] + 4}
                rotation={rotation}
            >
                <extrudeGeometry onUpdate={g=>g.center()} args={[shape, extrudeSettings]} />
                <meshStandardMaterial
                    color={base}
                    metalness={1}
                    roughness={.2}
                />
            </mesh>


        </>
    )
}

export default Symbols



