import { Models } from "appwrite";
import { Button } from "../ui/button";
import {
  useGetCurrentUser,
  useGetFollowers,
  useUpdateFollowed,
  useUpdateFollowers,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

const UserCard = ({
  user,
  followedFlag,
  followedList,
}: {
  user: Models.Document;
  followedFlag: boolean;
  followedList: any;
}) => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: followersList } = useGetFollowers(user.$id);
  const { mutate: updateFollowed, isLoading: isUdpateFollowedPending } =
    useUpdateFollowed(currentUser?.$id || "");

  const { mutate: updateFollowrs } = useUpdateFollowers(user.$id);

  console.log("Followd List", followedList);

  const followHandler = () => {
    if (followedList?.documents[0]?.followed) {
      console.log("New Followed user  : ", user.$id);

      const newFollowedList = [...followedList.documents[0].followed, user.$id];
      console.log("New FOllowd list : ", newFollowedList);

      updateFollowed({
        docId: followedList.documents[0].$id || "",
        newUpdatedFollowed: newFollowedList,
      });

      if (followersList?.documents[0]?.followedList) {
        const newFollowersList = [
          ...followersList.documents[0].followedList,
          currentUser.$id,
        ];
        console.log("New FOllowers list : ", newFollowersList);

        updateFollowrs({
          docId: followersList.documents[0].$id || "",
          newUpdatedFollowers: newFollowersList,
        });
      }
    }
  };

  const unfollowHandler = () => {
    if (followedList) {
      console.log("New Followed user  : ", user.$id);

      const newFollowedList = followedList.documents[0].followed.filter(
        (x) => x != user.$id
      );
      console.log("New FOllowd list : ", newFollowedList);

      updateFollowed({
        docId: followedList.documents[0].$id || "",
        newUpdatedFollowed: newFollowedList,
      });
      if (followersList?.documents[0]?.followedList) {
        const newFollowersList = followersList.documents[0].followedList.filter(
          (x) => x != currentUser.$id
        );
        console.log("New FOllowers list : ", newFollowersList);

        updateFollowrs({
          docId: followersList.documents[0].$id || "",
          newUpdatedFollowers: newFollowersList,
        });
      }
    }
  };

  return (
    <div className="w-100/3 h-80 bg-black rounded-3xl shadow-lg border-off-white border-2 border-opacity-5">
      <div className="flex h-full flex-col items-center">
        <img
          src={user.imageUrl}
          className="rounded-full w-28 h-28 mt-7"
          alt="profile"
        />
        <div className="mt-5 flex flex-col items-center">
          <h2 className="h3-bold sm:h3-bold">{user.name}</h2>
          <p className="text-light-4 ">@{user.username}</p>
        </div>

        {followedFlag ? (
          <Button
            variant="ghost"
            className="shad-button_slate_4 mt-5"
            onClick={unfollowHandler}
          >
            {isUdpateFollowedPending && <Loader />} Following
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="shad-button_primary mt-5"
            onClick={followHandler}
          >
            {isUdpateFollowedPending && <Loader />} Follow
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
