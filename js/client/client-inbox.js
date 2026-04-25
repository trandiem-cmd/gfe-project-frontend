import { User } from "../class/User.js";
import { BACKEND_URL } from '../config.js';
const user = new User();
const currentUser = JSON.parse(sessionStorage.getItem('user'));
let selectedReceiverId = null;
let allMessages = [];

// MASHAIR - menu open/close
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
if (menuBtn) menuBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "flex";
});
if (closeBtn) closeBtn.addEventListener("click", () => {
    document.getElementById("menuOverlay").style.display = "none";
});

// MASHAIR - show list view
function showList() {
    document.getElementById('listView').style.display = 'block';
    document.getElementById('chatView').style.display = 'none';
}

// MASHAIR - show chat view
function showChat(name) {
    document.getElementById('listView').style.display = 'none';
    document.getElementById('chatView').style.display = 'block';
    document.getElementById('chatPersonName').textContent = name;
}

// MASHAIR - load jobseekers who have messages with client
async function loadJobseekers() {
    const msgResponse = await fetch(`${BACKEND_URL}/inbox/${currentUser.id}`);
    allMessages = await msgResponse.json();

    const userIds = [...new Set(allMessages.map(m =>
        m.sender_id === currentUser.id ? m.receiver_id : m.sender_id
    ))];

    const list = document.getElementById('messageList');
    list.innerHTML = '';

    if (userIds.length === 0) {
        list.innerHTML = '<p style="padding:20px; color:#572290;">No messages yet</p>';
        return;
    }

    const response = await fetch(`${BACKEND_URL}/user/jobseekers`);
    const jobseekers = await response.json();
    const filtered = jobseekers.filter(j => userIds.includes(j.id));

    filtered.forEach(jobseeker => {
        const unread = allMessages.filter(m => m.sender_id === jobseeker.id && m.read === false);
        const lastMsg = allMessages.filter(m =>
            (m.sender_id === jobseeker.id && m.receiver_id === currentUser.id) ||
            (m.receiver_id === jobseeker.id && m.sender_id === currentUser.id)
        ).slice(-1)[0];

        const item = document.createElement('div');
        item.className = 'message-item';
        item.innerHTML = `
            <img src="${jobseeker.photo ? 'http://localhost:3001/uploads/' + jobseeker.photo : './Assets/GFE logo.png'}" class="profile-icon">
            <div>
                <strong>${jobseeker.fullname}</strong>
                <small class="service-label">${jobseeker.services || ''}</small>
                <p>${lastMsg ? lastMsg.message_text.substring(0, 30) + '...' : 'No messages yet'}</p>
            </div>
            ${unread.length > 0 ? `<span class="badge">${unread.length}</span>` : ''}
        `;

        item.addEventListener('click', () => {
            selectedReceiverId = jobseeker.id;
            showChat(jobseeker.fullname);
            loadMessages(jobseeker.id);
        });

        list.appendChild(item);
    });
}

// MASHAIR - load messages for selected chat
async function loadMessages(receiverId) {
    const response = await fetch(`${BACKEND_URL}/inbox/${currentUser.id}`);
    const messages = await response.json();
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';

    const filtered = messages.filter(msg =>
        (msg.sender_id === currentUser.id && msg.receiver_id === receiverId) ||
        (msg.receiver_id === currentUser.id && msg.sender_id === receiverId)
    );

    filtered.forEach(msg => {
        const div = document.createElement('div');
        div.className = msg.sender_id === currentUser.id ? 'chat-message right' : 'chat-message left';
        div.textContent = msg.message_text;
        chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// MASHAIR - send message
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const backBtn = document.getElementById('backBtn');

if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (message !== '' && selectedReceiverId) {
            await fetch(`${BACKEND_URL}/inbox`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: currentUser.id,
                    receiver_id: selectedReceiverId,
                    message_text: message
                })
            });
            chatInput.value = '';
            loadMessages(selectedReceiverId);
        }
    });
}

if (chatInput) {
    chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendBtn.click();
    });
}

if (backBtn) backBtn.addEventListener('click', showList);

// MASHAIR - auto open chat if coming from dashboard message button
const selectedReceiver = JSON.parse(sessionStorage.getItem('selectedReceiver'));
if (selectedReceiver) {
    selectedReceiverId = selectedReceiver.id;
    showChat(selectedReceiver.fullname);
    loadMessages(selectedReceiver.id);
    // MASHAIR - clear after use
    sessionStorage.removeItem('selectedReceiver');
}

loadJobseekers();