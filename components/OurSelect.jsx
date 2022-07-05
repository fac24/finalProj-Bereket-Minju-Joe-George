import Select from "react-select";

export default function OurSelect({ name, defaultValue, onChange, options }) {
  return (
    <Select
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
    />
  );
}
