const serverUrl = process.env.REACT_APP_SERVER;

const api = ({ method, url, body }) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    fetch(`${serverUrl}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { token } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }).then(response => {
      response.json().then(res => {
        return response.ok ? resolve(res) : reject(res);
      });
    });
  });
};

export default api;
