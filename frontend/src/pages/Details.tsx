import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Details = () => {
  const { data: results } = useQuery({
    queryKey: ["details"],
    queryFn: () =>
      axios.get<string>("http://localhost:3000/food").then((res) => res.data),
  });

  return <div>Details and {results}</div>;
};

export default Details;
