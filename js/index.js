// MASHAIR - CTA toggle button like Yoopies
const workerBtn = document.getElementById("workerBtn");
const jobBtn = document.getElementById("jobBtn");
const slider = document.querySelector(".toggle-slider");

if (workerBtn && jobBtn && slider) {
    workerBtn.addEventListener("click", () => {
        slider.style.left = "6px";
        workerBtn.classList.add("active");
        jobBtn.classList.remove("active");
        // MASHAIR - redirect to client side
         setTimeout(() => {
    window.location.href = "client-search.html";
  }, 200);
    });

    jobBtn.addEventListener("click", () => {
        slider.style.left = "calc(50% + 0px)";
        jobBtn.classList.add("active");
        workerBtn.classList.remove("active");
        // MASHAIR - redirect to jobseeker side
         setTimeout(() => {
    window.location.href = "jobseeker-search.html";
  }, 200);
    });
}