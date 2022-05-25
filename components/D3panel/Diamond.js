import { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Diamond = () => {
  const { designProps } = useSelector(state => state.designProps)
  const { text, currStone, font, length } = designProps


  useEffect(() => {
    window.addEventListener( 'pointermove', onPointerMove );

  }, [text, currStone, font, length])




  return (
    <></>
  )
}

export default Diamond