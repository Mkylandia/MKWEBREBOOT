// CONFIGURATION
const PRESETS = [
    { name: "YouTube", url: "https://youtube.com", icon: "🎬", color: "#ff0000" },
    { name: "Twitch", url: "https://twitch.tv", icon: "🟣", color: "#9146ff" },
    { name: "Discord", url: "https://discord.com", icon: "💬", color: "#5865f2" },
    { name: "Reddit", url: "https://reddit.com", icon: "🟠", color: "#ff4500" },
    { name: "GitHub", url: "https://github.com", icon: "🐙", color: "#6e5494" },
    { name: "ChatGPT", url: "https://chatgpt.com", icon: "✨", color: "#10a37f" }
];

const QUICK_EMOJIS = ["🚀", "🎮", "📺", "🎧", "🔥", "🛠️", "📸", "🍔", "💡", "💰", "🌐", "⚡"];

let state = {
    theme: localStorage.getItem('theme') || 'dark',
    settings: JSON.parse(localStorage.getItem('settings')) || { title: 'MKWEB', accent: '#6366f1' },
    selectedEmoji: "🌐"
};

// INIT
window.onload = () => {
    initPicks();
    renderPresets();
    renderEmojiPicker();
    applyState();
    updateTime();
    setInterval(updateTime, 1000);
    
    document.getElementById('search').addEventListener('keypress', (e) => e.key === 'Enter' && search());
};

function initPicks() {
    let picks = JSON.parse(localStorage.getItem("picks")) || PRESETS;
    if (!localStorage.getItem("picks")) localStorage.setItem("picks", JSON.stringify(picks));
    displayPicks();
}

function renderEmojiPicker() {
    const cont = document.getElementById("emojiPicker");
    QUICK_EMOJIS.forEach(e => {
        const span = document.createElement("span");
        span.className = "emoji-item";
        span.textContent = e;
        span.onclick = () => {
            state.selectedEmoji = e;
            document.querySelectorAll(".emoji-item").forEach(el => el.style.background = "none");
            span.style.background = "var(--glass-heavy)";
            span.style.borderRadius = "8px";
        };
        cont.appendChild(span);
    });
}

function renderPresets() {
    const cont = document.getElementById("presetContainer");
    PRESETS.forEach(p => {
        const b = document.createElement("button");
        b.className = "preset-btn";
        b.style.borderLeft = `3px solid ${p.color}`;
        b.innerHTML = `${p.icon} ${p.name}`;
        b.onclick = () => savePick(p);
        cont.appendChild(b);
    });
}

function savePick(item) {
    const picks = JSON.parse(localStorage.getItem("picks")) || [];
    picks.push(item);
    localStorage.setItem("picks", JSON.stringify(picks));
    displayPicks();
}

function addQuickPick() {
    const name = document.getElementById("quickName").value;
    let url = document.getElementById("quickURL").value;
    if(!name || !url) return;
    if(!url.startsWith('http')) url = 'https://' + url;
    
    savePick({ name, url, icon: state.selectedEmoji, color: document.getElementById("quickColor").value });
    document.getElementById("quickName").value = "";
    document.getElementById("quickURL").value = "";
}

function displayPicks() {
    const cont = document.getElementById("quickList");
    cont.innerHTML = "";
    const picks = JSON.parse(localStorage.getItem("picks")) || [];

    picks.forEach((p, i) => {
        const a = document.createElement("a");
        a.className = "icon-card";
        a.href = p.url;
        // STAGGERED ANIMATION DELAY
        a.style.animationDelay = `${i * 0.05}s`;
        a.style.borderBottom = `3px solid ${p.color}`;
        a.innerHTML = `<div class="emoji">${p.icon}</div><span>${p.name}</span>`;
        
        a.oncontextmenu = (e) => {
            e.preventDefault();
            picks.splice(i, 1);
            localStorage.setItem("picks", JSON.stringify(picks));
            displayPicks();
        };
        cont.appendChild(a);
    });
}

function liveUpdate() {
    state.settings.title = document.getElementById("customTitle").value || "MKWEB";
    state.settings.accent = document.getElementById("accentColor").value;
    localStorage.setItem("settings", JSON.stringify(state.settings));
    applyState();
}

function applyState() {
    document.body.className = state.theme;
    document.getElementById("title").textContent = state.settings.title;
    document.documentElement.style.setProperty('--accent', state.settings.accent);
    document.getElementById("customTitle").value = state.settings.title;
    document.getElementById("accentColor").value = state.settings.accent;
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    applyState();
}

function toggleSettings() {
    const m = document.getElementById("settingsOverlay");
    m.style.display = m.style.display === "grid" ? "none" : "grid";
}

function search() {
    const q = document.getElementById("search").value;
    if(q) window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function updateTime() {
    const now = new Date();
    document.getElementById("time").textContent = now.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
    document.getElementById("date").textContent = now.toLocaleDateString('de-DE', {weekday:'long', day:'2-digit', month:'long'});
}

function closeSettings(e) { if(e.target.id === "settingsOverlay") toggleSettings(); }
