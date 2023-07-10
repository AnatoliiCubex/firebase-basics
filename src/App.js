import { useEffect, useState } from "react";
import { auth, database, storage } from "./config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { AuthForm } from "./components/AuthForm";

import "./App.css";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    releaseDate: 0,
    receivedAnOscar: false,
  });
  const [existingMovieNewTitle, setExistingMovieNewTitle] = useState("");
  const [isMoviesChanged, setIsMoviesChanged] = useState(false);
  const [file, setFile] = useState(null);
  const moviesCollection = collection(database, "movies");

  const onSubmitMovie = async (e) => {
    e.preventDefault();
    try {
      const movieObj = {
        ...newMovie,
        userId: auth?.currentUser?.uid,
      };

      await addDoc(moviesCollection, movieObj);
      setIsMoviesChanged(true);
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

  const deleteMovie = async (id) => {
    const movieDoc = doc(database, "movies", id);
    try {
      await deleteDoc(movieDoc);
      setIsMoviesChanged(true);
    } catch (err) {
      console.error(err);
    }
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(database, "movies", id);
    try {
      await updateDoc(movieDoc, { title: existingMovieNewTitle });
      setExistingMovieNewTitle("");
      setIsMoviesChanged(true);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    try {
      const filesFolderRef = ref(storage, `projectFiles/${file.name}`);
      await uploadBytes(filesFolderRef, file);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isMoviesChanged) return;
    getMovies();
    setIsMoviesChanged(false);
  }, [isMoviesChanged]);

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
          value={newMovie.releaseDate || ""}
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
            <h2>Posted by #{m.userId}</h2>
            <p>Date: {m.releaseDate}</p>
            <input
              placeholder='New title'
              value={existingMovieNewTitle}
              onChange={(e) => setExistingMovieNewTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(m.id)}>Submit</button>
            <button onClick={() => deleteMovie(m.id)}>Delete movie</button>
          </div>
        ))}
      </div>

      <div>
        <input type='file' onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <button onClick={uploadFile}>upload file</button>
      </div>
    </div>
  );
}

export default App;
