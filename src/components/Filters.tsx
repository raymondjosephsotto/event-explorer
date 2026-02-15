import { TextField } from "@mui/material";

type FiltersProps = {
  city: string;
  handleCityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Filters = ({city, handleCityChange}: FiltersProps) => {


  return (
    <TextField
      required
      id="outlined-required"
      label="City"
      placeholder="Enter your city"
      // TS: Binds the input value to the city state, making this a controlled component
      value={city}
      // TS: Updates city state when the input value changes
      onChange={handleCityChange}
    />
  );
};

export default Filters;