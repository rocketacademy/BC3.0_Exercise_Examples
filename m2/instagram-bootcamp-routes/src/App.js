import { Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation";
import LandingPage from "./Pages/LandingPage";
import Registration from "./Pages/LoginSignup";
import Chat from "./Pages/Chat";
import Posts from "./Pages/Posts";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "./firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

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
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/posts"
            element={<Posts user={user} isLoggedIn={isLoggedIn} />}
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
