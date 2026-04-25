    // ===== CLIENT POST A JOB =====
    import { job, getJobpostData, saveJobpostData, data, bindLocationDropdown } from './client-shared.js';
    


    document.addEventListener("DOMContentLoaded", () => {
    const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
    if (selectedJob) {
  // Pre-fill form fields with selected job data
  document.getElementById("job-title").value = selectedJob.service_title;
  document.getElementById("service-description").value = selectedJob.service_description;
  document.getElementById("service-schedule").value = selectedJob.service_schedule;
  document.getElementById("service-location").value = selectedJob.service_location;
  document.getElementById("service-pay-rate").value = selectedJob.service_pay_rate.replace("€","").replace("/hour","");
}
    const jobpost = getJobpostData();
    const items = document.querySelectorAll(".service-item");
    let selectedService = jobpost.selectedService || null;

    if (items.length) {
        items.forEach(item => {
            if (item.dataset.value === selectedService?.type) {
                item.classList.add("active");
            }

            item.addEventListener("click", () => {
                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                selectedService = {
                    type: item.dataset.value,
                    title: item.querySelectorAll("div")[1].textContent.trim()
                };
            });
        });
    }
    const locationInput = document.getElementById("service-location");
    bindLocationDropdown(locationInput);
    const frequencyItems = document.querySelectorAll(".frequency-btn");
    let serviceFrequency = jobpost.serviceFrequency || null;

    if (frequencyItems.length) {
        frequencyItems.forEach(item => {
            if (item.dataset.value === serviceFrequency?.type) {
                item.classList.add("active");
            }

            item.addEventListener("click", () => {
                frequencyItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                serviceFrequency = {
                    type: item.dataset.value,
                    title: item.textContent.trim()
                };
            });
        });
    }
    
    const jobpostSumitBtn1 = document.querySelector("#jobpost-submit-btn1");
    if (jobpostSumitBtn1) {
        jobpostSumitBtn1.addEventListener("click", async(event) => {
            event.preventDefault();

            const service_type = selectedService?.type;
            const service_title = document.getElementById("job-title").value;
            const service_description = document.getElementById("service-description").value;
            const service_schedule = document.getElementById("service-schedule").value;
            const service_frequency = serviceFrequency?.type;
            const service_location = document.getElementById("service-location").value;
            const service_pay_rate = `€${document.getElementById("service-pay-rate").value}/hour`;
            if (!selectedJob) {
    // Only validate when creating new job
    if (!service_type || !service_title || !service_description || !service_schedule || !service_frequency || !service_location || !service_pay_rate) {
        alert("Please fill in all required fields.");
        return;
    }
}
            saveJobpostData({ selectedService, service_title, service_description, service_schedule, serviceFrequency, service_location, service_pay_rate});        
           try {
    if (selectedJob) {
        // UPDATE existing job
        await job.updateJob(
    selectedJob.id,
    service_type || selectedJob.service_type,
    service_title || selectedJob.service_title,
    service_description || selectedJob.service_description,
    service_schedule || selectedJob.service_schedule,
    service_frequency || selectedJob.service_frequency,
    service_location || selectedJob.service_location,
    service_pay_rate || selectedJob.service_pay_rate
);
        alert("Job updated successfully!");
        sessionStorage.removeItem("selectedJob");
    } else {
        // CREATE new job
        await job.jobpost(
            service_type,
            service_title,
            service_description,
            service_schedule,
            service_frequency,
            service_location,
            service_pay_rate
        );
        alert("Job posted successfully!");
    }

    window.location.href = "client-dashboard.html";

} catch (error) {
    alert("Error: " + error);
}

        });
    };
    });

    document.getElementById('back1-btn1')?.addEventListener('click', () => {
    window.location.href = 'client-dashboard.html';
});