import { getMethod } from "../utils";
import { deleteMethod } from "../utils";
import { renewToken } from "../utils";
import { router } from "../main.js";

export const header = `
    <header class="white--text primary--bg">
        <div class="header-content display--flex justify--between">
            <div class="logo">Final Project</div>
            <div class="user-info">Welcome, Shinki</div>
            <button type="button" class="logout-btn">Logout</button>
        </div>
    </header>
`;

const tableContainer = `
    <div class="table-container w--1200 center">
        <div class="msg-success"></div>
        <h1>Your Posts</h1>
        <button class="create-post-page-btn"><i class="fa-solid fa-plus"></i> Create Post</button>
        <table class="w--full" cellspacing="0">
            <tr>
                <th class="w--10">ID</th>
                <th class="w--20">Title</th>
                <th class="w--50">Content</th>
                <th>Action</th>
            </tr>
        </table>
    </div>
`;

export async function render() {
    const content = header + tableContainer;
    const app = document.querySelector("#app");
    app.innerHTML = content;

    // SUCCESS MESSAGE
    const msgSuccess = document.querySelector(".msg-success");
    if (sessionStorage.getItem("msg_success")) {
        let msgType = "";
        if (sessionStorage.getItem("msg_success") == "loggedIn") {
            msgType = "Đăng nhập thành công!";
        }
        if (sessionStorage.getItem("msg_success") == "createdPost") {
            msgType = "Tạo bài viết thành công!";
        }
        if (sessionStorage.getItem("msg_success") == "updatedPost") {
            msgType = "Sửa bài viết thành công!";
        }
        if (sessionStorage.getItem("msg_success") == "deletedPost") {
            msgType = "Xóa bài viết thành công!";
        }
        msgSuccess.style.top = "-100px";
        msgSuccess.innerText = msgType;
        setTimeout(() => {
            msgSuccess.style.top = "80px";
        });
        setTimeout(() => {
            msgSuccess.style.top = "-100px";
            sessionStorage.removeItem("msg_success");
        }, 2000);
    }

    // GET POSTS

    await getPosts();

    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", onLogout);

    document
        .querySelector(".create-post-page-btn")
        .addEventListener("click", () => {
            router.navigate("/post/0");
        });
}

const getPosts = async () => {
    try {
        const posts = await getMethod("post");
        if (posts) {
            const postsList = posts
                .map((post) => {
                    return `<tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.content}</td>
                <td>
                    <button class="edit-btn" data-id="${post.id}" data-title="${post.title}" data-content="${post.content}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
                })
                .join("");
            const table = document.querySelector(".table-container table");
            table.innerHTML += postsList;

            // EDIT BTN

            const editBtns = document.querySelectorAll(".edit-btn");
            editBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const id = btn.dataset.id;
                    const title = btn.dataset.title;
                    const content = btn.dataset.content;
                    sessionStorage.setItem("title", title);
                    sessionStorage.setItem("content", content);
                    router.navigate(`/post/${id}`);
                });
            });

            //DELETE BTN

            const deleteBtns = document.querySelectorAll(".delete-btn");
            deleteBtns.forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    const id = btn.previousElementSibling.dataset.id;
                    try {
                        e.target.disabled = true;
                        e.target.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
                        const response = await deleteMethod(`post/${id}`);
                        if (response) {
                            sessionStorage.setItem(
                                "msg_success",
                                "deletedPost"
                            );
                            await render();
                        }
                    } catch (error) {
                        e.target.disabled = true;
                        e.target.innerHTML = `<i class="fa-solid fa-trash"></i>`;
                        if (error.message === "token expired") {
                            const newToken = await renewToken();

                            localStorage.setItem(
                                "access_token",
                                newToken.access
                            );
                            localStorage.setItem(
                                "refresh_token",
                                newToken.refresh
                            );
                            await deleteMethod(`post/${id}`);
                            await render();
                        }
                    }
                });
            });
        }
    } catch (error) {
        if (error.message === "token expired") {
            const newToken = await renewToken();

            localStorage.setItem("access_token", newToken.access);
            localStorage.setItem("refresh_token", newToken.refresh);
            getPosts();
        }
    }
};

// LOGOUT

export const onLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.setItem("msg_success", "loggedOut");
    router.navigate("/login");
};
