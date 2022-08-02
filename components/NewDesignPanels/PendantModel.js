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
import LoadModels from "./LoadModels/LoadModels";
import {initialBoundingBox} from '../../lib/constants/pendantDimensionConstants'
// import JoinLetters from "./JoinLetters";
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
  } = currDesign;

  const [boundingBoxPoints, setBoundingBoxPoints] = useState(initialBoundingBox);

  const txtSurface = useRef();
  const pendant = useRef();
  const stone = useRef();
  const stoneGroup = useRef();
  const transform = useRef();
  // const dispatch = useDispatch();


  const font = useMemo(() => getFont(currFont), [currFont]);

  const diamond = useMemo(
    () => loadStone(currStoneShape, currStoneColor),
    [currStoneShape, currStoneColor]
  );

  useEffect(() => {
    textGeometry = new TextGeometry(text, {
      font,
      size: { size: 1, letterSpacings },
      ...bevelProps,
    });
    geometryWithoutHoles = textGeometry;
  }, [text, length, font, thickness, base, letterSpacings]);

  useEffect(() => {
    if (stoneGroup.current) stoneGroup.current.children = [];
  }, [length, font, thickness, letterSpacings]);

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // will show a stone over mesh and follows the pointer
  const showStoneOnPendant = (e) => {
    if (!currStoneColor && !currStoneShape) return;
    const { x, y } = e.point;
    const z = boundingBoxPoints.max.z;
    const diff = stone.current.geometry.boundingBox.max.z*.15 ; //75% of diamond will be inside pendant
    stone.current.position.set(x, y, z - diff);
  };

  // will drop a stone on pendant mesh
  const placeStone = async () => {
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
    let children = [pendant.current.parent];
    let intersectsTrans = state.raycaster.intersectObjects(children);
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
    const { x, y, z } = geometry.boundingBox.max;
    let len = length/2
    geometry.scale(len / x, (len / y) * 0.5, thickness*.5 / z);
    setBoundingBoxPoints(geometry.boundingBox);
    console.log(geometry.boundingBox.max);
    // console.log(geometry.boundingBox.min);
  };

  const onUpdateStone = (mesh) => {
    let geometry = mesh.geometry;
    if (!geometry) return
    const { x, y, z } = geometry.boundingBox.max;
    let scaleX = (stoneSize * 0.5) / x;
    let scaleY = (stoneSize * 0.5) / y;
    mesh.scale.set(scaleX, scaleY, scaleX);
    console.log(geometry.boundingBox.max);
  };

  const attachTransformControl = (e) => {
    transform.current.attach(e.object);
    guiControls.current.style.display = "block";
  };


  const getObjectDetails =(obj)=> {
console.log(obj)
  }
  return (
    <>
      <object3D ref={model} onUpdate={getObjectDetails}>
        <group name="pendant" ref={pendant}>
          <mesh
            geometry={textGeometry}
            ref={txtSurface}
            onClick={placeStone}
            onPointerMove={showStoneOnPendant}
            onPointerEnter={() => (diamond.visible = true)}
            onPointerLeave={() => (diamond.visible = false)}
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
        <group
          name="controllables"
          onClick={attachTransformControl}
          userData={{ color: base }}
        >
          <Symbols boundingBoxPoints={boundingBoxPoints} />
          <Bails boundingBoxPoints={boundingBoxPoints} />
          <LoadModels />
          {/* <JoinLetters controls={controls} /> */}
        </group>
      </object3D>
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
