import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPostsQuery } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
    hasNextPage: hasNextPagePosts,
    fetchNextPage,
  } = useGetRecentPostsQuery();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.pages.map((item, index) => {
                return item?.documents.map((post: Models.Document) => (
                  <li key={post.$id} className="flex justify-center w-full">
                    <PostCard post={post} />
                    {/* {post.caption} */}
                  </li>
                ));
              })}
            </ul>
          )}
        </div>
        {hasNextPagePosts && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
