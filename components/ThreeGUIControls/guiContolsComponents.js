import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';



export const ChangeMode = ({ value, setValue }) => (
    <FormControl style={{ width: '100%', marginTop: '1rem' }}>
        <InputLabel >Mode</InputLabel>
        <Select
            value={value}
            label="Mode"
            onChange={(e) => setValue(e.target.value )}
        >

            <MenuItem value={'translate'}>translate</MenuItem>
            <MenuItem value={'rotate'}>rotate</MenuItem>
            <MenuItem value={'scale'}>scale</MenuItem>
        </Select>
    </FormControl>
);

