import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import {
  useGetCurrentUser,
  useGetFollowed,
  useGetPeople,
} from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: users, isLoading } = useGetPeople();

  console.log("USER : ", currentUser);

  const { data: followed } = useGetFollowed(currentUser?.$id || "");
  // const { data: followers } = useGetFollowed(currentUser?.$id || "");

  return (
    <div className="flex flex-col flex-1 w-full px-10 py-10 overflow-scroll custom-scrollbar">
      <div className="flex flex-start mt-5 items-center">
        <img
          src="/assets/icons/people.svg"
          alt="user"
          className="w-10 h-10 lg:w-16 lg:h-16"
        />
        <p className="ml-4 h3-bold lg:h1-bold ">All Users</p>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="py-8 mt-2 md:gap-9 w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl;">
          {users?.documents?.map((user) => {
            if (user.$id === currentUser?.$id) return null;
            let followedFlag = false;
            if (followed && followed?.documents[0]?.followed) {
              followed?.documents[0]?.followed?.forEach((id) => {
                if (id === user.$id) {
                  followedFlag = true;
                }
              });
            }

            return (
              <UserCard
                user={user}
                followedFlag={followedFlag}
                followedList={followed}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
