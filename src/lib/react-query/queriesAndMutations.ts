import { INewPost, INewUser, IUpdatePost } from "@/types";
import {
  useInfiniteQuery,
  //   useQuery,
  useMutation,
  useQuery,
  useQueryClient,
  //   useQueryClient,
  //   useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  signInAccount,
  signOutAccount,
  likePost,
  savePost,
  deleteSavedPost,
  getCurrentUser,
  getPostById,
  updatePost,
  deletePost,
  getInfinitePosts,
  searchPosts,
  getAllUsers,
  getFollowedList,
  updateFollowedList,
  getSavedPosts,
} from "../AppWrite/api";
import { QUERY_KEYS } from "./querykeys";

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => {
      return createUserAccount(user);
    },
  });
};

export const useSignInAccountMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => {
      return signInAccount(user);
    },
  });
};

export const useSignOutAccountMutation = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: signOutAccount,
    onSuccess,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPostsQuery = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetPostByIdQuery = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetPeople = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getAllUsers(),
  });
};

export const useGetFollowed = (userId: string) => {
  console.log("Inside query Mutation : ", userId);

  return useQuery({
    queryKey: ["followed", userId],
    queryFn: () => getFollowedList(userId),
    enabled: !!userId,
  });
};

export const useUpdateFollowed = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      docId,
      newUpdatedFollowed,
    }: {
      docId: string;
      newUpdatedFollowed: unknown[];
    }) => {
      console.log("List in useUpdated : ", newUpdatedFollowed);

      return updateFollowedList(docId, newUpdatedFollowed);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followed", userId],
      });
    },
  });
};

export const useGetSavedPosts = (userId: string) => {
  return useQuery({
    queryKey: ["saved", userId],
    queryFn: () => getSavedPosts(userId),
    enabled: !!userId,
  });
};
