import * as React from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { User } from "./userTypes";

const BACKEND_URL = "http://localhost:4000";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function usePosts() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<Array<User>> => {
      const response = await fetch("https://randomuser.me/api/?results=10");
      return await response.json();
    },
  });
}

function Users({
  setUserEmail,
}: {
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = usePosts();

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
              {data.map((user) => (
                <p key={user.id.value}>
                  <a
                    onClick={() => setUserEmail(user.email)}
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
                    {user.name.title}
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

const getPostById = async (email: string): Promise<User> => {
  const response = await fetch(`${BACKEND_URL}/user/${email}`);
  return await response.json();
};

function useUser(userEmail: string) {
  return useQuery({
    queryKey: ["user", userEmail],
    queryFn: () => getPostById(userEmail),
    enabled: !!userEmail,
  });
}

function Post({
  setUSerEmail,
  userEmail,
}: {
  userEmail: string;
  setUSerEmail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { status, data, error, isFetching } = useUser(userEmail);

  return (
    <div>
      <div>
        <a onClick={() => setUSerEmail("")} href="#">
          Back
        </a>
      </div>
      {!userEmail || status === "pending" ? (
        "Loading..."
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1>{data.name.title}</h1>
          <div>
            <p>{data.gender}</p>
          </div>
          <div>{isFetching ? "Background Updating..." : " "}</div>
        </>
      )}
    </div>
  );
}

export function App() {
  const [userEmail, setUserEmail] = React.useState("");

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <p>
        As you visit the posts below, you will notice them in a loading state
        the first time you load them. However, after you return to this list and
        click on any posts you have already visited again, you will see them
        load instantly and background refresh right before your eyes!{" "}
        <strong>
          (You may need to throttle your network speed to simulate longer
          loading sequences)
        </strong>
      </p>
      {userEmail !== "" ? (
        <Post setUSerEmail={setUserEmail} userEmail={userEmail} />
      ) : (
        <Users setUserEmail={setUserEmail} />
      )}
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  );
}
