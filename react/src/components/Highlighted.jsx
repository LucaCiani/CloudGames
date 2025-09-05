import { useGlobalContext } from "../contexts/GlobalContext";

export default function Highlighted() {
  const { videogames } = useGlobalContext();

  // Filtra solo i videogiochi con ID 3, 7, 11, 12
  const filteredVideogames =
   videogames?.filter(videogame => [1, 3, 5, 7, 11, 12].includes(videogame.id)) || [];

  return (
    <div className="container my-5">
      <div className="row row-cols-2 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredVideogames.map((videogame) => (
          <div key={videogame.id}>
            <div className="card border-0 shadow-sm">
              <img
                src={videogame.image_url}
                alt={videogame.name}
                className="card-img"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 px-1">
              <h6 className="text-white">{videogame.name}</h6>
              <h6 className="text-white">€{videogame.price}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
