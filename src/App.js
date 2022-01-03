import { useState, useEffect } from "react";
import PokemonList from "./components/PokemonList";
import Pagination from "./components/Pagination";
import axios from "axios";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  //res.data : give entire json object
  useEffect(() => {
    setLoading(true);
    let cancel;
    axios
      .get(currentPageUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)), //cancel will be a function
      })
      .then((res) => {
        setPokemon(res.data.results.map((p) => p.name));
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setLoading(false);
      });
    return () => {
      //CleanUp code
      // Get called evreything and lets you clean everything after the last call of useEffect.
      // In this case it cancle all the previous request evrytime we make a new request
      // Through axios we can use the cancelToken to cancel the prev request.
      cancel();
    };
  }, [currentPageUrl]);
  // What happens when useEffect gets called multiple times?
  // It leads to race condition and things can override each other in order to solve this
  // We use the cleanup section of useEffect where we will cancle evry old request before making new request.

  const goToNextPage = () => {
    setCurrentPageUrl(nextPageUrl);
  };

  const goToPrevPage = () => {
    setCurrentPageUrl(prevPageUrl);
  };

  if (loading) return "loading";

  return (
    <div className="App">
      <PokemonList pokemon={pokemon} />
      <Pagination
        goToNextPage={nextPageUrl ? goToNextPage : null}
        goToPrevPage={prevPageUrl ? goToPrevPage : null}
      />
    </div>
  );
}

export default App;
