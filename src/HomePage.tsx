import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <h1>HomePage</h1>
      <Link to="/fetch">
        <button>fetch</button>
      </Link>
      <Link to="/history">
        <button>history</button>
      </Link>
    </>
  );
}
