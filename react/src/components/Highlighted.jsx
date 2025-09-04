
import { useGlobalContext } from "../contexts/GlobalContext";

export default function Highlighted () {

    const { videogames } = useGlobalContext();

  return (
        <>
            <div className="container my-5">
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-5">
                    {videogames &&
                        videogames.map((videogame) => {
                            return (
                                <div key={videogame.id} className="col">
                                    <div className="card h-100 border-0">
                                        <img src={videogame.image_url} alt="" />
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {videogame.name}
                                            </h5>
                                            <p>{videogame.price}€</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );  
}
