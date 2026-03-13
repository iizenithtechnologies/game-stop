import { useEffect, useState } from "react";
import "./App.css";

type Game = {
  _id?: string;
  name: string;
  price: number;
};

const API =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://127.0.0.1:8001" : "/api");

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const fetchGames = async () => {
    setError("");

    try {
      const res = await fetch(`${API}/games`);

      if (!res.ok) {
        throw new Error("Unable to load games.");
      }

      const data = (await res.json()) as Game[];
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load games.");
    }
  };

  useEffect(() => {
    void fetchGames();
  }, []);

  const addGame = async () => {
    if (!name || !price) return;

    setError("");

    try {
      const res = await fetch(`${API}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: Number(price),
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to add the game.");
      }

      setName("");
      setPrice("");
      void fetchGames();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add the game.");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Game Stop Store</h1>

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

      {error && <p>{error}</p>}
      {games.length === 0 && !error && <p>No games found</p>}

      <ul>
        {games.map((game) => (
          <li key={game._id}>
            {game.name} - Rs. {game.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;