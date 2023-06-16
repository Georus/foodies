import express from "express";
import cors from "cors";
import foods from "./routes/get.mjs";

const port = process.env.PORT || 3000;
const app = express();

const foodObject = [
  {
    id: 7,
    title: "Pork Ribs",
    img: "https://images-saved-for-food-usage.s3.us-east-2.amazonaws.com/pork-rib.webp",
    description:
      "Vegetales fritos para una rica y saludable cena para toda familia, todo el sabor sin nada de la culpa",
    recipe:
      "Agarre todas las verduras y piquelas no tan finamente, y posteriormente proceda a meterlas al sarten y saltearlaspor aproximadamente 5 minutos. Retire y deje reposar por otros 5 y listo.",
  },
  {
    id: 8,
    title: "Tuna salad",
    img: "https://images-saved-for-food-usage.s3.us-east-2.amazonaws.com/tuna-salad.webp",
    description:
      "Delicioso spaguetti que no tiene nada que pedirle a la bolognesa",
    recipe:
      "Cocer el spaguetti hasta que este al dente y posteriormente mezclar con la salsa pesto y una cama de verduras al vapor.",
  },
  {
    id: 9,
    title: "Vegetable salad",
    img: "https://images-saved-for-food-usage.s3.us-east-2.amazonaws.com/vegetable-salad.webp",
    description: "Hamburguesa hecha de la mas alta calidad a precio accesible",
    recipe:
      "Agarrar carne molida con las manos, realizar pequeñas bolitas" +
      "y colocar al sarten, preparar el pan con mantequilla y picar la verdura y listo",
  },
  {
    id: 10,
    title: "Meat spaggetti",
    img: "https://images-saved-for-food-usage.s3.us-east-2.amazonaws.com/meat-spaggeti.webp",
    description: "Carne directa del mejor rancho del pais",
    recipe:
      "Picar la carne finamente despues de asarla" +
      "y posteriormente comersela con la pasion de un semidios",
  },
];

app.use(cors());
app.use(express.json());
app.use("/food", foods);

//await collection.insertMany(foodObject);

app.listen(port, () => console.log(`Listening on port ${port}...`));
