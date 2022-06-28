import React, { useEffect, useState } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import { useSelector } from 'react-redux';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
const minDiameter = .5, maxDiameter = 1, minThickness = 1, maxThickness = 10
const sizes = { diameter: minDiameter, thickness: minThickness } 
const Bail = (props) => {


    const { classes, bails, setBailsData, index, currBailType } = props
    const { designProps } = useSelector(state => state.designProps)
    
    const [bailDiameter, setBailDiameter] = useState(sizes.diameter);
    const [bailThickness, setBailThickness] = useState(sizes.thickness);
    const [currBailProp, setCurrBailProp] = useState('bailDiameter');
    const [currBailPosition, setCurrBailPosition] = useState([]);


    const setBails = (e, val) => { 
        currBailProp === 'bailDiameter' ?
            setBailDiameter(val)
            :
            setBailThickness(val)
    }


    useEffect(()=>{
        if(designProps.bails[index])
        {
        setCurrBailPosition(designProps.bails[index].position)
        setBailDiameter(designProps.bails[index].sizes.diameter)
        setBailThickness(designProps.bails[index].sizes.thickness)
        }
    },[designProps])
    // console.log(props)

    useEffect(() => {
        let currBail = [...bails]
        currBail[index].position = currBailPosition
        if(!currBail[index].type) currBail[index].type = currBailType
        if(!currBail[index].dimensionType) currBail[index].dimensionType = currBailType === 'bail0'?'Diameter':'Size'
        currBail[index].sizes.diameter = bailDiameter
        currBail[index].sizes.thickness = bailThickness
        setBailsData(currBail)

    }, [bailDiameter, bailThickness, currBailPosition])


    const deleteBail = () => {
        let currBail = [...bails]

        currBail=bails.filter((bail, i) => i !== index)
      
        setBailsData(currBail)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
           
            <div style={{ width: '100%', marginTop: '1rem', justifyContent: 'space-between' }} className={classes.flexRow}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small" >
                    <InputLabel >Sizes</InputLabel>
                    <Select
                        value={currBailProp}
                        label="Size"
                        onChange={(e => setCurrBailProp(e.target.value))}
                    >
                        <MenuItem value={'bailDiameter'}>{
                            designProps?.bails[index]?.dimensionType
                        }</MenuItem>
                        <MenuItem value={'bailThickness'}>Thickness</MenuItem>
                    </Select>
                </FormControl>

            </div>
            <div style={{ width: '100%', marginTop: '1rem', display: 'flex' }}>
                <Slider
                    aria-label="Sizes"
                   style={{ marginLeft:'.3rem'}}
                    onChange={setBails}
                     step={.1}
                    min={.5}
                    max={1}
                    value={currBailProp === 'bailDiameter' ?
                        bailDiameter
                        :
                        bailThickness

                    }
                    color="primary"
                />
                <input 
                onChange={e => setBails(e, parseInt(e.target.value))} 
                    style={{ padding: '.2rem', cursor: 'text', width: '2rem' }} 
                type='number' 
                    step='.1'
                    max='1.0'
                    min='0.5'
                className={classes.symbol}
                    value={currBailProp === 'bailDiameter' ?
                        bailDiameter
                        :
                        bailThickness
                    } />
            </div>

            <DeleteForeverIcon className={classes.delete} onClick={deleteBail} />

        </div>
    )
}

export default Bail