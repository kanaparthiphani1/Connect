import { INewUser } from "@/types";
import {
  //   useQuery,
  useMutation,
  //   useQueryClient,
  //   useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createUserAccount,
  signInAccount,
  signOutAccount,
} from "../AppWrite/api";

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
