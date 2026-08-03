export async function login(username: string, password: string) {
  const response = await fetch(
    "https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      }),
    }
  );

  return await response.json();
}