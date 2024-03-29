import { useMemo } from 'react'
import { loadStone } from '../NewDesignPanels/utils/threeUtils'
import { stoneColor } from '../NewDesignPanels/panelData'
import { useDispatch,useSelector } from 'react-redux';
import { designProps } from '../../lib/actions/designAction';

let x = [-15, -10, -5, -0, 5, 10]
const Diamond = ({ model }) => {

    const dispatch = useDispatch()
    const { designProps: currDesign } = useSelector(state => state.designProps)
    const diamond = useMemo(() => loadStone(model, 'red'), [model]);
    return (
        <group>
            {
                stoneColor.map((color, i) => 
                    <mesh 
                    position-x={x[i]} 
                    geometry={diamond.geometry.clone()} 
                    scale={3} 
                    rotation={[Math.PI / 2, Math.PI, 0]}
                    onClick={() => dispatch(designProps({ ...currDesign, currStoneColor: color }))}
                    >
                     <meshStandardMaterial
                        color={color}
                        metalness={1}
                        roughness={.15}
                    />
                    </mesh>
                )
            }


        </group>

    )
}

export default Diamond


    // < group ref = { dia } >
    //         <primitive position-x={x[0]} scale={4} object={diamond} color={'red'} />
    //         <primitive position-x={x[1]} scale={4} object={diamond} color={'red'} />
    //         <primitive position-x={x[2]} scale={4} object={diamond} color={'red'} />
    //         <primitive position-x={x[3]} scale={4} object={diamond} color={'red'} />
    //         <primitive position-x={x[4]} scale={4} object={diamond} color={'red'} />
    //     </ >