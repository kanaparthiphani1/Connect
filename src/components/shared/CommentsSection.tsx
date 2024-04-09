import React, { useState } from "react";
import Comment from "./Comment";
import { Input } from "../ui/input";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import {
  useAddActivty,
  useAddComment,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

const CommentsSection = ({
  postId,
  comments,
  hasNextPage,
  children,
  isFetchingNextPage,
}: {
  postId: string;
  comments: any[];
  hasNextPage: boolean;
  children: React.ReactNode;
  isFetchingNextPage: boolean;
}) => {
  const { user } = useUserContext();
  const [userComment, setUserComment] = useState("");
  const { mutate: addComment } = useAddComment(postId);
  const { mutateAsync: addActivity } = useAddActivty();

  console.log("Commentys in CommentsSection  : ", comments);

  const submitComment = () => {
    addComment({ postId: postId, comment: userComment, userId: user.id });
    addActivity({ activityMessage: "COMMENTED", userId: user.id });
    setUserComment("");
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      {comments?.map((eachDoc) => {
        return eachDoc.documents?.map((comment) => {
          console.log("Coomennt Detail : ", comment);

          return (
            <Comment
              commentProp={{
                commentString: comment.comment,
                id: comment.$id,
                users: comment.users,
                replies: comment.replies,
                createdAt: comment.$createdAt,
                replyFlag: false,
                postId: postId,
              }}
            />
          );
        });
      })}
      {isFetchingNextPage && <Loader />}
      {hasNextPage && children}
      <div className="mt-5 flex flex-1 gap-2 items-center">
        <img src={user.imageUrl} className="rounded-full w-10" />
        <div className="w-full flex shad-input rounded-3xl items-center pr-2">
          <Input
            value={userComment}
            onChange={(e) => {
              setUserComment(e.target.value);
            }}
            className="shad-input rounded-full"
          />
          <Button
            onClick={submitComment}
            className="shad-button_primary rounded-full "
          >
            <img className="w-5" src="/assets/images/submit.png" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
