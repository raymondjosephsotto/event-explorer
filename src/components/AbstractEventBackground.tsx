import type { Event } from "../types/event.types";
import { useMediaQuery } from "@mui/material";

type Props = {
  event: Event;
  className?: string;
  style?: React.CSSProperties;
};

const categoryPalette: Record<string, string> = {
  Music: "linear-gradient(135deg, #667eea, #764ba2)",
  Sports: "linear-gradient(135deg, #1e3c72, #2a5298)",
  Arts: "linear-gradient(135deg, #c471f5, #fa71cd)",
  Theatre: "linear-gradient(135deg, #f7971e, #ffd200)",
  Family: "linear-gradient(135deg, #43cea2, #185a9d)",
};

const neutralGradients = [
  "linear-gradient(135deg, #2c3e50, #4ca1af)",
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #3a1c71, #d76d77)",
  "linear-gradient(135deg, #0f2027, #203a43)",
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const AbstractEventBackground = ({
  event,
  className,
  style,
}: Props) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const primaryCategory = event.categories?.[0];

  const background =
    (primaryCategory && categoryPalette[primaryCategory]) ||
    neutralGradients[hashString(event.id) % neutralGradients.length];

  return (
    <div
      className={className}
      style={{
        width: isMobile ? "100%" : "300px",
        height: isMobile ? "200px" : "auto",
        background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "inherit",
        display: "block",
        ...style,
      }}
    />
  );
};