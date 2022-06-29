import Symbol from './Symbol'
import { useSelector } from 'react-redux';

const Symbols = ({props}) => {
  const { designProps } = useSelector(state => state.designProps)
  const { symbols } = designProps
  return (symbols.length>0&&props.txtSurface.current) ?
      symbols.map(symbol => <Symbol props={{...props,symbol}} />)
      :
      <></>
 

}

export default Symbols