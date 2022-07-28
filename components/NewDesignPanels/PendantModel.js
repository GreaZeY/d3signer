import { useRef, useEffect, useState, useMemo } from "react";
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
} from "./utils/threeUtils";
import { useSelector, useDispatch } from "react-redux";
import Bails from "./Bails/Bails";
import { useControl } from "react-three-gui";
import { ChangeMode } from "../ThreeGUIControls/guiContolsComponents";
import Symbols from "./Symbols/Symbols.js";
import { THREE_UNIT_TO_MM } from "../../lib/constants/designPropsConstants";
// import JoinLetters from "./JoinLetters";
import LoadModels from "./LoadModels/LoadModels";
// import { designProps } from "../../lib/actions/designAction";
// import { MODEL_GENERATED, GENERATING_MODEL } from '../../lib/constants/designPropsConstants';
// import { designProps as designPropsFunc } from '../../lib/actions/designAction';

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

// let stoneCount = 0
extend({ TextGeometry, TransformControls });
let textGeometry = new TextGeometry();

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
    symbols,
  } = currDesign;

  const [boundingBoxPoints, setBoundingBoxPoints] = useState({
    max: {},
    min: {},
  });

  const txtSurface = useRef();
  const pendant = useRef();
  const light = useRef();
  const stone = useRef();
  const stoneGroup = useRef();
  const transform = useRef();
  const dispatch = useDispatch();
  // const instance = useRef()
  // const dispatch = useDispatch()

  const font = useMemo(() => getFont(currFont), [currFont]);

  const diamond = useMemo(
    () => loadStone(currStoneShape, currStoneColor),
    [currStoneShape, currStoneColor]
  );

  useEffect(() => {
    textGeometry = new TextGeometry(text, {
      font,
      size: { size:length/ THREE_UNIT_TO_MM,letterSpacings},
      letterSpacings,
      height: thickness / 10,
      ...bevelProps,
    });
    geometryWithoutHoles = textGeometry;
    textGeometry.computeBoundingBox();
    setBoundingBoxPoints(textGeometry.boundingBox);
  }, [text, length, font, thickness, base, letterSpacings]);

  useEffect(() => {
    if (stoneGroup.current) stoneGroup.current.children = [];
  }, [length, font, thickness]);

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // will show a stone over mesh and follows the pointer
  const showStoneOnPendant = (e) => {
    if (!currStoneColor && !currStoneShape) return;
    const { x, y } = e.point;
    const z = boundingBoxPoints.max.z;
    const diff = (stoneSize / 100) * 0.06;
    stone.current.position.set(x, y, z - diff);
    // stone.current.material.transparent = true
    // stone.current.material.opacity = .5
  };

  // will drop a stone on pendant mesh
  const placeStone = async (e) => {
    if (!currStoneColor && !currStoneShape) return;
    const { x, y } = e.point;
    // await dispatch({ type: GENERATING_MODEL })
    const dia = diamond.clone();
    dia.name = "stone";
    dia.material.transparent = false;
    dia.material.opacity = 1;
    // stone.current.position.set(x, y)
    // stone.current.position.set(x, y, z )
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
      // pendant.current.add(deletedMesh)
      textGeometry = union(deletedMesh, txtSurface.current);
      txtSurface.current.geometry = textGeometry;
      grp.current.remove(targetStone);
    }
  };

  // handling keyboard shortcuts
  const keyPressHandler = (e) => {
    // todo: delete  from store as well
    if (e.key === "Delete") {
      let obj = transform.current?.object;
      if (obj) {
        console.log(obj);
        transform.current.detach();
        obj.parent.remove(obj);
        guiControls.current.style.display = "none";
        // console.log(currDesign)
        // let syms = symbols.filter((s,i)=>i!==obj.userData.index)

        // dispatch(designProps({ ...currDesign, symbols:syms  }))
      }
    }
  };

  useEffect(() => {
    // listeners
    if (transform.current) {
      // disabling Orbit Controls when transform controls are enabled
      const tControls = transform.current;
      const disableOrbitControls = (event) =>
        (controls.current.enabled = !event.value);
      tControls.addEventListener("dragging-changed", disableOrbitControls);
      // remove stone listener
      window.addEventListener("pointerdown", (e) => removeStone(e, stoneGroup));
      domElement.addEventListener("click", canvasClickListener);
      document.addEventListener("keydown", keyPressHandler);

      // cleanup for listeners
      return () => {
        tControls.removeEventListener("dragging-changed", disableOrbitControls);
        domElement.removeEventListener("click", canvasClickListener);
        document.removeEventListener("keydown", keyPressHandler);
        window.removeEventListener("pointerdown", (e) =>
          removeStone(e, stoneGroup)
        );
      };
    }
  }, []);

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

  useControl("Delete", {
    type: "button",
    onClick: () => keyPressHandler({ key: "Delete" }),
  });

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
    const { x, y, z } = state.camera.position;
    // light.current.position.set(x, y, z + 1);

    // zoom controls
    if (zoom.isZooming) {
      if (zoom.mode === "-") {
        if (z > 1) return;
        state.camera.position.z += 0.1;
      } else {
        if (z < 0.25) return;
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
    let children = [pendant.current.parent];
    // let tControls = transform.current
    // if (tControls) children.push(tControls)
    let intersectsTrans = state.raycaster.intersectObjects(children);
    // console.log(intersectsTrans)
    if (intersectsTrans.length > 0) {
      clickAway = false;
    } else {
      clickAway = true;
    }
  });

  const onUpdateTxtGeometry = (mesh) => {
    let geometry = mesh.geometry;
    geometry.center();
  };

  const attachTransformControl = (e) => {
    transform.current.attach(e.object);
    guiControls.current.style.display = "block";
  };

  return (
    <>
      {/* <spotLight angle={1} penumbra={0} ref={light} intensity={.5} /> */}
      <group ref={model}>
        <group name="pendant" ref={pendant}>
          <mesh
            geometry={textGeometry}
            ref={txtSurface}
            onClick={placeStone}
            onPointerMove={showStoneOnPendant}
            onPointerEnter={() => (diamond.visible = true)}
            onPointerLeave={() => (diamond.visible = false)}
            onUpdate={onUpdateTxtGeometry}
          >
            <meshStandardMaterial
              attach="material"
              color={base}
              metalness={1}
              roughness={0.3}
              emissiveIntensity={1}
              onUpdate={(e) => console.log(e)}
            />
          </mesh>
        </group>
        <group name="stoneGroup" ref={stoneGroup}>
          <primitive
            scale={stoneSize / (10 * THREE_UNIT_TO_MM)}
            ref={stone}
            object={diamond}
            color={currStoneColor}
            visible={false}
          />
        </group>
        <group name="controllables" onClick={attachTransformControl}>
          <Symbols txtSurface={txtSurface} />
          <Bails txtSurface={txtSurface} />
          <LoadModels />
          {/* <JoinLetters controls={controls} /> */}
        </group>
      </group>
      <group>
        <transformControls
          ref={transform}
          args={[camera, domElement]}
          mode={mode}
        />
      </group>
    </>
  );
};

export default pendantModel;
