import { User } from "../class/User.js";
import { Job } from "../class/Job.js";
import { Application } from "../class/Application.js";
export const user = new User();
export const job = new Job();
export const application = new Application();

const PROFILE_KEY = "PROFILE_DATA";
const JOBPOST_KEY = "JOBPOST_DATA";

// ===== STORAGE =====
export function getProfileData() {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY)) || {};
}

// MASHAIR - logout button clears session
document.querySelectorAll('a[href="index.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        user.logout();
        window.location.href = 'index.html';
    });
});
export function saveProfileData(newData) {
    const currentData = getProfileData();
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
}

export function getJobpostData() {
    return JSON.parse(sessionStorage.getItem(JOBPOST_KEY)) || [];
}
export function saveJobpostData(newJob) {
    const jobs = getJobpostData(); //array
    jobs.push({
        ...newJob,
        id: Date.now() 
    });
    sessionStorage.setItem(JOBPOST_KEY, JSON.stringify(jobs));
};

// MASHAIR - menu works on all client pages
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
if (menuBtn) menuBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "flex";
});
if (closeBtn) closeBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "none";
});
// == location selection ==
    export const data = {
    Helsinki: ["Keskusta", "Kallio", "Pasila", "Itäkeskus", "Kamppi","Meilahti", "Lauttasaari", "Vuosaari", "Malmi", "Haaga"],
    Espoo: ["Tapiola", "Leppävaara", "Otaniemi", "Matinkylä", "Espoonlahti","Olari", "Kivenlahti", "Niittykumpu", "Soukka", "Laajalahti"],
    Vantaa: ["Tikkurila", "Myyrmäki", "Korso", "Hakunila", "Aviapolis","Martinlaakso", "Koivukylä", "Pakkala", "Ylästö", "Rekola"],
    Tampere: ["Keskusta", "Hervanta", "Tammela", "Kaleva", "Lielahti","Tesoma", "Pyynikki", "Nekala", "Rahola", "Messukylä"],
    Turku: ["Keskusta", "Varissuo", "Runosmäki", "Skanssi", "Nummi","Kupittaa", "Pansio", "Hirvensalo", "Raunistula", "Halinen"],
    Oulu: ["Keskusta", "Kaakkuri", "Linnanmaa", "Tuira", "Rajakylä","Pateniemi", "Hiukkavaara", "Maikkula", "Haukipudas", "Oulunsalo"]
    };
    export function bindLocationDropdown(locationInput){
        
        const dropdown = document.getElementById("locationDropdown");
        const city = document.getElementById("city");
        const district = document.getElementById("district");
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
    }