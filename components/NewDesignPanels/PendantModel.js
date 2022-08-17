import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { extend, useFrame, useThree } from "@react-three/fiber";
import {
  loadStone,
  getFont,
  union,
  intersect,
  subtractGeometry,
  getVolume,
} from "./utils/threeUtils";
import { useSelector, useDispatch } from "react-redux";
import Bails from "./Bails/Bails";
import { useControl } from "react-three-gui";
import { ChangeMode } from "../ThreeGUIControls/guiContolsComponents";
import Symbols from "./Symbols/Symbols.js";
import LoadModels from "./LoadModels/LoadModels";
import { initialBoundingBox } from "../../lib/constants/pendantDimensionConstants";
// import JoinLetters from "./JoinLetters";
import { designProps, updateDesignProps } from "../../lib/actions/designAction";
// import { MODEL_GENERATED, GENERATING_MODEL } from '../../lib/constants/designPropsConstants';
// import { designProps as designPropsFunc } from '../../lib/actions/designAction';

let textGeometry = new TextGeometry();
let targetStone = null,
  clickAway = false,
  geometryWithoutHoles;
const bevelProps = {
  // bevelEnabled: true,
  // bevelThickness: 1.5,
  // bevelSize: 1.5,
  // bevelSegments: 10,
  // curveSegments: 50,
};
extend({ TextGeometry, TransformControls });

let worker;

const pendantModel = ({ controls, guiControls, zoom, model }) => {
  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const {
    text,
    base,
    length,
    thickness,
    font: currFont,
    currStoneColor,
    currStoneShape,
    stoneSize,
    letterSpacings,
    lineHeights,
    symbols,
    bails,
  } = currDesign;

  const [boundingBoxPoints, setBoundingBoxPoints] =
    useState(initialBoundingBox);

  const txtSurface = useRef();
  const pendant = useRef();
  const stone = useRef();
  const stoneGroup = useRef();
  const transform = useRef();
  const dispatch = useDispatch();
  const font = useMemo(() => getFont(currFont), [currFont]);

  const diamond = useMemo(
    () => loadStone(currStoneShape, currStoneColor),
    [currStoneShape, currStoneColor]
  );

  useEffect(() => {
    if (!font) return;
    textGeometry = new TextGeometry(text, {
      font,
      size: { size: 1, letterSpacings, lineHeights },
      ...bevelProps,
    });
    geometryWithoutHoles = textGeometry;
  }, [text, length, font, thickness, base, letterSpacings, lineHeights]);

  useEffect(() => {
    if (stoneGroup.current) stoneGroup.current.children = [];
  }, [length, font, thickness, letterSpacings, lineHeights]);

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // will show a stone over mesh and follows the pointer
  const showStoneOnPendant = (e) => {
    if (!currStoneColor && !currStoneShape) return;
    const { x, y } = e.point;
    const z = boundingBoxPoints.max.z;
    const diff = stone.current.geometry.boundingBox.max.z * 0.15; //75% of diamond will be inside pendant
    stone.current.position.set(x, y, z - diff);
  };

  // will drop a stone on pendant mesh
  const placeStone = () => {
    if (!currStoneColor && !currStoneShape) return;
    // await dispatch({ type: GENERATING_MODEL })
    const dia = diamond.clone();
    dia.name = "stone";
    dia.material.transparent = false;
    dia.material.opacity = 1;
    stoneGroup.current.add(dia);
    textGeometry = subtractGeometry(txtSurface.current, dia);
    txtSurface.current.geometry = textGeometry;
    // dispatch({ type: MODEL_GENERATED })
  };

  // removing stone from group
  const removeStone = (e, grp) => {
    if (e.button === 2 && targetStone) {
      let mesh = new THREE.Mesh(geometryWithoutHoles);
      let deletedGeom = intersect(targetStone, mesh);
      let deletedMesh = new THREE.Mesh(
        deletedGeom,
        txtSurface.current.material
      );
      try {
        textGeometry = union(deletedMesh, txtSurface.current);
        txtSurface.current.geometry = textGeometry;
        grp.current.remove(targetStone);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // delete object from state
  const deleteObject = (obj) => {
    if (obj) {
      transform.current.detach();
      guiControls.current.style.display = "none";
      // deleteting object by types
      let propType = obj.userData.group;
      let propVal = currDesign[propType].filter(
        (s, i) => i !== obj.userData.index
      );
      let newState = {};
      newState[propType] = propVal;
      dispatch(designProps({ ...currDesign, ...newState }));
    }
  };

  // handling keyboard shortcuts
  const keyPressHandler = useCallback(
    (e) => {
      if (e.key === "Delete") {
        let obj = transform.current?.object;
        deleteObject(obj);
      }
    },
    [symbols, bails]
  );

  const updateAttachedObj = (e) => {
    // disabling Orbit Controls when transform controls are enabled
    controls.current.enabled = !e.value;
    //updating object transform
    if (e.value === false) {
      dispatch(updateDesignProps(e.target.object));
      // updateObject(e.target.object);
    }
  };
  useEffect(() => {
    // listeners
    // remove stone listener
    window.addEventListener("pointerdown", (e) => removeStone(e, stoneGroup));
    domElement.addEventListener("click", canvasClickListener);


    // todo: move all heavy operations to worker
    worker = new Worker("/worker.js", { type: "module" });

    worker.onmessage = (e) => {
      if (e) {
        console.log("Message from worker", e);
      }
    };
    worker.postMessage(5);

    // cleanup for listeners
    return () => {
      domElement.removeEventListener("click", canvasClickListener);
      window.removeEventListener("pointerdown", (e) =>
        removeStone(e, stoneGroup)
      );
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    const tControls = transform.current;
    if (tControls) {
      tControls.detach();
      tControls.addEventListener("dragging-changed", updateAttachedObj);
    }
    document.addEventListener("keydown", keyPressHandler);

    return () => {
      document.removeEventListener("keydown", keyPressHandler);
      tControls.removeEventListener("dragging-changed", updateAttachedObj);
    };
  }, [keyPressHandler]);

  // gui controls to change transform mode
  const closeControls = () => {
    transform.current?.detach();
    guiControls.current.style.display = "none";
  };

  let mode = useControl("Mode", {
    type: "custom",
    value: "translate",
    component: ChangeMode,
  });

  useControl("Close", { type: "button", onClick: closeControls });

  // click away listener for transform controls
  const canvasClickListener = () => {
    if (clickAway) {
      transform.current?.detach();
      guiControls.current.style.display = "none";
      clickAway = !clickAway;
    }
  };

  // three render loop
  useFrame((state) => {
    const { z } = state.camera.position;
    // light.current.position.set(x, y, z + 1);

    // zoom controls
    if (zoom.isZooming) {
      if (zoom.mode === "-") {
        if (z > 50) return;
        state.camera.position.z += 0.1;
      } else {
        if (z < 1) return;
        state.camera.position.z -= 0.1;
      }
    }

    // get clicked stone for deletion
    let intersects = state.raycaster.intersectObjects(
      stoneGroup.current.children
    );
    intersects.forEach((obj) => {
      if (obj.object.name === "stone") {
        targetStone = obj.object;
      }
    });
    if (intersects.length === 0) targetStone = null;

    // click away listener for transform controls
    let children = [pendant.current.parent, transform.current.children[0]];
    let intersectsTrans = state.raycaster.intersectObjects(children);
    // console.log(intersectsTrans);
    if (intersectsTrans.length > 0) {
      clickAway = false;
    } else {
      clickAway = true;
    }
  });

  const onUpdateTxtMesh = (mesh) => {
    if (!text) return setBoundingBoxPoints(initialBoundingBox);
    let geometry = mesh.geometry;
    geometry.center();
    const { x, z } = geometry.boundingBox.max;
    let sx = length / 2 / x;
    geometry.scale(sx, sx, (thickness * 0.5) / z);
    setBoundingBoxPoints(geometry.boundingBox);
    console.log(geometry.boundingBox.max);
    // dispatch(designProps({ ...currDesign, volume: getVolume(geometry) }));
  };
  const onUpdateStone = (mesh) => {
    let geometry = mesh.geometry;
    if (!geometry) return;
    const { x, y } = geometry.boundingBox.max;
    let sx = (stoneSize * 0.5) / x;
    let sy = (stoneSize * 0.5) / y;
    mesh.scale.set(sx, sy, sx);
    console.log(geometry.boundingBox.max);
  };

  const attachTransformControl = (e) => {
    if (currStoneShape) return;
    const obj = e.object;
    if (!(obj.parent.userData.controllable || obj.userData.controllable))
      return;
    transform.current.attach(e.object);
    guiControls.current.style.display = "block";
  };

  const getObjectDetails = (obj) => {
    // // if (!text) return setBoundingBoxPoints(initialBoundingBox);
    // let objBBox = new THREE.Box3().setFromObject(obj);
    // console.log('obj',obj);
    // if(objBBox!==boundingBoxPoints) return
    // setBoundingBoxPoints(objBBox);
  };

  return (
    <>
      <object3D
        ref={model}
        onUpdate={getObjectDetails}
        onClick={attachTransformControl}
      >
        <group
          name="pendant"
          ref={pendant}
          onClick={placeStone}
          onPointerMove={showStoneOnPendant}
          onPointerEnter={() => (diamond.visible = true)}
          onPointerLeave={() => (diamond.visible = false)}
        >
          <mesh
            geometry={textGeometry}
            ref={txtSurface}
            onUpdate={onUpdateTxtMesh}
          >
            <meshStandardMaterial
              color={base}
              metalness={1}
              roughness={0.2}
              envMapIntensity={1}
              onUpdate={(e) => console.log(e)}
            />
          </mesh>
          <Symbols boundingBoxPoints={boundingBoxPoints} />
        </group>
        <group name="stoneGroup" ref={stoneGroup}>
          <primitive
            ref={stone}
            object={diamond}
            color={currStoneColor}
            visible={false}
            onUpdate={onUpdateStone}
          />
        </group>
        <group name="controllables" userData={{ controllable: true }}>
          <Bails boundingBoxPoints={boundingBoxPoints} />
          <LoadModels />
          {/* <JoinLetters controls={controls} /> */}
        </group>
      </object3D>
      <transformControls
        ref={transform}
        args={[camera, domElement]}
        mode={mode}
        showZ={mode==='translate'?false:true}
      />
    </>
  );
};

export default pendantModel;
