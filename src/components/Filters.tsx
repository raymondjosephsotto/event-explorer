import { TextField } from "@mui/material";

type FiltersProps = {
  query: string;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Filters = ({ query, handleQueryChange }: FiltersProps) => {


  return (
    <TextField
      id="outlined-required"
      label="Search Events"
      placeholder="Enter city, artist, or event"
      // TS: Binds the input value to the query state, making this a controlled component
      value={query}
      // TS: Updates query state when the input value changes
      onChange={handleQueryChange}
      fullWidth
    />
  );
};

export default Filters;