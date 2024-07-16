import data from "./data.json";

function Card() {
  const dt = data[0];
  return (
    <div className="card">
      <img src={dt.image.desktop} alt={dt.name} />
    </div>
  );
}

function Cards() {
  return (
    <div>
      <Card />
    </div>
  );
}

export default function App() {
  return (
    <div>
      <h1>Desserts</h1>
      <Cards />
    </div>
  );
}
