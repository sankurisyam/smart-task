const API_URL = (process.env.REACT_APP_API_URL || "/api").replace(/\/$/, "");
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

const API = {
  getTasks() {
    return request("/tasks");
  },
  createTask(payload) {
    return request("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateTask(id, payload) {
    return request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteTask(id) {
    return request(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};

export default API;
