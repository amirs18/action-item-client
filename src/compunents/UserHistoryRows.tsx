import { useState } from "react";
import { UserAPI } from "../userTypes";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";

export default function UserHistoryRows({
  reactQueryUser,
  setUser,
}: {
  reactQueryUser: UseQueryResult<UserAPI[], Error>;
  setUser: React.Dispatch<React.SetStateAction<UserAPI | null>>;
}) {
  const [nameFilter, setNameFilter] = useState("all");
  const [countryFilter, setcountryFilter] = useState("all");
  const queryClient = useQueryClient();

  const { status, data, error, isFetching } = reactQueryUser;

  return (
    <div>
      <div className="flex flex-row">
        <h1>Users</h1>
        <select
          onChange={(e) => {
            setNameFilter(e.target.value);
          }}
          className="select select-bordered w-full max-w-xs"
        >
          <option>{"all"}</option>

          {data?.map((user) => (
            <option>{user.name.first + " " + user.name.last}</option>
          ))}
        </select>
        <select
          onChange={(e) => {
            console.log("🚀 ~ e.target.value:", e.target.value);

            setcountryFilter(e.target.value);
          }}
          className="select select-bordered w-full max-w-xs"
        >
          <option>{"all"}</option>

          {data?.map((user) => (
            <option>{user.location.country}</option>
          ))}
        </select>
      </div>
      <div>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data
                ?.filter((user) => {
                  if (nameFilter !== "all") {
                    return (
                      user.name.first + " " + user.name.last === nameFilter
                    );
                  }
                  return true;
                })
                .filter((user) => {
                  if (countryFilter !== "all") {
                    return user.location.country === countryFilter;
                  }
                  return true;
                })
                .map((user) => (
                  <div className="flex flex-row" key={user.email}>
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src={user.picture.thumbnail} />
                      </div>
                    </div>
                    <button
                      className="ml-4"
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
                      onClick={() => setUser(user)}
                    >
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
