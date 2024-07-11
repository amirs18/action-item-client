import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAPI, UserResults } from "../userTypes";

const BACKEND_URL = "http://localhost:4000";

function useUsersAPi() {
  return useQuery({
    queryKey: ["usersAPI"],
    queryFn: async (): Promise<UserResults> => {
      const response = await fetch("https://randomuser.me/api/?results=10");
      return await response.json();
    },
  });
}
function useUsersBE() {
  return useQuery({
    queryKey: ["usersBE"],
    queryFn: async (): Promise<UserResults> => {
      const response = await fetch(`${BACKEND_URL}/user`);
      return await response.json();
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
      <h1>Posts</h1>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.results?.map((user) => (
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
              {data.results?.map((user) => (
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
  const response = await fetch(`${BACKEND_URL}/user/${email}`);
  return await response.json();
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
  const { status } = useUser(user);
  console.log("🚀 ~ status:", status, user);

  return (
    <div>
      <div>
        <a onClick={() => setUser(null)} href="#">
          Back
        </a>
      </div>
      {user && (
        <>
          <h1>{user.name.title}</h1>
          <div>
            <p>{user.gender}</p>
          </div>
          <button
            onClick={() => {
              fetch(`${BACKEND_URL}/user`, { body: JSON.stringify(user) });
            }}
          >
            save
          </button>
        </>
      )}
    </div>
  );
}
