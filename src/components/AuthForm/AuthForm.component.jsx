import React, { useState } from "react";

import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const AuthFormComponent = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      setUserData({ email: "", password: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleCreateUser}>
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
  );
};

AuthFormComponent.displayName = "AuthForm";
