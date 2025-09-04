import { useEffect } from "react";
import { useState } from "react";

export default function VideogamesPage() {
    const videogamesApiUrl = "http://localhost:3030/videogames/";
    const [videogames, setVideogames] = useState();

    useEffect(() => {
        fetch(videogamesApiUrl)
            .then((res) => res.json())
            .then((data) => setVideogames(data));
    }, []);

    console.log(videogames);

    return (
        <>
            <div className="container"></div>
        </>
    );
}
