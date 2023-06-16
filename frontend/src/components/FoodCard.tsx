import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  img: string;
  title: string;
  recipe: string;
  description: string;
}

const FoodCard = ({ img, title, recipe, description }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const cardWidth = (window.innerWidth / 4).toString() + "px";
  const margin = (window.innerWidth / 16).toString() + "px";

  return (
    <Card
      sx={{
        width: cardWidth,
        height: "fit-content",
        marginLeft: margin,
        minWidth: cardWidth,
      }}
    >
      <CardHeader title={title} subheader="September 14, 2016"></CardHeader>
      <CardMedia
        component="img"
        width="345"
        height="194"
        image={img}
        alt="Fried vegetables dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={() => handleExpandClick()}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Metodo de preparacion</Typography>
          <Typography paragraph>{recipe}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FoodCard;
