import { Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import LandingPage from "./Pages/LandingPage";
import Registration from "./Pages/LoginSignup";
import Chat from "./Pages/Chat";
import PostsPage from "./Pages/PostsPage";
import Post from "./Pages/SinglePostPage";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext } from "react";
import { auth, database } from "./firebase";
import {
  ref as databaseRef,
  onChildAdded,
  onChildChanged,
} from "firebase/database";

export const FirebaseContext = createContext(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [singlePost, setSinglePost] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <FirebaseContext.Provider
          value={{
            DB_MESSAGES_KEY: "messages",
            STORAGE_IMAGE_KEY: "images",
            DB_CHAT_KEY: "chat",
            auth: auth,
            database: database,
            databaseRef: databaseRef,
            onChildAdded: onChildAdded,
            onChildChanged: onChildChanged,
          }}
        >
          <Navigation
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
          />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/registration"
              element={
                <Registration
                  user={user}
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn={isLoggedIn}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/chat"
              element={<Chat user={user} isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/posts"
              element={
                <PostsPage
                  user={user}
                  isLoggedIn={isLoggedIn}
                  setSinglePost={setSinglePost}
                />
              }
            />
            <Route
              path="/posts/:id"
              element={
                <Post
                  user={user}
                  isLoggedIn={isLoggedIn}
                  message={singlePost}
                />
              }
            />
          </Routes>
        </FirebaseContext.Provider>
      </header>
    </div>
  );
}

export default App;
