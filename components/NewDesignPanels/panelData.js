import { bailDiameterBounds, bailThicknessBounds } from "../../lib/constants/pendantDimensionConstants";

export const availableSymbols = [
  { title: "Heart", symbol: "♡" },
  { title: "Octothorp", symbol: "#" },
  { title: "Star", symbol: "☆" },
  { title: "Infinity", symbol: "∞" },
  { title: "Ampersand", symbol: "&" },
  { title: "Crown", symbol: "" },
  { title: "Dollar", symbol: "$" },
  { title: "Crucifix", symbol: "†" },
  { title: "Ankh", symbol: "☥" },
  { title: "Eye of Horus", symbol: "" },
  { title: "Anchor", symbol: "⚓" },

  { title: "Butterfly", symbol: "" },
  { title: "Bear", symbol: "" },
  { title: "Musical Note", symbol: "" },
  { title: "Club", symbol: "" },
  { title: "Spades", symbol: "" },
  { title: "Clover", symbol: "" },
  { title: "Skull", symbol: "" },
];

export const stoneShapes = [
    'brilliant',
    'eight',
    'pear',
    'stepCut',
    'trilliant',
]

export const stoneColor = [
    'darkred',
    'darkgreen',
    'yellow',
    'pink',
    'purple',
    'white'
]

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

export const bailType = [
    'bail0',
    'bail1',
    'bail2',
    'bail3',
] 

export const  bailSizes = {
  diameter: bailDiameterBounds.min,
  thickness: bailThicknessBounds.min,
};