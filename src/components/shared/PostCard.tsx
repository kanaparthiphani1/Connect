import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  console.log("Post : ", post);
  const { user } = useUserContext();
  return (
    <div className="post-card">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between item-center">
          <div className="flex flex-start flex-1">
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="image"
              className="w-10 lg:h-10 rounded-full"
            />
            <div className="flex flex-col mx-3">
              <p className="base-medium lg:body-bold text-light-1">
                {post.creator.name}
              </p>
              <div className="flex-center gap-2 text-light-3">
                <p className="subtle-semibold lg:small-regular ">
                  {multiFormatDateString(post.$createdAt)}
                </p>
                •
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <Link
              to={`/update-post/${post.$id}`}
              className={`${user.id !== post.creator.$id && "hidden"}`}
            >
              <img
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
        <Link to={`/posts/${post.$id}`}>
          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag: string, index: string) => (
                <li
                  key={`${tag}${index}`}
                  className="text-light-3 small-regular"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="post-card_img"
          />
        </Link>

        <PostStats post={post} userId={user.id} />
      </div>
    </div>
  );
};

export default PostCard;
