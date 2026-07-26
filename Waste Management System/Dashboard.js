import App from "./App";

function Dashboard() {
  return (
    <div className="container">
      <h1>Waste Management Dashboard</h1>
      <div className="cards">
        <div className="card">
          <h2>120</h2>
          <p>Total Waste</p>
        </div>
        <div className="card">
          <h2>75</h2>
          <p>Recycled</p>
        </div>
        <div className="card">
          <h2>45</h2>
          <p>Pending</p>
        </div>
      </div>
    </div>
  );
}
export default App;