import { postMethod } from "../../utils";
import { router } from "../../main.js";
const content = `
    <div class="auth-container w--1200">
        <form>
            <h1>Register</h1>
            <div class="msg none"></div>
            <div class="form-group">
                <label for="username">Username</label>
                <div class="msg-username none"></div>
                <input type="text" name="username" placeholder="Username" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <div class="msg-email none"></div>
                <input type="email" name="email" placeholder="Email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <div class="msg-password none"></div>
                <input type="password" name="password" placeholder="Password" required>
            </div>
            <div class="form-action">
                <button type="submit" class="register-btn">Register</button>
                <button class="login-btn">Login</button>
            </div>
        </form>
    </div>
`;

export const render = () => {
    const app = document.querySelector("#app");
    app.innerHTML = content;
    const msg = document.querySelector(".msg");
    const msgUsername = document.querySelector(".msg-username");
    const msgEmail = document.querySelector(".msg-email");
    const msgPassword = document.querySelector(".msg-password");

    const registerBtn = document.querySelector(".register-btn");
    registerBtn.addEventListener("click", (e) => onRegister(e));

    const loginBtn = document.querySelector(".login-btn");
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate("/login");
    });

    document
        .querySelector("input[name='email']")
        .addEventListener("input", (e) => {
            msg.style.display = "none";
            msgUsername.style.display = "none";
            msgEmail.style.display = "none";
            msgPassword.style.display = "none";
        });
    document
        .querySelector("input[name='password']")
        .addEventListener("input", (e) => {
            msg.style.display = "none";
            msgUsername.style.display = "none";
            msgEmail.style.display = "none";
            msgPassword.style.display = "none";
        });
    document
        .querySelector("input[name='username']")
        .addEventListener("input", (e) => {
            msg.style.display = "none";
            msgUsername.style.display = "none";
            msgEmail.style.display = "none";
            msgPassword.style.display = "none";
        });
};

const onRegister = async (e) => {
    e.preventDefault();
    let isValid = true;
    const username = document.querySelector("input[name='username']").value;
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    const msg = document.querySelector(".msg");
    const msgUsername = document.querySelector(".msg-username");
    const msgEmail = document.querySelector(".msg-email");
    const msgPassword = document.querySelector(".msg-password");
    if (username == "" || email == "" || password == "") {
        isValid = false;
        msg.style.display = "block";
        msg.innerHTML = `<span>Vui lòng không để trống thông tin.</span>`;
    } else {
        if (!email.includes("@") || !email.includes(".com")) {
            isValid = false;
            msgEmail.style.display = "block";
            msgEmail.innerHTML = `<span>Vui lòng nhập đúng định dạng email.</span>`;
        }
        if (password.length < 8) {
            isValid = false;
            msgPassword.style.display = "block";
            msgPassword.innerHTML = `<span>Password không ít hơn 8 ký tự.</span>`;
        }
        if (username.length < 8) {
            isValid = false;
            msgUsername.style.display = "block";
            msgUsername.innerHTML = `<span>Username không ít hơn 8 ký tự.</span>`;
        }
    }
    if (isValid) {
        try {
            const body = {
                name: username,
                email,
                password,
            };
            e.target.disabled = true;
            e.target.innerText = "Loading...";
            const response = await postMethod("master/user", body);
            if (response) {
                sessionStorage.setItem("msg_success", "registered");
                router.navigate("/login");
            }
        } catch (error) {
            e.target.disabled = false;
            e.target.innerText = "Register";
            if (error.message === "Email already exists") {
                msg.style.display = "block";
                msg.innerHTML = `<span>Email đã tồn tại.</span>`;
            }
        }
    }
};
