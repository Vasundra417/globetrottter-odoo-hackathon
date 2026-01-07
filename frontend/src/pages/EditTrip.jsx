import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setTrip(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/trips/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(trip)
    });

    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h1>Edit Trip</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={trip.name}
          onChange={(e) => setTrip({ ...trip, name: e.target.value })}
          placeholder="Trip name"
          required
        />

        <textarea
          value={trip.description}
          onChange={(e) => setTrip({ ...trip, description: e.target.value })}
          placeholder="Description"
        />

        <input
          type="date"
          value={trip.start_date}
          onChange={(e) => setTrip({ ...trip, start_date: e.target.value })}
          required
        />

        <input
          type="date"
          value={trip.end_date}
          onChange={(e) => setTrip({ ...trip, end_date: e.target.value })}
          required
        />

        <input
          type="number"
          value={trip.budget}
          onChange={(e) => setTrip({ ...trip, budget: e.target.value })}
          placeholder="Budget"
        />

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate("/dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
