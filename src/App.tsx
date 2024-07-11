import * as React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { User, Users, UsersHistory } from "./compunents/users";
import { UserAPI } from "./userTypes";
import { Link } from "react-router-dom";

export function App({ history }: { history?: boolean }) {
  const [user, setUser] = React.useState<UserAPI | null>(null);

  return (
    <>
      <Link to="/" className="btn">
        Home
      </Link>
      {user !== null ? (
        <User setUser={setUser} user={user} />
      ) : history ? (
        <UsersHistory setUser={setUser} />
      ) : (
        <Users setUser={setUser} />
      )}
      <ReactQueryDevtools initialIsOpen />
    </>
  );
}
