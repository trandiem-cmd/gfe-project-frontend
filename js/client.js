import { User } from "./class/User.js";
import { Job } from "./class/Job.js";
import { Application } from "./class/Application.js";
const user = new User();
const job = new Job();
const application = new Application();

const PROFILE_KEY = "PROFILE_DATA";
const JOBPOST_KEY = "JOBPOST_DATA";

// ===== STORAGE =====
function getProfileData() {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY)) || {};
}
function saveProfileData(newData) {
    const currentData = getProfileData();
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
}

function getJobpostData() {
    return JSON.parse(sessionStorage.getItem(JOBPOST_KEY)) || [];
}
function saveJobpostData(newJob) {
    const jobs = getJobpostData(); //array
    jobs.push({
        ...newJob,
        id: Date.now() 
    });
    sessionStorage.setItem(JOBPOST_KEY, JSON.stringify(jobs));
};



document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfileData();

    // ===== CLIENTS CREATE PROFILE PAGE =====

    // == location selection ==
    const dropdown = document.getElementById("locationDropdown");
    const city = document.getElementById("city");
    const district = document.getElementById("district");
    const data = {
    Helsinki: [
        "Keskusta", "Kallio", "Pasila", "Itäkeskus", "Kamppi",
        "Meilahti", "Lauttasaari", "Vuosaari", "Malmi", "Haaga"
    ],

    Espoo: [
        "Tapiola", "Leppävaara", "Otaniemi", "Matinkylä", "Espoonlahti",
        "Olari", "Kivenlahti", "Niittykumpu", "Soukka", "Laajalahti"
    ],

    Vantaa: [
        "Tikkurila", "Myyrmäki", "Korso", "Hakunila", "Aviapolis",
        "Martinlaakso", "Koivukylä", "Pakkala", "Ylästö", "Rekola"
    ],

    Tampere: [
        "Keskusta", "Hervanta", "Tammela", "Kaleva", "Lielahti",
        "Tesoma", "Pyynikki", "Nekala", "Rahola", "Messukylä"
    ],

    Turku: [
        "Keskusta", "Varissuo", "Runosmäki", "Skanssi", "Nummi",
        "Kupittaa", "Pansio", "Hirvensalo", "Raunistula", "Halinen"
    ],

    Oulu: [
        "Keskusta", "Kaakkuri", "Linnanmaa", "Tuira", "Rajakylä",
        "Pateniemi", "Hiukkavaara", "Maikkula", "Haukipudas", "Oulunsalo"
    ]
    };
    const locationInput = document.getElementById("location");
        if(locationInput){
            locationInput.addEventListener("click", () => {
            dropdown.classList.toggle("d-none");
            });
            city.addEventListener("change", () => {
            const selectedCity = city.value;

            district.innerHTML = `<option value="">Select district</option>`;

            if (data[selectedCity]) {
                data[selectedCity].forEach(d => {
                const option = document.createElement("option");
                option.value = d;
                option.textContent = d;
                district.appendChild(option);
                });
            }
            });
            district.addEventListener("change", () => {
            if (city.value && district.value) {
                locationInput.value = `${city.value} - ${district.value}`;
                dropdown.classList.add("d-none");
            }
            });
            document.addEventListener("click", (e) => {
            if (!document.querySelector(".location-wrapper").contains(e.target)) {
                dropdown.classList.add("d-none");
            }
            });        
        };
    const submit1Btn1 = document.querySelector("#submit-profile-btn1");

    if (submit1Btn1) {
        submit1Btn1.addEventListener("click", async(event) => {
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
            try{
                await user.updateProfile(fullname, contact_email, contact_phone, location);
                
                alert("Profile submitted successfully!");
                window.location.href = "client-dashboard.html"; 
            } catch(error) {alert("Error posting job: " + error);
            }
        });
    }
   

    // ===== CLIENT POST A JOB =====
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

    const serviceLocationInput = document.getElementById("service-location");
    if(serviceLocationInput){
        serviceLocationInput.addEventListener("click", () => {
        dropdown.classList.toggle("d-none");
        });
        city.addEventListener("change", () => {
        const selectedCity = city.value;

        district.innerHTML = `<option value="">Select district</option>`;

        if (data[selectedCity]) {
            data[selectedCity].forEach(d => {
            const option = document.createElement("option");
            option.value = d;
            option.textContent = d;
            district.appendChild(option);
            });
        }
        });
        district.addEventListener("change", () => {
        if (city.value && district.value) {
            serviceLocationInput.value = `${city.value} - ${district.value}`;
            dropdown.classList.add("d-none");
        }
        });
        document.addEventListener("click", (e) => {
        if (!document.querySelector(".location-wrapper").contains(e.target)) {
            dropdown.classList.add("d-none");
        }
        });        
    };

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
            const service_pay_rate = document.getElementById("service-pay-rate").value;
            if (!service_type || !service_title || !service_description || !service_schedule|| !service_frequency|| !service_location|| !service_pay_rate) {
            alert("Please fill in all required fields.");
            return;
            }
            saveJobpostData({ selectedService, service_title, service_description, service_schedule, serviceFrequency, service_location, service_pay_rate});        
            try{
                await job.jobpost(service_type, service_title, service_description, service_schedule, service_frequency, service_location, service_pay_rate);   
                alert("Job posted successfully!");
                window.location.href = "client-dashboard.html"; 
            } catch(error) {alert("Error posting job: " + error);
            }

        });
    };
    
// ===== CLIENT'S DASHBOARD ===== //
    // ===== CLIENT'S JOB POSTS AND RECOMMENDS CANDIDATES ===== //
async function loadDashboard() {
    const userData = JSON.parse(sessionStorage.getItem("user"));

    if (!userData || !userData.id) {
        alert("Not logged in");
        window.location.href = "login.html";
        return;
    }

    const userId = userData.id; 

    // show name
    const welcome = document.getElementById("welcomeName");
    if (welcome) {
        welcome.innerText = `Hello  ${userData.fullname || "Client"} 👋`;
    }

    await job.getJob(userId);
    const jobs = JSON.parse(sessionStorage.getItem('jobList')) || [];
    renderJobs(jobs);

    await user.getJobSeeker(userId);
    const jobseekers = JSON.parse(sessionStorage.getItem('jobSeekerList')) || [];
    renderJobseekers(jobseekers);
}
if (document.getElementById("job-list")) {
    loadDashboard();
}
function renderJobs(jobs) {
  const container = document.getElementById("job-list");
  container.innerHTML = "";
  if (jobs.length === 0) {
    container.innerHTML = "<p style='padding-left: 20px'>No jobs yet</p>";
    return;
  }

  jobs.forEach(job => {
    const div = document.createElement("div");
    div.classList.add("jobs-card");

    div.innerHTML = `
      <h3>${job.service_title}</h3>
      <p>${job.service_schedule}</p>
      <span>${job.service_location}</span><span style="padding: 20px">${job.service_pay_rate}</span>
      <p>${job.service_description}</p>
      <button class="manage-applicants-btn">Manage applicants</button>
    `;
    container.appendChild(div);
    const manageApplicantsBtn = div.querySelector(".manage-applicants-btn");
        manageApplicantsBtn.addEventListener("click", (event) => {
            event.preventDefault();

            window.location.href = "client-jobdetails.html";

            sessionStorage.setItem("selectedJob", JSON.stringify(job));
        });
  });
}

function renderJobseekers(jobseekers) {
  const container = document.getElementById("jobseeker-list");
  container.innerHTML = "";
  if (jobseekers.length === 0) {
    container.innerHTML = "<p>No candidates</p>";
    return;
  }
  jobseekers.forEach(jobseeker => {
    let serviceTitle = jobseeker.services
    if (serviceTitle == 'cleaning'){serviceTitle='🧼 Cleaning'}
    else if (serviceTitle == 'childcare'){serviceTitle='🧸 Childcare'}
    else {serviceTitle='👴🏻 Eldercare'};
    const div = document.createElement("div");
    div.classList.add("jobs-card");
    div.innerHTML = `
      <h3>${jobseeker.fullname}</h3>
      <p>${jobseeker.experience}</p>
      <span>📍${jobseeker.location}</span><span style="padding: 20px">${jobseeker.hourly_rate}</span>
      <p>${serviceTitle}</p>
      <p>${jobseeker.skills}</p>
    `;
    container.appendChild(div);
  });
}
    // ===== CLIENT'S SEARCH CANDIDATES BY SERVICE ===== //
async function loadServices() {
    const serviceItems = document.querySelectorAll(".find-by-service-btn");
    serviceItems.forEach(item => {
        item.addEventListener("click", async () => {
            const service = item.dataset.value; // childcare, eldercare,...
            serviceItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            let jobseekersList = await user.getJobSeekerByService(service); 
            renderJobseekersByServices(jobseekersList); 
        });
    });
};

if (document.querySelector(".find-by-service-btn")) {
    loadServices();
}

function renderJobseekersByServices(list) {
    const container = document.getElementById("jobseeker-by-service-list");
    container.innerHTML = "";
    list.forEach(user => {
        let serviceTitle = user.services
        if (serviceTitle == 'cleaning'){serviceTitle='🧼 Cleaning'}
        else if (serviceTitle == 'childcare'){serviceTitle='🧸 Childcare'}
        else {serviceTitle='👴🏻 Eldercare'};
        const div = document.createElement("div");
        div.classList.add("jobs-card");
        div.innerHTML = `
            <h3>${user.fullname}</h3>
            <p>${user.experience}</p>
            <p>${serviceTitle}</p>
            <p>${user.skills}</p>
            <p>${user.about_you}</p>
        `;
        container.appendChild(div);
    });
}

// ===== CLIENT'S JOBDETAILS ===== //
    // == JOB DETAILS == //
const selectedJob = JSON.parse(sessionStorage.getItem("selectedJob"));
const container = document.querySelector(".jobpost-details")
const div = document.createElement("div");
    div.classList.add("jobs-card");     
    div.innerHTML = `
        <div class="job-top">
            <h3>${selectedJob.service_title}</h4>
        </div>
        <p class="job-time">${selectedJob.service_schedule}</p>
        <p class="apply-location">
            <img src="./Assets/location_on.png" class="location-icon">
            ${selectedJob.service_location} • ${selectedJob.service_pay_rate}
        </p>
                
    `;
    container.appendChild(div);
    // APPLICANTS DETAIS == //
async function loadApplicants() {
    const currentPostId = selectedJob?.id;
    if (!currentPostId) {
    console.error("No postId");
    return;
    }
    try {
        const data = await application.getApplicants(currentPostId);
        renderApplicants(data);
    } catch (err) {
        console.error(err);
    }
}
if (document.querySelector(".Applicants")) {
    loadApplicants();
}
function renderApplicants(data) {
    const container = document.querySelector(".Applicants");
    container.innerHTML = "";
    if(!Array.isArray(data) || data.length === 0){
        const p = document.createElement("p");
        p.innerHTML = "No applicants";
        container.appendChild(p);}
    data.forEach(app => {
        let serviceTitle = app.services
        if (serviceTitle == 'cleaning'){serviceTitle='🧼 Cleaning'}
        else if (serviceTitle == 'childcare'){serviceTitle='🧸 Childcare'}
        else {serviceTitle='👴🏻 Eldercare'};
        const div = document.createElement("div");
        div.classList.add("jobs-card");
        div.innerHTML = `
            <div class="applicant-status">
                <h3>${app.fullname}</h3>
                <p class="status ${app.status}">${app.status}</p>
                </div>
            <p>${app.experience}</p>
            <p>${serviceTitle}</p>
            <p>${app.skills}</p>
            <button class="accept-btn" data-id="${app.id}">Accept</button>
            <button class="reject-btn" data-id="${app.id}">Reject</button>
            
        `;
        div.querySelector(".accept-btn").addEventListener("click", async() => {
            console.log("ACCEPT CLICK", app.id);
            await updateStatus(app.id, "accepted");
            await loadApplicants();
        });

        div.querySelector(".reject-btn").addEventListener("click", async() => {
            await updateStatus(app.id, "rejected");
            await loadApplicants();
        });
        container.appendChild(div);
    });
}

async function updateStatus(appId,status) {
  try {
    const response = await application.updateStatus(appId,status); 
    return response;
  } catch (err) {
    console.error(err);
  }
}

});