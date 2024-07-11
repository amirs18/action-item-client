import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <h1>HomePage</h1>
      <Link to="/fetch">
        <button className="btn">fetch</button>
      </Link>
      <Link to="/history">
        <button className="btn">history</button>
      </Link>
    </>
  );
}
