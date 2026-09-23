const BASE_URL = 'http://localhost:8000/api/v1';

async function testExistingUser() {
    const email = "madhu17@gmail.com";
    const password = "password123";

    try {
        // 1. Login
        console.log(`Logging in as ${email}...`);
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

        if (!token) {
            console.error("Login Failed:", loginData);
            return;
        }

        // 2. Access Profile
        console.log("Accessing Profile...");
        const profileRes = await fetch(`${BASE_URL}/users/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const profileData = await profileRes.json();
        console.log("Profile Fetch Status:", profileRes.status);
        console.log("Profile Data:", profileData);

        // 3. Access Appointments
        console.log("Accessing Appointments...");
        const apptRes = await fetch(`${BASE_URL}/users/appointments/my-appointments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const apptData = await apptRes.json();
        console.log("Appointments Fetch Status:", apptRes.status);
        console.log("Appointments Data success:", apptData.success);

    } catch (error) {
        console.error("Error:", error);
    }
}

testExistingUser();
