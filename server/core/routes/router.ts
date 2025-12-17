import { Router } from "express";
import { firecrawl_extractions, get_firecrawl_job } from "../../endpoints/articles/firecrawl_extractions.js";
import { newsApi } from "../../endpoints/articles/newsApi.js";
import { saveResearch } from "../../endpoints/supabase/users/transactions/saveResearch.js";
import { handleArticleSave } from "../../endpoints/supabase/users/transactions/handleArticleSave.js";
import { supabaseLogin } from "../../endpoints/supabase/users/account/login.js";
import { getUserArticles } from "../../endpoints/supabase/users/transactions/getUserArticles.js";
import { getUserResearch } from "../../endpoints/supabase/users/transactions/getUserResearch.js";
import { createNewUser } from "../../endpoints/supabase/users/account/createNewUser.js";
import { signUserOut } from "../../endpoints/supabase/users/account/signout.js";
import { resetUserPassword } from "../../endpoints/supabase/users/account/resetPassword.js";
import { getCurrentUser } from "../../endpoints/supabase/recovery/getCurrentUser.js";
import { deleteUser } from "../../endpoints/supabase/users/account/deleteUser.js";
import { sendFeedback } from "../../endpoints/supabase/feedback/sendFeedback.js";
import { searchBlueSkyPosts, getBlueSkyFeed } from "../../endpoints/bluesky/blueskyApi.js";

const router = Router();

router.get("/newsArticles", newsApi);
router.post("/firecrawl_extractions", firecrawl_extractions);
router.get("/firecrawl_extractions/:jobId", get_firecrawl_job);

router.get("/searchBlueSky", searchBlueSkyPosts);
router.get("/getBlueSkyFeed", getBlueSkyFeed);

router.post("/supabaseLogIn", supabaseLogin);
router.post("/createNewUser", createNewUser);
router.post("/deleteUser", deleteUser);
router.post("/signUserOut", signUserOut);
router.post("/resetUserPassword", resetUserPassword);

router.get("/getUserArticles", getUserArticles);
router.post("/getUserResearch", getUserResearch);
router.post("/articleOperation", handleArticleSave);
router.post("/saveResearch", saveResearch);
router.post("/getCurrentUser", getCurrentUser);

router.post("/sendFeedback", sendFeedback);

export { router };
