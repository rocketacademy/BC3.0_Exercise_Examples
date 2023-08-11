import { Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import LandingPage from "./Pages/LandingPage";
import Registration from "./Pages/LoginSignup";
import Chat from "./Pages/Chat";
import PostsPage from "./Pages/PostsPage";
import Post from "./Pages/SinglePostPage";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { ref as databaseRef } from "firebase/database";

function App() {
  // Save the Firebase message folder name as a constant to avoid bugs due to misspelling
  const DB_MESSAGES_KEY = "messages";
  const STORAGE_IMAGE_KEY = "images";
  const DB_CHAT_KEY = "chat";

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
        <Navigation
          isLoggedIn={isLoggedIn}
          auth={auth}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/registration"
            element={
              <Registration
                auth={auth}
                user={user}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                database={database}
                DB_CHAT_KEY={DB_CHAT_KEY}
                user={user}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/posts"
            element={
              <PostsPage
                database={database}
                user={user}
                isLoggedIn={isLoggedIn}
                DB_MESSAGES_KEY={DB_MESSAGES_KEY}
                STORAGE_IMAGE_KEY={STORAGE_IMAGE_KEY}
                setSinglePost={setSinglePost}
              />
            }
          />
          <Route
            path="/posts/:id"
            element={
              <Post
                database={database}
                user={user}
                isLoggedIn={isLoggedIn}
                DB_MESSAGES_KEY={DB_MESSAGES_KEY}
                STORAGE_IMAGE_KEY={STORAGE_IMAGE_KEY}
                message={singlePost}
                databaseRef={databaseRef}
              />
            }
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
