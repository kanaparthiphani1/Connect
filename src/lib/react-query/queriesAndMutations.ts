import { INewUser } from "@/types";
import {
  //   useQuery,
  useMutation,
  //   useQueryClient,
  //   useInfiniteQuery,
} from "@tanstack/react-query";
import { createUserAccount, signInAccount } from "../AppWrite/api";

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
