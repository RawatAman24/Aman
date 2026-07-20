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
let currentIndex = null;
// Render Chat List
function renderChats() {
    chatList.innerHTML = "";
    chats.forEach((chat, index) => {
        const chatDiv = document.createElement("div");
        chatDiv.className = "chat";
        if (index === currentIndex) {
            chatDiv.classList.add("active");
        }
        chatDiv.innerHTML = `
            <img src="${chat.img}" alt="${chat.name}">
            <div class="chat-info">
                <div class="name">${chat.name}</div>
                <div class="last">${chat.last}</div>
            </div>
            <div class="time">${chat.time}</div>
        `;
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
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
function sendMessage() {
    if (currentIndex === null) {
        alert("Please select a chat first.");
        return;
    }
    const text = msgInput.value.trim();
    if (text === "") return;
    const currentUser = chats[currentIndex];
    // Save message
    currentUser.messages.push({
        text: text,
        type: "sent"
    });
    // Update last message
    currentUser.last = text;
    openChat(currentIndex);
    msgInput.value = "";
    // Fake reply after 1 second
    setTimeout(() => {
        currentUser.messages.push({
            text: "Received: " + text,
            type: "received"
        });
        currentUser.last = "Received: " + text;
        openChat(currentIndex);
    }, 1000);
}