import { useQuery } from "@tanstack/react-query";
import { UserAPI, UserResults } from "../userTypes";
import axios from "axios";
import UserRows from "./UserRows";
import UserHistoryRows from "./UserHistoryRows";
import { useState } from "react";

const BACKEND_URL = "http://localhost:4000";

function useUsersAPi() {
  return useQuery({
    queryKey: ["usersAPI"],
    queryFn: async (): Promise<UserResults> => {
      const response = await axios.get("https://randomuser.me/api/?results=10");
      return response.data;
    },
  });
}
function useUsersBE() {
  return useQuery({
    queryKey: ["usersBE"],
    queryFn: async (): Promise<UserAPI[]> => {
      const response = await axios.get(`${BACKEND_URL}/user`);
      return response.data;
    },
  });
}

export function Users({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<UserAPI | null>>;
}) {
  const reactQueryUser = useUsersAPi();

  return <UserRows reactQueryUser={reactQueryUser} setUser={setUser} />;
}
export function UsersHistory({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<UserAPI | null>>;
}) {
  const reactQueryUser = useUsersBE();

  return <UserHistoryRows reactQueryUser={reactQueryUser} setUser={setUser} />;
}

const getPostById = async (email: string): Promise<UserAPI> => {
  const response = await axios.get(`${BACKEND_URL}/user/${email}`);
  return response.data();
};

function useUser(user: UserAPI) {
  return useQuery({
    queryKey: ["user", user.email],
    queryFn: () => getPostById(user.email),
    enabled: !!user,
    initialData: user,
  });
}

export function User({
  setUser,
  user,
}: {
  user: UserAPI;
  setUser: React.Dispatch<React.SetStateAction<UserAPI | null>>;
}) {
  useUser(user);
  const [nameInput, setNameInput] = useState<UserAPI["name"]>(user.name);

  return (
    <div>
      <div>
        <button className="btn" onClick={() => setUser(null)}>
          Back
        </button>
      </div>
      {user && (
        <>
          <div className="flex flex-col items-center align-middle">
            <img src={user.picture.large} alt="user picture" />
            <p>gender:{user.gender}</p>
            <div>
              Title:
              <input
                defaultValue={user.name.title}
                onChange={(e) => {
                  setNameInput({ ...nameInput, title: e.target.value });
                }}
              />
              First:
              <input
                defaultValue={user.name.first}
                onChange={(e) => {
                  setNameInput({ ...nameInput, first: e.target.value });
                }}
              />
              Last:
              <input
                defaultValue={user.name.last}
                onChange={(e) => {
                  setNameInput({ ...nameInput, last: e.target.value });
                }}
              />
            </div>
            <p>
              age: {user.dob.age} date of birth:
              {new Date(user.dob.date).toUTCString()}
            </p>
            <p>
              <h3>Address</h3>
              Street number {user.location.street.number}
              {"   "}
              Street Name: {user.location.street.name}
            </p>
            <p>
              <h3>Contact</h3>
              email {user.email}
              {"   "}
              Phone: {user.phone}
            </p>
          </div>
          <button
            className="btn"
            onClick={() => {
              axios.post(`${BACKEND_URL}/user`, {
                body: user,
              });
            }}
          >
            save
          </button>
          <button
            className="btn"
            onClick={() => {
              axios.delete(`${BACKEND_URL}/user/${user.email}`);
              setUser(null);
            }}
          >
            delete
          </button>
          <button
            className="btn"
            onClick={() => {
              axios.patch(`${BACKEND_URL}/user/${user.email}`, nameInput);
            }}
          >
            update
          </button>
        </>
      )}
    </div>
  );
}
