import Symbol from './Symbol'
import { useSelector } from 'react-redux';
const boundingBox = {min:{},max:{}}
const Symbols = ({txtSurface}) => {
  const { designProps } = useSelector(state => state.designProps)
  const { symbols } = designProps

  if (txtSurface.current){
    txtSurface.current.geometry.computeBoundingBox()
    boundingBox = txtSurface.current.geometry.boundingBox
  }
  
  return (symbols.length>0&&txtSurface.current) ?
      symbols.map((symbol,index) => <Symbol key={symbol+index} props={{symbol,boundingBox,index}} />)
      :
      <></>
 

}

export default Symbols