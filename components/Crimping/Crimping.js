import React, { useState, useEffect } from "react";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector } from 'react-redux';

const Crimping = ({ props }) => {
    const { letter, index, crimps, setCrimps } = props

    const [crimping, setCrimping] = useState(null);
    const { designProps } = useSelector(state => state.designProps)

    const handleChange = (event) => {
        setCrimping(event.target.value);
    };

    useEffect(() => {
        if (designProps?.crimps[index]) {
            setCrimping(designProps.crimps[index])
        }
    }, [designProps])


    useEffect(() => {
        let currCrimp = [...crimps]
        currCrimp[index] = crimping
  
        setCrimps(currCrimp)

    }, [crimping])



    return (
        <FormControl style={{ width: '100%', marginTop: '1rem' }}>
            <InputLabel >Crimping on {letter}</InputLabel>
            <Select
                value={crimping}
                label={`Crimping#`}
                onChange={handleChange}
            >
                <MenuItem value="None">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={'blue'}>Blue Diamond</MenuItem>
                <MenuItem value={'green'}>Green Stone</MenuItem>
                <MenuItem value={'red'}>Red Diamond</MenuItem>
                <MenuItem value={'pink'}>Pink Diamond</MenuItem>
                <MenuItem value={'yellow'}>Yellow Diamond</MenuItem>
            </Select>
        </FormControl>
    )
}

export default Crimping