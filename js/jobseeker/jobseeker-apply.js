import { user, application } from './jobseeker-shared.js';
const applyForm = document.querySelector(".apply-form");
    if (applyForm) {
        const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
        const userData = JSON.parse(sessionStorage.getItem("user"));

        if (selectedJob && userData) {
            if (userData.fullname) document.querySelector(".apply-name").value = userData.fullname;
            if (userData.email) document.querySelector(".apply-email").value = userData.email;
            if (document.querySelector(".apply-title")) document.querySelector(".apply-title").innerHTML = selectedJob.service_title;
            if (document.querySelector(".apply-schedule")) document.querySelector(".apply-schedule").innerHTML = selectedJob.service_schedule;
            if (document.querySelector(".apply-location")) document.querySelector(".apply-location").innerHTML = `
                <img src="./Assets/location_on.png" class="location-icon">
                ${selectedJob.service_location} • ${selectedJob.service_pay_rate}`;
        }
        // MASHAIR - show filename when CV is selected
const cvInput = document.getElementById('cvInput');
if (cvInput) {
    cvInput.addEventListener('change', function() {
        const fileName = this.files[0]?.name;
        const display = document.getElementById('cvFileName');
        if (fileName && display) {
            display.textContent = `✅ Selected: ${fileName}`;
        }
    });
}

        // DIEM - submit application
        applyForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(applyForm);
            formData.append("job_id", selectedJob.id);
            formData.append("jobseeker_id", user.id);
            try {await application.applyJob(formData);
            
            window.location.href = "jobseeker-application.html";
            alert("✅ You have successfully applied!");
            } catch (err) {
                console.error(err);
                alert("❌ You have alredy applied for this job");
            }
        });
    }