import { user } from './jobseeker-shared.js';
import { BACKEND_URL } from '../config.js'; 
// MASHAIR - inbox page WhatsApp style (new feature)
const messageList = document.getElementById('messageList');
if (messageList) {
    const currentUser = JSON.parse(sessionStorage.getItem('user')); // MASHAIR FIX - get logged in user
    let selectedReceiverId = null;
    let allMessages = [];

    function showList() {
        document.getElementById('listView').style.display = 'block';
        document.getElementById('chatView').style.display = 'none';
    }

    function showChat(name) {
        document.getElementById('listView').style.display = 'none';
        document.getElementById('chatView').style.display = 'block';
        document.getElementById('chatPersonName').textContent = name;
    }

    async function loadClients() {
        allMessages = await user.getMessages(currentUser.id); // MASHAIR FIX - was user.id
        const userIds = [...new Set(allMessages.map(m =>
            m.sender_id === currentUser.id ? m.receiver_id : m.sender_id // MASHAIR FIX
        ))];

        messageList.innerHTML = '';
        if (userIds.length === 0) {
            messageList.innerHTML = '<p style="padding:20px; color:#572290;">No messages yet</p>';
            return;
        }

        const clients = await user.getClients();
        const filtered = clients.filter(c => userIds.includes(c.id));

        filtered.forEach(client => {
            const unread = allMessages.filter(m => m.sender_id === client.id && m.read === false);
            const lastMsg = allMessages.filter(m =>
                (m.sender_id === client.id && m.receiver_id === currentUser.id) || // MASHAIR FIX
                (m.receiver_id === client.id && m.sender_id === currentUser.id)    // MASHAIR FIX
            ).slice(-1)[0];

            const item = document.createElement('div');
            item.className = 'message-item';
            item.innerHTML = `
                <img src="./Assets/Group 142 (2).png" class="profile-icon">
                <div>
                    <strong>${client.fullname}</strong>
                    <p>${lastMsg ? lastMsg.message_text.substring(0, 30) + '...' : 'No messages yet'}</p>
                </div>
                ${unread.length > 0 ? `<span class="badge">${unread.length}</span>` : ''}
            `;

            item.addEventListener('click', () => {
                selectedReceiverId = client.id;
                showChat(client.fullname);
                loadMessages(client.id);
            });

            messageList.appendChild(item);
        });
    }

        async function loadMessages(receiverId) {
    // MASHAIR FIX - mark messages as read when opening chat
    await fetch(`${BACKEND_URL}/inbox/read/${receiverId}/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
    });

        const messages = await user.getMessages(currentUser.id); // MASHAIR FIX - was user.id
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = '';

        const filtered = messages.filter(msg =>
            (msg.sender_id === currentUser.id && msg.receiver_id === receiverId) || // MASHAIR FIX
            (msg.receiver_id === currentUser.id && msg.sender_id === receiverId)    // MASHAIR FIX
        );

        filtered.forEach(msg => {
            const div = document.createElement('div');
            div.className = msg.sender_id === currentUser.id ? 'chat-message right' : 'chat-message left'; // MASHAIR FIX
            div.textContent = msg.message_text;
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const backBtn = document.getElementById('backBtn');

    if (sendBtn) {
        sendBtn.addEventListener('click', async () => {
            const message = chatInput.value.trim();
            if (message !== '' && selectedReceiverId) {
                await user.sendMessage(currentUser.id, selectedReceiverId, message); // MASHAIR FIX - was user.id
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

    loadClients();
}