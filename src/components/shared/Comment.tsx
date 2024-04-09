import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import {
  useAddActivty,
  useAddReply,
} from "@/lib/react-query/queriesAndMutations";

type CommentProps = {
  commentString: string;
  id: string;
  users: Models.Document;
  replies: any[];
  createdAt: string;
  replyFlag: boolean;
  postId: string;
};

const Comment = ({ commentProp }: { commentProp: CommentProps }) => {
  const [addReply, setAddReply] = useState(false);
  const [userReply, setUserReply] = useState("");
  const [replyCount, setReplyCount] = useState(2);
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  console.log("After Chnage : ", addReply);
  const { user } = useUserContext();
  const { mutate: submitReply } = useAddReply(commentProp.postId);
  const { mutateAsync: addActivity } = useAddActivty();

  const handleReply = () => {
    submitReply({
      commentId: commentProp.id,
      reply: userReply,
      userId: user.id,
    });
    addActivity({ activityMessage: "REPLIED", userId: user.id });
    setAddReply(false);
    setUserReply("");
  };

  const cancelHandler = () => {
    setAddReply(false);
    setUserReply("");
  };

  const loadMoreHandler = () => {
    setExpanded(true);
    setReplyCount((prevCount) => prevCount + 2);
  };

  const collapseHandler = () => {
    setExpanded(false);
    setCollapsed(true);
    setReplyCount(2);
  };

  return (
    <div className="w-full flex flex-1 flex-col">
      <div className="flex flex-1 gap-2 items-start">
        <img
          src={commentProp.users.imageUrl}
          className={`rounded-full ${commentProp.replyFlag ? "w-8" : "w-10"}`}
        />
        <div className="flex flex-col ">
          <h3
            className={`${
              commentProp.replyFlag ? "small-regular" : "base-medium"
            } text-light-3 `}
          >
            {commentProp.users.name}
          </h3>
          <div className="flex items-center">
            <p
              className={`${
                commentProp.replyFlag ? "text-[8px]" : "text-[10px]"
              } font-normal text-light-3`}
            >
              {multiFormatDateString(commentProp.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-1">
          <p
            className={`${
              commentProp.replyFlag ? "text-[14px]" : "text-[16px]"
            } font-normal text-light-2`}
          >
            {commentProp.commentString}
          </p>
        </div>

        {!commentProp.replyFlag && (
          <div className="flex flex-col justify-start items-center h-full">
            <button
              onClick={() => {
                console.log("Clicked");

                setAddReply(true);
              }}
              className="border-0 px-2 text-[12px]"
            >
              reply
            </button>
          </div>
        )}
      </div>
      <div className="pl-4 mt-3">
        {commentProp.replies?.map((reply, index) => {
          return index < replyCount ? (
            <Comment
              commentProp={{
                id: reply.$id,
                commentString: reply.reply,
                users: reply.user,
                createdAt: reply.$createdAt,
                replies: null,
                replyFlag: true,
                postId: commentProp.postId,
              }}
            />
          ) : null;
        })}

        {addReply && (
          <div className="mt-2 flex flex-1 gap-2 items-center">
            <img src={user.imageUrl} className="rounded-full w-8" />
            <div className="w-full flex shad-input-small rounded-3xl items-center pr-2">
              <Input
                value={userReply}
                onChange={(e) => {
                  setUserReply(e.target.value);
                }}
                className="shad-input-small h-8 rounded-full"
              />
              <div className="flex justify-between items-center gap-1">
                <Button
                  disabled={!userReply}
                  onClick={handleReply}
                  className="shad-button_primary h-7 w-10 p-1 rounded-full "
                >
                  <img className="w-3" src="/assets/images/submit.png" />
                </Button>
                <Button
                  onClick={cancelHandler}
                  className="shad-button_danger h-7 w-10 p-1 rounded-full "
                >
                  X
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-4">
          {commentProp?.replies?.length > replyCount ? (
            <div
              onClick={loadMoreHandler}
              className="hover:translate-y-[1.8px] transition-all ease-in-out cursor-pointer delay-75"
            >
              <p className="text-[11px] flex justify-start items-center gap-2 font-normal text-light-3">
                <img src="/assets/images/show-more.png" className="w-5 " />
                Load More
              </p>
            </div>
          ) : null}

          {expanded ? (
            <div
              onClick={collapseHandler}
              className="hover:translate-y-[-1.8px] transition-all ease-in-out cursor-pointer delay-75"
            >
              <p className="text-[11px] flex justify-start items-center gap-2 font-normal text-light-3">
                <img src="/assets/images/collapse.png" className="w-5 " />
                Collapse
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Comment;
