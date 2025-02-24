import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  function handleLogout() {
    googleLogout();
    localStorage.removeItem("user");
    console.log("Logout.");
    navigate("/");
  }

  return (
    <>
      <div>Entry page</div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Home;
