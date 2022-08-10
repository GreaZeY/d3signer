import {
  bailDiameterBounds,
  bailThicknessBounds,
} from "../../lib/constants/pendantDimensionConstants";
import { importAll } from "../../lib/utils";

export const availableSymbols = importAll(
  require.context("../../public/assets/symbols", false, /.svg$/)
).map((symbol) => {
  return {
    title: symbol.default.src.slice(20).split(".")[0],
    src: symbol.default.src,
  };
});


export const stoneShapes = [
  "brilliant",
  "eight",
  "pear",
  "stepCut",
  "trilliant",
];

export const stoneColor = [
  "darkred",
  "darkgreen",
  "yellow",
  "pink",
  "purple",
  "white",
];

export const colors = [
  {
    name: "Gold",
    color: "#FFC900",
  },
  {
    name: "Silver",
    color: "#C3C7C7",
  },
  {
    name: "Rose Gold",
    color: "#B76E79",
  },
  {
    name: "Sterling Silver",
    color: "#9EAFC2",
  },
];

export const bailType = ["bail0", "bail1", "bail2", "bail3"];

export const bailSizes = {
  diameter: bailDiameterBounds.min,
  thickness: bailThicknessBounds.min,
};
