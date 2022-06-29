import React, { useEffect, useState } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import { useSelector } from 'react-redux';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {maxBailDiameter,maxBailThickness,minBailDiameter,minBailThickness} from '../../lib/constants/pendantDimensionConstants'
const sizes = { diameter: minBailDiameter, thickness: minBailThickness }
const Bail = (props) => {


    const { classes, bails, setBailsData, index, currBailType } = props
    const { designProps } = useSelector(state => state.designProps)

    const [bailSizes, setBailSizes] = useState(sizes);
    const [currBailProp, setCurrBailProp] = useState('bailDiameter');
    const [currBailPosition, setCurrBailPosition] = useState([]);


    const setBails = (e, val) => {
        currBailProp === 'bailDiameter' ?
            setBailSizes({ ...bailSizes, diameter: val })
            :
            setBailSizes({ ...bailSizes, thickness: val })
    }


    useEffect(() => {
        if (designProps.bails[index]) {
            setCurrBailPosition(designProps.bails[index].position)
            setBailSizes(designProps.bails[index].sizes)
        }
    }, [designProps])
    // console.log(props)

    useEffect(() => {
        let currBail = [...bails]
        currBail[index].position = currBailPosition
        if (!currBail[index].type) currBail[index].type = currBailType
        if (!currBail[index].dimensionType) currBail[index].dimensionType = currBailType === 'bail0' ? 'Diameter' : 'Size'
        currBail[index].sizes = bailSizes
        setBailsData(currBail)

    }, [bailSizes, currBailPosition])


    const deleteBail = () => {
        let currBail = [...bails]

        currBail = bails.filter((bail, i) => i !== index)

        setBailsData(currBail)
    }

    const getMin=()=>(
        currBailProp === 'bailDiameter' ?
            minBailDiameter
            :
            minBailThickness
    )

    const getMax = () => (
        currBailProp === 'bailDiameter' ?
            maxBailDiameter
            :
            maxBailThickness
    )
    
    

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
                    style={{ marginLeft: '.3rem' }}
                    onChange={setBails}
                    step={.1}
                    min={getMin()}
                    max={getMax()}
                    value={currBailProp === 'bailDiameter' ?
                        bailSizes.diameter
                        :
                        bailSizes.thickness

                    }
                    color="primary"
                />
                <input
                    onChange={e => setBails(e, e.target.value)}
                    style={{ padding: '.2rem', cursor: 'text', width: '2rem' }}
                    type='number'
                    step='.1'
                    min={getMin()}
                    max={getMax()}
                    className={classes.symbol}
                    value={currBailProp === 'bailDiameter' ?
                        bailSizes.diameter
                        :
                        bailSizes.thickness
                    } />
            </div>

            <DeleteForeverIcon className={classes.delete} onClick={deleteBail} />

        </div>
    )
}

export default Bail




