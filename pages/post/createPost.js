import { postMethod } from "../../utils";
import { router } from "../../main.js";
import { header } from "../index.js";
import { onLogout } from "../index.js";
import { renewToken } from "../../utils";

const createPostContainer = `<div class="create-post-container">
<form>
    <h1>Create Post</h1>
        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" name="title" placeholder="Title..." required>
        </div>
        <div class="form-group">
            <label for="content">Content</label>
            <textarea rows="10" name="content" placeholder="Content..." required></textarea>
        </div>
        <div class="form-action">
            <button type="submit" class="create-post-btn">Create</button>
            <button class="back-btn">Back to home</button>
        </div>
    </form>
</div>`;

export const render = () => {
    const content = header + createPostContainer;
    const app = document.querySelector("#app");
    app.innerHTML = content;

    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", onLogout);

    document.querySelector(".back-btn").addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate("/");
    });

    const createPostBtn = document.querySelector(".create-post-btn");
    createPostBtn.addEventListener("click", (e) => onCreatePost(e));
};

const onCreatePost = async (e) => {
    e.preventDefault();
    const title = document.querySelector("input[name='title']").value;
    const contentinput = document.querySelector(
        "textarea[name='content']"
    ).value;
    const body = { title, content: contentinput };

    try {
        e.target.disabled = true;
        e.target.innerText = "Loading...";
        const response = await postMethod("post", body);
        if (response) {
            sessionStorage.setItem("msg_success", "createdPost");
            router.navigate("/");
        }
    } catch (error) {
        e.target.disabled = false;
        e.target.innerText = "Create";
        if (error.message === "token expired") {
            const newToken = await renewToken();
            localStorage.setItem("access_token", newToken.access);
            localStorage.setItem("refresh_token", newToken.refresh);
            onCreatePost(e);
        }
    }
};
