import { useGlobalContext } from "../contexts/GlobalContext";

export default function VideogamesPage() {
    const { videogames } = useGlobalContext();
    console.log(videogames);

    return (
        <>
            <div className="container my-5"></div>
        </>
    );
}
