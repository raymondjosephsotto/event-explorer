import { useState } from "react";
import { TextField } from "@mui/material";

const Filters = () => {
  //create a state (city)
  const [city, setCity] = useState<string>(""); //TS: generic type annotation

  // Handle changes to the city input field, ensuring type safety for the event parameter
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  }

  return (
    <TextField
      required
      id="outlined-required"
      label="City"
      defaultValue="Enter your CIty"
      // TS: Binds the input value to the city state, making this a controlled component
      value={city}
      // TS: Updates city state when the input value changes
      onChange={handleCityChange}
    />
  );
};

export default Filters;