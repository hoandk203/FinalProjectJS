import { postMethod } from "../../utils";
import { putMethod } from "../../utils";
import { router } from "../../main.js";
import { header } from "../index.js";
import { onLogout } from "../index.js";
import { renewToken } from "../../utils";

const createPostContainer = `<div class="create-post-container">
<form>
    <h1>Update Post</h1>
        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" name="title" placeholder="Title..." required>
        </div>
        <div class="form-group">
            <label for="content">Content</label>
            <textarea rows="10" name="content" placeholder="Content..." required></textarea>
        </div>
        <div class="form-action">
            <button type="submit" class="save-post-btn">Update</button>
            <button class="back-btn">Back to home</button>
        </div>
    </form>
</div>`;

const onUpdatePost = async (e, id) => {
    e.preventDefault();
    try {
        const title = document.querySelector("input[name='title']").value;
        const content = document.querySelector(
            "textarea[name='content']"
        ).value;
        e.target.disabled = true;
        e.target.innerText = "Loading...";
        const response = await putMethod(`post/${id}`, { title, content });

        if (response) {
            sessionStorage.setItem("msg_success", "updatedPost");
            router.navigate("/");
        }
    } catch (error) {
        e.target.disabled = false;
        e.target.innerText = "Update";
        if (error.message === "token expired") {
            const newToken = await renewToken();

            localStorage.setItem("access_token", newToken.access);
            localStorage.setItem("refresh_token", newToken.refresh);
            onUpdatePost(e, id);
        }
    }
};

export const render = (id) => {
    const content = header + createPostContainer;
    const app = document.querySelector("#app");
    app.innerHTML = content;

    document.querySelector("input[name='title']").value =
        sessionStorage.getItem("title");
    document.querySelector("textarea[name='content']").textContent =
        sessionStorage.getItem("content");

    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", onLogout);

    document.querySelector(".back-btn").addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate("/");
    });

    const savePostBtn = document.querySelector(".save-post-btn");
    savePostBtn.addEventListener("click", (e) => onUpdatePost(e, id));
};
