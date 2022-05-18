import React, { useEffect, useState } from "react";
import AddIcon from '@material-ui/icons/Add';

import Bail from "components/Bails/Bail";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import CustomInput from "components/CustomInput/CustomInput.js";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useDispatch } from 'react-redux';
import { designProps } from "../../lib/actions/designAction"
import { fonts } from "components/D3panel/assets/allFonts"
import { DESIGN_PROPS_REQUEST } from "../../lib/constants/designPropsConstants"
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";

import CardBody from "components/Card/CardBody.js";
import { Typography } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';

import Button from "@material-ui/core/Button";
import Crimping from "components/Crimping/Crimping"


import useCollapse from 'react-collapsed'

const LeftPanel = ({ props }) => {

  const { classes } = props
  // bail expand and collapse 
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse()


  const [font, setFont] = useState(fonts[0].familyName);
  const [text, setText] = useState('nnaya');                  //Vıcky
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(5);
  const [base, setBase] = useState('#FFC900');
  const [thickness, setThickness] = useState(4);
  const [currSizeProp, setCurrSizeProp] = useState('Length');
  const [bails, bailsCount] = useState([]);
  const [crimps,setCrimps]= useState(new Array(text.length));
  const [symbol, setSymbol] = useState('');
  const dispatch = useDispatch()




  const setSizes = (e, val) => {
    currSizeProp === 'Length' ?
      setLength(val)
      :
      (
        currSizeProp === 'Width' ?
          setWidth(val) : setThickness(val)
      )
  }

  const setBailNumber = () => {
    let bailArr = [...bails]
    bailArr.length++
    bailArr[bailArr.length - 1] = { position: [0, 0, 0], sizes: {} }
    bailsCount(bailArr)
    setExpanded(true)
  };






  const getText = e => {
    let txt = e.target.value
    txt = txt.replace(' ', '')
    setText(txt)
    setCrimps(new Array(txt.length))
  }


  // dispatching design's properties
  useEffect(() => {
    
    dispatch({ type: DESIGN_PROPS_REQUEST });
    dispatch(designProps({
      text,
      base,
      length,
      width,
      thickness,
      font,
      bails,
      symbol,
      crimps
    }))
  }, [text, base, font, length, width, thickness, bails, symbol,crimps])


  return (
    <GridItem xs={12} sm={12} md={3}>
      <Card >
        <CardBody>

          <Typography>Settings</Typography>
          <CustomInput
            labelText="Text (Your Name)"
            id="text"
            inputProps={{
              onChange: getText,
              value: text,
              maxLength: 10
            }}
            formControlProps={{
              fullWidth: true,
              marginTop: 0
            }}
          />






          {fonts.length && <FormControl style={{ width: '100%', marginTop: '1rem' }}>
            <InputLabel >Font</InputLabel>
            <Select
              value={font}
              label="font"
              onChange={(e) => setFont(e.target.value)}
            >

              {fonts.map(ff => <MenuItem key={ff.familyName} value={ff.familyName}  >{ff.familyName}</MenuItem>)

              }
            </Select>
          </FormControl>}

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginTop: '1rem', marginRight: '2rem', justifyContent: 'space-between' }} className={classes.flexRow}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small"  >
                <InputLabel >Sizes</InputLabel>
                <Select
                  size="small"
                  value={currSizeProp}
                  label="Size"
                  onChange={(e => setCurrSizeProp(e.target.value))}
                >
                  <MenuItem value={'Length'}>Length</MenuItem>
                  <MenuItem value={'Width'}>Width</MenuItem>
                  <MenuItem value={'Thickness'}>Thickness</MenuItem>
                </Select>
              </FormControl>

            </div>
            <div style={{ marginTop: '2rem', width: '100%' }} className={classes.flexRow} >
              <Slider
                aria-label="Sizes"
                onChange={setSizes}
                style={{ marginRight: '1rem' }}
                min={currSizeProp === 'Length' ? 20 : 1}
                max={currSizeProp === 'Length' ? 30 : 10}
                value={currSizeProp === 'Length' ?
                  length
                  :
                  (
                    currSizeProp === 'Width' ?
                      width : thickness
                  )
                }
                color="primary"
              />
              <input onChange={e => setSizes(e, parseInt(e.target.value))} style={{ padding: '.2rem', cursor: 'text' }} type='number' maxLength={100} minLength={1} className={classes.symbol} value={currSizeProp === 'Length' ?
                length
                :
                (
                  currSizeProp === 'Width' ?
                    width : thickness
                )} />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}  >

            <InputLabel className="settings-head">Your Base</InputLabel>
            <div onClick={(e) => setBase(e.target.style.background)} className={classes.flexRow}>
              <div className={classes.base} style={{ background: '#FFC900' }} ></div>
              <div className={classes.base} style={{ background: '#B76E79' }} ></div>
              <div className={classes.base} style={{ background: '#C0C0C0' }} ></div>
            </div>


          </div>
          <div style={{ marginTop: '1rem' }}  >
            <div>
              <InputLabel className="settings-head">Add Symbol</InputLabel>
              <div onClick={(e) => setSymbol(e.target.innerHTML)} className={classes.flexRow}>
                <div name='heart' className={classes.symbol}  >♡</div>
                <div className={classes.symbol}  >#</div>
                <div className={classes.symbol}  >☆</div>
                <div className={classes.symbol}  >∞</div>
                <div className={classes.symbol}  >&</div>
              </div>
            </div>
          </div>

          {
            [...text].map((letter,index)=>(
              <>
              <Crimping props={{letter,crimps,setCrimps,index}}  />
              <br />
              </>

            ))
              
          }

          {/* <Button onClick={() => setShowBailModal(true)} style={{ width: '100%', marginTop: '1rem' }} size="small" variant="outlined" >
                Configure Bail
              </Button> */}


          <div>
            {/* <button {...getToggleProps()}> */}
            <div style={{ width: '100%', marginTop: '1rem', justifyContent: 'space-between' }} className={classes.flexRow}>
              <Button disabled={true} {...getToggleProps()} size="small" >


                {(isExpanded ? <><KeyboardArrowUpIcon /></> : <><KeyboardArrowDownIcon /></>)} Bails {`(${bails.length})`}
                {/* Bails */}
              </Button>
              <Button size="small" onClick={setBailNumber} > <AddIcon /></Button>
            </div>
            <section {...getCollapseProps()}>

              {bails.map((bail, i) => <Bail key={i} index={i} bails={bails} setBailsData={bailsCount} classes={classes} />)
              }
            </section>
          </div>



        </CardBody>
      </Card>

    </GridItem>
  )
}

export default LeftPanel