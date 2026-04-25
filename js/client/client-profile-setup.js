import { user, saveProfileData, bindLocationDropdown } from './client-shared.js';

    const locationInput = document.getElementById("location");
    bindLocationDropdown(locationInput);

    const submit1Btn1 = document.querySelector("#submit-profile-btn1");
    if (submit1Btn1) {
        submit1Btn1.addEventListener("click", async (event) => {
            event.preventDefault();
            const fullname = document.querySelector("#name").value;
            const contact_email = document.querySelector("#contact-email").value;
            const contact_phone = document.querySelector("#contact-phone").value;
            const location = document.querySelector("#location").value;

            if (!fullname || !contact_email || !contact_phone || !location) {
                alert("Please fill in all required fields.");
                return;
            }
            saveProfileData({ fullname, contact_email, contact_phone, location });
            try {
                await user.updateProfile(fullname, contact_email, contact_phone, location);
                alert("Profile submitted successfully!");
                window.location.href = "client-dashboard.html";
            } catch (error) {
                alert("Error posting job: " + error);
            }
        });
    }
