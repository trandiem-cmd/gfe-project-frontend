import { BACKEND_URL } from './config.js';



document.querySelector(".contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    full_name: document.querySelector("[name='full_name']").value,
    email: document.querySelector("[name='email']").value,
    phone: document.querySelector("[name='phone']").value,
    subject: document.querySelector("[name='subject']").value,
    message: document.querySelector("[name='message']").value
  };

  try {
    const response = await fetch("http://localhost:3001/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    alert("Message sent successfully!");
    document.querySelector(".contact-form").reset();

  } catch (error) {
    console.error(error);
    alert("Error sending message");
  }
});