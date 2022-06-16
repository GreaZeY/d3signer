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
import { useDispatch, useSelector } from 'react-redux';
import { designProps } from "../../lib/actions/designAction"
import { fonts } from './assets/allFonts';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Typography } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import useCollapse from 'react-collapsed'
import { stoneShapes, stoneColor, colors, bailType } from "./panelData";
const shapeDir = '/assets/crimps/stoneShapes'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Brilliant from "./StoneComponents/Brilliant";
import Trilliant from "./StoneComponents/Trilliant";
import Eight from "./StoneComponents/Eight"
import Pear from "./StoneComponents/Pear";
import StepCut from "./StoneComponents/StepCut"





const LeftPanel = ({ props }) => {

  const { classes } = props
  // bail expand and collapse 
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse()

  const [currSizeProp, setCurrSizeProp] = useState('Length');
  const [bails, bailsCount] = useState([]);
  const [currBailType, setCurrBailType] = useState('bail0');
  
  const { designProps: currDesign } = useSelector(state => state.designProps)
  const {
    text,
    length,
    width,
    thickness,
    font,
    currStoneShape,
    stoneSize,
  } = currDesign;

  const dispatch = useDispatch()

  const setSizes = (e, val) => {
    currSizeProp === 'Length' ?
      dispatch(designProps({ ...currDesign, length: val }))
      :
      (
        currSizeProp === 'Width' ?
          dispatch(designProps({ ...currDesign, width: val }))
          :
          dispatch(designProps({ ...currDesign, thickness: val }))
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
    dispatch(designProps({ ...currDesign, text: txt }))
  }


  // dispatching design's properties
  useEffect(() => {
    dispatch(designProps({
      ...currDesign,
      bails,
    }))
  }, [bails])

  const setStoneColor = e => {
    if (e.target.tagName !== 'svg' || e.target.tagName !== 'path')
      dispatch(designProps({ ...currDesign, currStoneColor: e.target.getAttribute('fill') }))

  }


  const [showTip, setShowTip] = useState(false)


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
              onChange={(e) => dispatch(designProps({ ...currDesign, font: e.target.value }))}
            >

              {fonts.map(ff => <MenuItem key={ff.original_font_information.fullName} value={ff.original_font_information.fullName}  >{ff.original_font_information.fullName}</MenuItem>)

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
                step={0.1}
                style={{ marginRight: '1rem' }}
                min={currSizeProp === 'Length' ? 20 : 0.4}
                max={currSizeProp === 'Length' ? 30 : 2}
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
              <input onChange={e => setSizes(e, e.target.value)} style={{ padding: '.2rem', cursor: 'text', width: '2rem' }} type='number' className={classes.symbol} step={0.1} value={currSizeProp === 'Length' ?
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
            <div onClick={(e) => dispatch(designProps({ ...currDesign, base: e.target.style.background }))} className={classes.flexRow}>
              {
                colors.map(item => (
                  <div className={classes.base} title={item.name} style={{ background: item.color }} ></div>
                ))
              }
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}  >
            <div>
              <InputLabel className="settings-head">Add Symbol</InputLabel>
              <div onClick={(e) => dispatch(designProps({ ...currDesign, symbol: e.target.title }))} className={classes.flexRow}>
                <div title='Heart' className={classes.symbol}  >♡</div>
                <div title='Octothorp' className={classes.symbol}  >#</div>
                <div title='Star' className={classes.symbol}  >☆</div>
                <div title='Infinity' className={classes.symbol}  >∞</div>
                <div title='Ampersand' className={classes.symbol}  >&</div>
                <div title='Crown' className={classes.symbol}  >♛</div>
              </div>
            </div>
          </div>

          <fieldset style={{ position: 'relative', marginTop: '1rem', border: '1px solid rgb(185 183 183)' }}>
            <legend className={classes.flexRow + " settings-head"}>Diamonds & Stones <InfoOutlinedIcon onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)} title='Tip' style={{ fontSize: '1rem', color: 'black', cursor: 'pointer', marginLeft: '.3rem' }} /> </legend>
            {
              showTip &&
              <div className={classes.infoTip} >
                Choose Shape and color first to place stones,
                and Right Click to remove the placed stone.
              </div>
            }
            <div onClick={(e) => dispatch(designProps({ ...currDesign, currStoneShape: e.target.alt }))}  >
              <InputLabel className="settings-head">Shape</InputLabel>
              <div className={classes.flexRow} style={{ flexWrap: 'wrap' }} >
                {
                  stoneShapes.map(shape => (
                    <div style={{ border: currStoneShape === shape && '2px solid #8e24aa' }} className={classes.stoneShape + ' ' + classes.flexRow}>
                      <img className={classes.img} src={`${shapeDir}/${shape}.svg`} alt={shape} />

                    </div>
                  ))
                }
              </div>

            </div>
            {/* {
                stoneImages.map(img=>(
                  <img src={img.src} style={{border:currStone===img.src&&'2px solid #8e24aa'}} className={classes.base} alt={img.src} />
                ))
              } */}
            <div style={{ marginTop: '.5rem' }}  >
              <InputLabel className="settings-head">Color</InputLabel>
              <div className={classes.flexRow} onClick={setStoneColor} style={{ flexWrap: 'wrap' }} >
                {
                  //   stoneColor.map(color => (
                  //     // <div style={{ border: currStoneColor === color && '2px solid #8e24aa', background: color }} className={classes.stoneShape + ' ' + classes.flexRow}>
                  //     //   {/* <img className={classes.img} src={`${imgDir}/${color}.png`} alt={color} /> */}
                  //     // </div>


                  // ))

                  currStoneShape === 'brilliant' ?
                    stoneColor.map(color => (
                      <Brilliant width='1rem' color={color} />
                    ))
                    :
                    currStoneShape === 'trilliant' ?
                      stoneColor.map(color => (
                        <Trilliant width='1rem' color={color} />
                      ))
                      :
                      currStoneShape === 'eight' ?
                        stoneColor.map(color => (
                          <Eight width='1rem' color={color} />
                        ))
                        :
                        currStoneShape === 'pear' ?
                          stoneColor.map(color => (
                            <Pear width='1rem' color={color} />
                          ))
                          : stoneColor.map(color => (
                            <StepCut width='1rem' color={color} />
                          ))
                }

              </div>
            </div>
            <div style={{ marginTop: '.5rem' }}  >
              <InputLabel className="settings-head">Stone Size</InputLabel>
              <input
                onChange={(e) => dispatch(designProps({ ...currDesign, stoneSize: e.target.value }))}
                value={stoneSize}
                type='number'
                step='.1'
                max='5.0'
                min='0.5'

                className={classes.symbol}
                style={
                  { width: '2.5rem' }
                }

              />
            </div>
          </fieldset>
          <div style={{ marginTop: '1rem' }} >
            <div style={{ width: '100%', marginTop: '1rem', justifyContent: 'space-between' }} className={classes.flexRow}>
              
              <Button disabled={true} {...getToggleProps()} size="small" >
                {(isExpanded ? <><KeyboardArrowUpIcon /></> : <><KeyboardArrowDownIcon /></>)} Bails {`(${bails.length})`}
              </Button>
              <Button size="small" onClick={setBailNumber} > <AddIcon /></Button>
            </div>
            <section {...getCollapseProps()}>
              <InputLabel style={{ marginLeft: '1rem' }} className="settings-head">Bails</InputLabel>
              <div className={classes.flexRow} style={{ flexWrap: 'wrap',marginLeft:'1rem' }} >
                {
                  bailType.map(bail => (
                    <div
                      onClick={(e) => setCurrBailType(e.target.alt )}
                      key={bail}
                      style={{ border: currBailType === bail && '3px solid #8e24aa' }}
                      className={classes.bailType + ' ' + classes.flexRow}>
                      <img width={25} height={25} src={`/assets/bails/img/${bail}.png`} alt={bail} />
                    </div>
                  ))
                }
              </div>

              {
                bails.map((bail, i) => <Bail key={i} index={i} currBailType={currBailType} bails={bails} setBailsData={bailsCount} classes={classes} />)
              }
            </section>
          </div>



        </CardBody>
      </Card>

    </GridItem>
  )
}

export default LeftPanel