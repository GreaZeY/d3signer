const CustomFileInput = ({ label, onChange, style }) => {
  return (
    <>
      <label
        style={style}
        htmlFor="import"
      >
        {label}
      </label>
      <input
        type="file"
        id="import"
        accept=".gltf"
        hidden
        onChange={onChange}
      />
    </>
  );
};

export default CustomFileInput;
