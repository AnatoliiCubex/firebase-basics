import { useEffect, useState } from "react";
import "./App.css";
import { AuthForm } from "./components/AuthForm";
import { collection, getDocs } from "firebase/firestore";
import { database } from "./config/firebase";

function App() {
  const [movies, setMovies] = useState([]);
  const moviesCollection = collection(database, "movies");

  useEffect(() => {
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

    getMovies();
  }, []);

  return (
    <div className='App'>
      <AuthForm />

      <div style={{ marginTop: "10rem" }}>
        {movies.map((m) => (
          <div key={m.id}>
            <h1 style={{ color: m.receivedAnOscar ? "green" : "red" }}>
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
