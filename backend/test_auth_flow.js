const BASE_URL = 'http://localhost:8000/api/v1';

async function testAuth() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        // 1. Register
        console.log("Registering...");
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: email,
                password: password,
                role: "patient",
                gender: "male"
            })
        });
        const regData = await regRes.json();
        console.log("Register Response:", regData);

        // 2. Login
        console.log("Logging in...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const loginData = await loginRes.json();

        const token = loginData.token;
        console.log("Got Token:", token ? "Yes" : "No");

        if (!token) return;

        // 3. Access Profile
        console.log("Accessing Profile...");
        const profileRes = await fetch(`${BASE_URL}/users/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const profileData = await profileRes.json();
        console.log("Profile Access Status:", profileRes.status);
        console.log("Profile Data Success:", profileData.success);

    } catch (error) {
        console.error("Error:", error);
    }
}

testAuth();
