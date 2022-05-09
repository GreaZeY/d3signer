import React, { useEffect, useState } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import { useSelector } from 'react-redux';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
const sizes =  { diameter: 13, thickness: 1, width: 10 } 
const Bail = (props) => {


    const { classes, bails, setBailsData, index } = props
    const { designProps } = useSelector(state => state.designProps)
    
    const [bailDiameter, setBailDiameter] = useState(sizes.diameter);
    const [bailThickness, setBailThickness] = useState(sizes.thickness);
    const [bailWidth, setBailWidth] = useState(sizes.width);
    const [currBailProp, setCurrBailProp] = useState('bailDiameter');
    const [currBailPosition, setCurrBailPosition] = useState('Right');


    const setBails = (e, val) => {
        currBailProp === 'bailDiameter' ?
            setBailDiameter(val)
            :
            (
                currBailProp === 'bailWidth' ?
                    setBailWidth(val) : setBailThickness(val)
            )
    }


    useEffect(()=>{
        if(designProps.bails[index])
        {setCurrBailPosition(designProps.bails[index].position)
        setBailDiameter(designProps.bails[index].sizes.diameter)
        setBailThickness(designProps.bails[index].sizes.thickness)
        setBailWidth(designProps.bails[index].sizes.width)}
    },[designProps])
    // console.log(props)

    useEffect(() => {
        let currBail = [...bails]
        currBail[index].position = currBailPosition
        currBail[index].sizes.diameter = bailDiameter
        currBail[index].sizes.width = bailWidth
        currBail[index].sizes.thickness = bailThickness
        setBailsData(currBail)

    }, [bailDiameter, bailThickness, bailWidth, currBailPosition])


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
                        <MenuItem value={'bailDiameter'}>Diameter</MenuItem>
                        <MenuItem value={'bailWidth'}>Width</MenuItem>
                        <MenuItem value={'bailThickness'}>Thickness</MenuItem>
                    </Select>
                </FormControl>

            </div>
            <div style={{ width: '100%', marginTop: '1rem', display: 'flex' }}>
                <Slider
                    aria-label="Sizes"
                    onChange={setBails}
                    min={10}
                    max={20}
                    value={currBailProp === 'bailDiameter' ?
                        bailDiameter
                        :
                        (
                            currBailProp === 'bailWidth' ?
                                bailWidth : bailThickness
                        )
                    }
                    color="primary"
                />
                <input onChange={e => setBails(e, parseInt(e.target.value))} style={{ padding: '.2rem', cursor: 'text' }} type='number' maxLength={30} minLength={20} className={classes.symbol}
                    value={currBailProp === 'bailDiameter' ?
                        bailDiameter
                        :
                        (
                            currBailProp === 'bailWidth' ?
                                bailWidth : bailThickness
                        )
                    } />
            </div>

            <DeleteForeverIcon className={classes.delete} onClick={deleteBail} />

        </div>
    )
}

export default Bail