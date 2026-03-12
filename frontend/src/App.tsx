import { useEffect, useState } from "react";
import "./App.css";

type Game = {
  _id?: string;
  name: string;
  price: number;
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const API = "http://127.0.0.1:8001";

  const fetchGames = async () => {
    const res = await fetch(`${API}/games`);
    const data = await res.json();
    setGames(data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async () => {
    if (!name || !price) return;

    await fetch(`${API}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price: Number(price),
      }),
    });

    setName("");
    setPrice("");
    fetchGames();
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🎮 Game Stop Store</h1>

      <div style={{ marginBottom: "30px" }}>
        <h2>Add Game</h2>

        <input
          placeholder="Game name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />

        <button onClick={addGame} style={{ padding: "8px 15px" }}>
          Add Game
        </button>
      </div>

      <h2>Available Games</h2>

      {games.length === 0 && <p>No games found</p>}

      <ul>
        {games.map((game) => (
          <li key={game._id}>
            {game.name} — ₹{game.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;