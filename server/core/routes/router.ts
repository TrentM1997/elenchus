import { Router } from "express";
import {
  firecrawl_extractions,
  get_firecrawl_job,
} from "../../endpoints/articles/firecrawl_extractions.js";
import { newsApi } from "../../endpoints/articles/newsApi.js";
import { saveResearch } from "../../endpoints/supabase/users/transactions/saveResearch.js";
import { handleArticleSave } from "../../endpoints/supabase/users/transactions/handleArticleSave.js";
import { supabaseLogin } from "../../endpoints/supabase/users/account/login.js";
import { getUserArticles } from "../../endpoints/supabase/users/transactions/getUserArticles.js";
import { getUserResearch } from "../../endpoints/supabase/users/transactions/getUserResearch.js";
import { createNewUser } from "../../endpoints/supabase/users/account/createNewUser.js";
import { signUserOut } from "../../endpoints/supabase/users/account/signout.js";
import { resetUserPassword } from "../../endpoints/supabase/users/account/resetPassword.js";
import { deleteUser } from "../../endpoints/supabase/users/account/deleteUser.js";
import { sendFeedback } from "../../endpoints/supabase/feedback/sendFeedback.js";
import {
  searchBlueSkyPosts,
  getBlueSkyFeed,
} from "../../endpoints/bluesky/blueskyApi.js";

const router = Router();

router.get("/newsArticles", newsApi); // done
router.post("/firecrawl_extractions", firecrawl_extractions); // done
router.get("/firecrawl_extractions/:jobId", get_firecrawl_job); // done
router.get("/searchBlueSky", searchBlueSkyPosts); // done
router.get("/getBlueSkyFeed", getBlueSkyFeed); // done
router.post("/supabaseLogIn", supabaseLogin); // done
router.post("/createNewUser", createNewUser); // done
router.post("/signUserOut", signUserOut); // done
router.get("/getUserArticles", getUserArticles); // done
router.post("/getUserResearch", getUserResearch); // done
router.post("/saveResearch", saveResearch); // done
router.post("/articleOperation", handleArticleSave); // done
router.post("/resetUserPassword", resetUserPassword); // done
router.post("/deleteUser", deleteUser); // done
router.post("/sendFeedback", sendFeedback); // done

export { router };
