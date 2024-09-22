import Navigo from "navigo";
import { render as loginPage } from "./pages/login/index.js";
import { render as homePage } from "./pages/index.js";
import { render as registerPage } from "./pages/register/index.js";
import { render as createPostPage } from "./pages/post/createPost.js";
import { render as updatePostPage } from "./pages/post/updatePost.js";

const app = document.querySelector("#app");
export const router = new Navigo("/");

router.on({
    "/": function () {
        if (!localStorage.getItem("access_token")) {
            loginPage();
            return;
        }
        homePage();
    },
    "/login": function () {
        if (localStorage.getItem("access_token")) {
            router.navigate("/");
            return;
        }
        loginPage();
    },
    "/register": function () {
        if (localStorage.getItem("access_token")) {
            router.navigate("/");
            return;
        }
        registerPage();
    },
    "/post/0": function () {
        if (!localStorage.getItem("access_token")) {
            loginPage();
            return;
        }
        createPostPage();
    },
    "/post/:id": function (data) {
        if (!localStorage.getItem("access_token")) {
            loginPage();
            return;
        }
        updatePostPage(data.data.id);
    },
});

router.resolve();
