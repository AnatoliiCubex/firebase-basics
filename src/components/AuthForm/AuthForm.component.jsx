import React, { useState } from "react";

import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const AuthFormComponent = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSignIn}>
        <input
          placeholder='Email...'
          name='email'
          value={userData.email}
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
        <input
          type='password'
          placeholder='Password...'
          name='password'
          value={userData.password}
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />
        <button type='submit'>Sign in</button>
      </form>
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

AuthFormComponent.displayName = "AuthForm";
