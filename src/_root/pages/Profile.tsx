import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import {
  useGetFollowed,
  useGetFollowers,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useGetUserById(id);
  const { data: followedList } = useGetFollowed(id);
  const { data: followersList } = useGetFollowers(id);
  console.log("FollowedList : ", followedList);
  console.log("followersList : ", followersList);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="profile-container">
      <div className="profile-inner_container py-5">
        <img
          src={user.imageUrl}
          className="w-36 lg:w-48 rounded-full"
          alt="profile"
        />
        <div className="flex flex-col flex-1">
          <div className="flex flex-col items-center lg:items-start gap-3">
            <h2 className="lg:text-[50px] text-[32px]">{user.name}</h2>
            <p className="text-light-4 lg:text-[20px] text-[15px]">
              @{user.username}
            </p>
          </div>
          <div className="flex h-20 lg:w-[50%] w-[100%] mt-5 gap-3 p-2">
            <div className="flex flex-col flex-1 items-start w-[33%]">
              <h2 className="text-primary-500 lg:text-[20px] text-[15px]">
                {user.posts.length}
              </h2>
              <h2 className="text-slate-200 lg:text-[22px] text-[16px]">
                Posts
              </h2>
            </div>
            <div className="flex flex-col flex-1 items-start w-[33%]">
              <h2 className="text-primary-500 lg:text-[20px] text-[15px]">
                {followersList.documents[0].followedList.length}
              </h2>
              <h2 className="text-slate-200 lg:text-[22px] text-[16px]">
                Followers
              </h2>
            </div>
            <div className="flex flex-col flex-1 items-start w-[33%]">
              <h2 className="text-primary-500 lg:text-[20px] text-[15px]">
                {followedList.documents[0].followed.length}
              </h2>
              <h2 className="text-slate-200 lg:text-[22px] text-[16px]">
                Following
              </h2>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div className="w-full h-full ">
        <hr className="border w-full border-dark-4/80" />
        <div className="py-7">
          <GridPostList posts={user.posts} showUser={false} showStats={true} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
