import React from 'react'
const style= { strokeDasharray: '480px, 480px', strokeDashoffset: '960px' }
function AnimatedTick({ scale }) {
    return (
        <svg className='tick' style={{ transform: `scale(${scale})` }}
            xmlns="http://www.w3.org/2000/svg" >
            <g fill="none" stroke="#22AE73" stroke-width="2">
                <circle cx="77" cy="77" r="72" style={style}></circle>
                <circle id="colored" fill="#22AE73" cx="77" cy="77" r="72" style={style}></circle>
                <polyline className="st0" stroke="#fff" stroke-width="10" points="43.5,77.8 63.7,97.9 112.2,49.4 " style={{ strokeDasharray: '100px, 100px', strokeDashoffset: '200px' }} />
            </g>
        </svg>
    )
}

export default AnimatedTick