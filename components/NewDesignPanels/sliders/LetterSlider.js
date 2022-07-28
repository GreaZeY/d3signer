import InputLabel from "@material-ui/core/InputLabel";
import Slider from "@material-ui/core/Slider";

const LetterSlider = ({ char, classes }) => {
  const setLetterSpacing = () => {};

  return (
    <div style={{ marginTop: ".5rem" }}>
      <InputLabel className="settings-head">Stone Size</InputLabel>
      <div style={{ width: "100%" }} className={classes.flexRow}>
        <Slider
          aria-label="Sizes"
          onChange={setLetterSpacing}
          step={0.1}
          style={{ marginRight: "1rem" }}
          max={10.0}
          min={0.5}
          value={char}
        />
        <input
          onChange={setLetterSpacing}
          value={char}
          type="number"
          step=".1"
          max="10.0"
          min="0.5"
          className={classes.symbol}
          style={{ width: "2.5rem" }}
        />
      </div>
    </div>
  );
};

export default LetterSlider;
