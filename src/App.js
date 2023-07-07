import { useEffect, useState } from "react";
import "./App.css";
import { AuthForm } from "./components/AuthForm";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { database } from "./config/firebase";

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    releaseDate: 0,
    receivedAnOscar: false,
  });
  const [newMovieWasAdded, setNewMovieWasAdded] = useState(false);
  const moviesCollection = collection(database, "movies");

  const onSubmitMovie = async (e) => {
    e.preventDefault();
    try {
      await addDoc(moviesCollection, newMovie);
      setNewMovieWasAdded(true);
      setNewMovie({
        title: "",
        releaseDate: 0,
        receivedAnOscar: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getMovies = async () => {
    try {
      const data = await getDocs(moviesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovies(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!newMovieWasAdded) return;
    getMovies();
    setNewMovieWasAdded(false);
  }, [newMovieWasAdded]);

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className='App'>
      <AuthForm />

      <form onSubmit={onSubmitMovie}>
        <input
          placeholder='Movie title'
          required
          value={newMovie.title}
          onChange={(e) =>
            setNewMovie((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
        <input
          placeholder='Release date'
          required
          type='number'
          min={1}
          value={newMovie.releaseDate}
          onChange={(e) =>
            setNewMovie((prev) => ({
              ...prev,
              releaseDate: Number(e.target.value),
            }))
          }
        />
        <label>
          <input
            type='checkbox'
            checked={newMovie.receivedAnOscar}
            onChange={(e) =>
              setNewMovie((prev) => ({
                ...prev,
                receivedAnOscar: !prev.receivedAnOscar,
              }))
            }
          />
          Received oscar
        </label>
        <button type='submit'>Add movie</button>
      </form>

      <div style={{ marginTop: "10rem" }}>
        {movies.map((m) => (
          <div key={m.id}>
            <h1
              style={{
                color: m.receivedAnOscar ? "green" : "red",
                textTransform: "capitalize",
              }}
            >
              {m.title}
            </h1>
            <p>Date: {m.releaseDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
