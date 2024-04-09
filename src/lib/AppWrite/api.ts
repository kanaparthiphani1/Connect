import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );

    if (!newAccount) throw Error;

    const avatarURL = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarURL,
    });

    return newUser;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    if (newUser) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followedCollectionId,
        ID.unique(),
        {
          user: newUser.$id,
          followed: [],
        }
      );

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followCollectionId,
        ID.unique(),
        {
          user: newUser.$id,
          followedList: [],
        }
      );
    }

    return newUser;
  } catch (err) {
    console.log(err);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (err) {
    console.log(err);
  }
}

export async function signOutAccount() {
  try {
    const deletedSession = await account.deleteSession("current");
    console.log("Delete session : ", deletedSession);

    return deletedSession;
  } catch (err) {
    console.log(err);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
}

export async function getUserById(userId: string) {
  try {
    console.log("UserId: " + userId);

    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    if (!user) throw Error;
    return user;
  } catch (err) {
    console.log(err);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) {
      throw Error;
    }

    return updatedPost;
  } catch (err) {
    console.log(err);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const saves = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!saves) {
      throw Error;
    }

    return saves;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) {
      throw Error;
    }

    return { status: "OK" };
  } catch (err) {
    console.log(err);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) {
      throw Error;
    }

    return post;
  } catch (err) {
    console.log(err);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileUpdated = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileUpdated) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      if (hasFileUpdated) {
        await deleteFile(image.imageId);
      }

      throw Error;
    }

    if (hasFileUpdated) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(5)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getFollowedList(userId: string) {
  try {
    console.log("Inside query", userId);

    const followed = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followedCollectionId,
      [Query.equal("user", userId)]
    );

    if (!followed) throw Error;

    return followed;
  } catch (error) {
    console.log(error);
  }
}

export async function getFollowersList(userId: string) {
  try {
    console.log("Inside query", userId);

    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("user", userId)]
    );

    if (!followers) throw Error;

    return followers;
  } catch (error) {
    console.log(error);
  }
}

export async function updateFollowedList(docId: string, followedList: any[]) {
  try {
    console.log("List in API : ", followedList);

    const statusCode = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followedCollectionId,
      docId,
      {
        followed: followedList,
      }
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function updateFollowersList(docId: string, followersList: any[]) {
  try {
    console.log("List in API : ", followersList);

    const statusCode = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      docId,
      {
        followedList: followersList,
      }
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getSavedPosts(userId: string) {
  try {
    const saved = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", userId)]
    );

    if (!saved) throw Error;

    return saved;
  } catch (error) {
    console.log(error);
  }
}

export async function getComments({
  pageParam = 0,
  postId,
}: {
  pageParam: number;
  postId: string;
}) {
  const queries = [
    Query.equal("post", postId),
    Query.orderAsc("$updatedAt"),
    Query.limit(2),
  ];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      queries
    );

    console.log("Comments in API : ", comments);

    if (!comments) throw Error;

    return comments;
  } catch (error) {
    console.log(error);
  }
}

export async function addComment(
  comment: string,
  postId: string,
  userId: string
) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        comment: comment,
        post: postId,
        users: userId,
      }
    );

    if (!newComment) throw Error;

    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function addReply(
  reply: string,
  commentId: string,
  userId: string
) {
  console.log("Came here");

  try {
    const newReply = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      ID.unique(),
      {
        reply: reply,
        comment: commentId,
        user: userId,
      }
    );

    if (!newReply) throw Error;

    return newReply;
  } catch (error) {
    console.log(error);
  }
}

export async function postActivty(userId: string, activity: string) {
  try {
    const newActivity = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activityCollectionId,
      ID.unique(),
      {
        user: userId,
        activityMessage: activity,
      }
    );

    if (!newActivity) throw Error;

    return newActivity;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentActivity() {
  try {
    const recentActivity = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.activityCollectionId,
      [Query.orderDesc("$updatedAt"), Query.limit(5)]
    );

    if (!recentActivity) throw Error;

    return recentActivity;
  } catch (error) {
    console.log(error);
  }
}
