import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPosts } = useGetSavedPosts(user.id);
  console.log("Data Saved : ", savedPosts);

  return (
    <div className="flex flex-col flex-1 w-full px-10 py-10 overflow-scroll custom-scrollbar">
      <div className="flex flex-start mt-5 items-center">
        <img
          src="/assets/icons/saved.svg"
          alt="user"
          className="w-10 h-10 lg:w-16 lg:h-16"
        />
        <p className="ml-4 h3-bold lg:h1-bold ">Saved Posts</p>
      </div>

      <hr className="border my-5 w-full border-dark-4/80" />

      <ul className="grid-container">
        {savedPosts?.documents.map((data) => (
          <li key={data.post.$id} className="relative min-w-80 h-80">
            <Link to={`/posts/${data.post.$id}`} className="grid-post_link">
              <img
                src={data.post.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user">
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    data.post.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{data.post.creator.name}</p>
              </div>

              <PostStats post={data.post} userId={user.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Saved;
