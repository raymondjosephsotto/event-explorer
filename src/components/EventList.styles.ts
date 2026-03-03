import { styled } from "@mui/material/styles";
import { Card, CardContent, CardMedia, Grid, } from "@mui/material";



export const EventsGrid = styled(Grid)(() => ({
    maxWidth: 1000,
    marginLeft: "auto",
    marginRight: "auto",
}));

export const EventCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    overflow: "hidden",
    borderRadius: Number(theme.shape.borderRadius) * 2,
    boxShadow: theme.shadows[3],

    [theme.breakpoints.up("md")]: {
        flexDirection: "row",
    },
}));

export const EventImage = styled(CardMedia)(({ theme }) => ({
    width: "100%",
    height: 200,
    objectFit: "cover",

    [theme.breakpoints.up("md")]: {
        width: 300,
        height: "auto",
    },
}));

export const EventContent = styled(CardContent)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(3),
}));
