import { createNewUser } from "@/api/createNewUser";
import { executeSaveArticleRequest } from "@/api/executeSaveArticle";
import { executeSignIn } from "@/api/executeSignin";

const createUserRequest = createNewUser({
    endpoint: "/createNewUser",
    credentials: "include"
});

const createArticleRequest = executeSaveArticleRequest({
    endpoint: "/articleOperation",
    credentials: "include"
});

const createSigninRequest = executeSignIn({
    endpoint: '/supabaseLogIn',
    credentials: 'include'
})

export { createUserRequest, createArticleRequest, createSigninRequest };