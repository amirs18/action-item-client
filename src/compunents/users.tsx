import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAPI, UserResults } from "../userTypes";
import axios from "axios";

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
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useUsersAPi();

  return (
    <div>
      <h1>Users</h1>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.results?.map((user) => (
                <div className="flex flex-row" key={user.email}>
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={user.picture.thumbnail} />
                    </div>
                  </div>
                  <button className="ml-4" onClick={() => setUser(user)}>
                    {`${user.name.title}, ${user.name.first} ${user.name.last}`}
                  </button>
                  <p className="ml-4">{user.gender}</p>
                  <p className="ml-4">{user.location.country}</p>
                  <p className="ml-4">{user.phone}</p>
                  <p className="ml-4">{user.email}</p>
                </div>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}
export function UsersHistory({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<UserAPI | null>>;
}) {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useUsersBE();

  return (
    <div>
      <h1>Users</h1>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((user) => (
                <p key={user.email}>
                  <a
                    onClick={() => setUser(user)}
                    href="#"
                    style={
                      // We can access the query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(["user", user.email])
                        ? {
                            fontWeight: "bold",
                            color: "green",
                          }
                        : {}
                    }
                  >
                    {user.name.first}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
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

  return (
    <div>
      <div>
        <button className="btn" onClick={() => setUser(null)}>
          Back
        </button>
      </div>
      {user && (
        <>
          <h1>{user.name.title}</h1>
          <div>
            <p>{user.gender}</p>
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
        </>
      )}
    </div>
  );
}
