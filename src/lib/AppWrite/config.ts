import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  followCollectionId: import.meta.env.VITE_APPWRITE_FOLLOW_COLLECTION_ID,
  followedCollectionId: import.meta.env.VITE_APPWRITE_FOLLOWED_COLLECTION_ID,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  repliesCollectionId: import.meta.env.VITE_APPWRITE_REPLIES_COLLECTION_ID,
  activityCollectionId: import.meta.env.VITE_APPWRITE_ACTIVITY_COLLECTION_ID,
};

export const client = new Client();
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
