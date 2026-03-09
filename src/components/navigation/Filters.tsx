import { TextField, InputAdornment, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type FiltersProps = {
  query: string;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Filters = ({ query, handleQueryChange }: FiltersProps) => {
  const handleClear = () => {
    // Create a synthetic event to maintain consistency with handleQueryChange
    const event = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    handleQueryChange(event);
  };

  return (
    <TextField
      id="outlined-required"
      label="Search Events"
      placeholder="Enter city, artist, or event"
      // TS: Binds the input value to the query state, making this a controlled component
      value={query}
      // TS: Updates query state when the input value changes
      onChange={handleQueryChange}
      size="small"
      fullWidth
      slotProps={{
        input: {
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                aria-label="clear search"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default Filters;