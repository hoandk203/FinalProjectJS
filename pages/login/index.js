import { postMethod } from "../../utils";
import { router } from "../../main.js";
const content = `
    <div class="auth-container w--1200">
        <div class="msg-success"></div>
        <form>
            <h1>Login</h1>
            <div class="msg none"></div>
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
                <button type="submit" class="login-btn">Login</button>
                <button class="register-btn">Register</button>
            </div>
        </form>
    </div>
`;

export const render = () => {
    const app = document.querySelector("#app");
    app.innerHTML = content;
    const msg = document.querySelector(".msg");
    const msgEmail = document.querySelector(".msg-email");
    const msgPassword = document.querySelector(".msg-password");

    const msgSuccess = document.querySelector(".msg-success");
    if (sessionStorage.getItem("msg_success")) {
        let msgType;
        if (sessionStorage.getItem("msg_success") == "registered") {
            msgType = "Đăng ký thành công!";
        }
        if (sessionStorage.getItem("msg_success") == "loggedOut") {
            msgType = "Đăng xuất thành công!";
        }
        msgSuccess.style.top = "-100px";
        msgSuccess.innerText = msgType;
        setTimeout(() => {
            msgSuccess.style.top = "50px";
        });
        setTimeout(() => {
            msgSuccess.style.top = "-100px";
            sessionStorage.removeItem("msg_success");
        }, 2000);
    }

    const loginBtn = document.querySelector(".login-btn");
    loginBtn.addEventListener("click", (e) => onLogin(e));

    const registerBtn = document.querySelector(".register-btn");
    registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        router.navigate("/register");
    });

    document
        .querySelector("input[name='email']")
        .addEventListener("input", (e) => {
            msg.style.display = "none";
            msgEmail.style.display = "none";
            msgPassword.style.display = "none";
        });
    document
        .querySelector("input[name='password']")
        .addEventListener("input", (e) => {
            msg.style.display = "none";
            msgEmail.style.display = "none";
            msgPassword.style.display = "none";
        });
};

const onLogin = async (e) => {
    e.preventDefault();
    let isValid = true;

    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    const msg = document.querySelector(".msg");
    const msgEmail = document.querySelector(".msg-email");
    const msgPassword = document.querySelector(".msg-password");
    if (email == "" || password == "") {
        isValid = false;
        msg.style.display = "block";
        msg.innerHTML = `<span>Vui lòng nhập đầy đủ email và password.</span>`;
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
    }

    if (isValid) {
        try {
            const body = {
                email: email,
                password: password,
            };
            e.target.disabled = true;
            e.target.innerText = "Loading...";
            //call api login
            const response = await postMethod(`login`, body);
            localStorage.setItem("access_token", response.access);
            localStorage.setItem("refresh_token", response.refresh);
            sessionStorage.setItem("msg_success", "loggedIn");
            router.navigate("/");
        } catch (error) {
            e.target.disabled = false;
            e.target.innerText = "Login";
            if (error.message === "Wrong username or password") {
                msg.style.display = "block";
                msg.innerHTML = `<span>Email hoặc password không chính xác.</span>`;
            }
        }
    }
};
