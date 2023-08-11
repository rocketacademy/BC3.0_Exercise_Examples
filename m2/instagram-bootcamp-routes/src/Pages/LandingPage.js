import logo from "../Images/logo.png";

export default function LandingPage() {
  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Navigate to different parts of the application using the navgiation bar
        above!
      </p>
      <p>If you want access to all of our features don't forget to login!</p>
    </div>
  );
}
