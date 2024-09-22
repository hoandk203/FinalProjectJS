const baseUrl = "http://103.159.51.69:2000";

export const getMethod = async (endpoint) => {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        // endpoint = post
        // http://103.159.51.69:2000/post
        // neu token het han -> token expired -> catch
        const data = await response.json();
        if (data.detail === "token expired") {
            throw new Error("token expired");
        }
        return data;
    } catch (e) {
        // check e lien qian den token expire
        // goi api refresh token
        throw e;
    }
};

export const postMethod = async (endpoint, body) => {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.detail === "token expired") {
            throw new Error("token expired");
        }
        if (data.detail === "Wrong username or password") {
            throw new Error("Wrong username or password");
        }
        if (data.detail === "Email already exists") {
            throw new Error("Email already exists");
        }
        return data;
    } catch (e) {
        throw e;
    }
};

export const putMethod = async (endpoint, body) => {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.detail === "token expired") {
            throw new Error("token expired");
        }
        return data;
    } catch (e) {
        throw e;
    }
};

export const deleteMethod = async (endpoint) => {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        const data = await response.json();
        if (data.detail === "token expired") {
            throw new Error("token expired");
        }
        return data;
    } catch (e) {
        throw e;
    }
};

export const renewToken = async () => {
    const response = await fetch(`${baseUrl}/login/get_new_token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: localStorage.getItem("refresh_token"),
        }),
    });
    const data = await response.json();
    return data;
};
