import Symbol from './Symbol'
import { useSelector } from 'react-redux';
const boundingBox = {min:{},max:{}}
const Symbols = ({props}) => {
  const { designProps } = useSelector(state => state.designProps)
  const { symbols } = designProps

  if (props.txtSurface.current){
    props.txtSurface.current.geometry.computeBoundingBox()
    boundingBox = props.txtSurface.current.geometry.boundingBox
  }
  
  return (symbols.length>0&&props.txtSurface.current) ?
      symbols.map(symbol => <Symbol props={{...props,symbol,boundingBox}} />)
      :
      <></>
 

}

export default Symbols