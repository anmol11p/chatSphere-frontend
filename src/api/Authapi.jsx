import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
});

// login route

export const userLogin = async (input) => {
  try {
    const response = api.post("/api/login", input);
    return response;
  } catch (error) {
    return error.response;
  }
};

// registration route
export const userRegister = async (input) => {
  try {
    const response = api.post("/api/register", input);
    return response;
  } catch (error) {
    return error.response;
  }
};

// get login user details

export const loginUserDetails = async (token) => {
  try {
    const response = await api.get("http://localhost:5000/api/user/details", {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

// upload image

export const uploadImage = async (data) => {
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dfbbc2hhl/image/upload",
      data
    );
    return response;
  } catch (error) {
    console.error("Error uploading image:", error.response?.data || error);
    return error;
  }
};

// search a user

export const searchUser = async (token, input) => {
  try {
    const response = await api.get(`/api/user/allDetails?search=${input}`, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

// access the chat
export const accessChat = async (token, userId) => {
  try {
    const response = await api.post(
      "api/chat/",
      { userId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchChat = async (token) => {
  try {
    const response = await api.get("api/chat/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

// create group

export const createGroup = async (input, token) => {
  try {
    const response = await api.post("api/chat/group", input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

// rename the group

export const renameGroup = async (token, data) => {
  try {
    const response = await api.put("/api/chat/grouprename", data, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

// add to group

export const addToGroup = async (token, data) => {
  try {
    const response = await api.put("/api/chat/groupadd", data, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

// http://localhost:5000/api/chat/groupremove delete from group

export const deleteFromGroup = async (token, data) => {
  try {
    const response = await api.put("/api/chat/groupremove", data, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

//http://localhost:5000/api/messages  //send message

export const sendMessageAPI = async (token, input) => {
  try {
    const response = await api.post("/api/messages", input, {
      headers: {
        Authorization: token,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const fetchMessageApi = async (token, chatId) => {
  try {
    const response = await api.get(`/api/messages/${chatId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
