// Import classes
import { User } from "../class/User.js";
import { Job } from "../class/Job.js";
import { Application } from "../class/Application.js";

export const user = new User();
export const job = new Job();
export const application = new Application();

export const PROFILE_KEY = "PROFILE_DATA";

export function getProfileData() {
    return JSON.parse(sessionStorage.getItem(PROFILE_KEY)) || {};
}

export function saveProfileData(newData) {
    const currentData = getProfileData();
    const updated = { ...currentData, ...newData };
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
}
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
if (menuBtn) menuBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "flex";
});
if (closeBtn) closeBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "none";
});