import { Link } from "react-router-dom";
import App from "./App";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>♻ Waste Management</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/add">Add Waste</Link>
        <Link to="/list">Waste List</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}
export default App;