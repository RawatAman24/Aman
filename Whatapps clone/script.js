const chats = [
    {
        name: "Raj patel",
        last: "Hey! How are you?",
        time: "10:38 AM",
        messages: [
            { text: "Hey Hello to Raj Patel", type: "received" }
        ]
    },
    {
        name: "Akshay",
        last: "I will call you later",
        time: "10:20 AM",
        img: "https://i.pravatar.cc/50?img=2",
        messages: [
            { text: "Hey Hello to Akshay", type: "received" }
        ]
    },
    {
        name: "Aman",
        last: "Let's meet tomorrow",
        time: "9:45 AM",
        messages: [
            { text: "Hey Hello to Aman", type: "received" }
        ]
    },
    {
        name: "Vikash",
        last: "Thank you! 😊",
        time: "9:30 AM",
        img: "https://i.pravatar.cc/50?img=4",
        messages: [
            { text: "Hey Hello to Vikash", type: "received" }
        ]
    },
    {
        name: "Ankit",
        last: "Okay, good night",
        time: "9:10 PM",
        messages: [
            { text: "Hey Hello to Ankit", type: "received" }
        ]
    }
];
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const msgForm = document.getElementById("msgForm");
const searchInput = document.getElementById("search");
let currentIndex = null;
// Render Chat List
function renderChats(filter = "") {
    chatList.innerHTML = "";
    chats.forEach((chat, index) => {
        if (filter && !chat.name.toLowerCase().includes(filter.toLowerCase()) && !chat.last.toLowerCase().includes(filter.toLowerCase())) return;
        const chatDiv = document.createElement("div");
        chatDiv.className = "chat";
        if (index === currentIndex) chatDiv.classList.add("active");

        const avatar = chat.img || `https://i.pravatar.cc/48?u=${encodeURIComponent(chat.name)}`;
        const img = document.createElement('img');
        img.src = avatar;
        img.alt = chat.name + ' avatar';
        img.onerror = function () { this.src = 'https://via.placeholder.com/48?text=' + (chat.name ? chat.name[0] : '?'); };

        const info = document.createElement('div');
        info.className = 'chat-info';
        info.innerHTML = `<div class="name">${chat.name}</div><div class="last">${chat.last}</div>`;

        const time = document.createElement('div');
        time.className = 'time';
        time.textContent = chat.time || '';

        chatDiv.appendChild(img);
        chatDiv.appendChild(info);
        chatDiv.appendChild(time);

        chatDiv.onclick = () => openChat(index);
        chatList.appendChild(chatDiv);
    });
}
renderChats();
// Open Chat
function openChat(index) {
    currentIndex = index;
    const currentUser = chats[index];
    const headerName = document.querySelector(".chat-header .name");
    if (headerName) {
        headerName.textContent = currentUser.name;
    }
    messages.innerHTML = "";
    currentUser.messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = `message ${msg.type}`;
        div.textContent = msg.text;
        messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
    renderChats();
}
// Send Message
// Handle message sending via form submit
msgForm.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage();
});

// Optional search
if (searchInput) {
    searchInput.addEventListener('input', (e) => renderChats(e.target.value));
}

function sendMessage() {
    if (currentIndex === null) {
        alert("Please select a chat first.");
        return;
    }
    const text = msgInput.value.trim();
    if (!text) return;
    const currentUser = chats[currentIndex];
    currentUser.messages.push({text, type: 'sent'});
    currentUser.last = text;
    openChat(currentIndex);
    msgInput.value = '';
    // Fake automated reply
    setTimeout(() => {
        currentUser.messages.push({text: 'Received: ' + text, type: 'received'});
        currentUser.last = 'Received: ' + text;
        openChat(currentIndex);
    }, 900);
}

// Improve initial accessibility focus
document.addEventListener('keydown', (e) => {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        searchInput?.focus();
        e.preventDefault();
    }
});