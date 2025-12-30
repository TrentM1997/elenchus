import { createNewUser } from "@/infra/api/createNewUser";
import { executeSaveArticleRequest } from "@/infra/api/executeSaveArticle";
import { executeSignIn } from "@/infra/api/executeSignin";

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
});



export { createUserRequest, createArticleRequest, createSigninRequest };