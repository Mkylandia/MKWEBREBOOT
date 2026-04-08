// PRELOADED DATA
const PRESETS = [
    { name: "YouTube", url: "https://youtube.com", icon: "📺", color: "#ff0000" },
    { name: "GitHub", url: "https://github.com", icon: "🐙", color: "#6e5494" },
    { name: "Netflix", url: "https://netflix.com", icon: "🎬", color: "#e50914" },
    { name: "ChatGPT", url: "https://chatgpt.com", icon: "🤖", color: "#10a37f" },
    { name: "Twitch", url: "https://twitch.tv", icon: "🟣", color: "#9146ff" },
    { name: "Reddit", url: "https://reddit.com", icon: "🧡", color: "#ff4500" }
];

let state = {
    theme: localStorage.getItem('theme') || 'dark',
    settings: JSON.parse(localStorage.getItem('settings')) || { title: 'MKWEB', accent: '#6366f1' }
};

window.onload = () => {
    initPicks();
    renderPresets();
    applyState();
    updateTime();
    setInterval(updateTime, 1000);

    // Search on Enter
    document.getElementById('search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search();
    });
};

// INITIALIZE PICKS (Preload)
function initPicks() {
    let picks = JSON.parse(localStorage.getItem("picks"));
    if (!picks || picks.length === 0) {
        localStorage.setItem("picks", JSON.stringify(PRESETS.slice(0, 4)));
    }
    displayPicks();
}

// LIVE UPDATE SETTINGS
function liveUpdateSettings() {
    const title = document.getElementById("customTitle").value || "MKWEB";
    const accent = document.getElementById("accentColor").value;
    
    document.getElementById("title").textContent = title;
    document.documentElement.style.setProperty('--accent', accent);
    
    state.settings = { title, accent };
    localStorage.setItem("settings", JSON.stringify(state.settings));
}

// QUICK PICK LOGIK
function renderPresets() {
    const container = document.getElementById("presetContainer");
    PRESETS.forEach(p => {
        const btn = document.createElement("button");
        btn.className = "preset-btn";
        btn.innerHTML = `${p.icon} ${p.name}`;
        btn.onclick = () => fastAdd(p);
        container.appendChild(btn);
    });
}

function fastAdd(item) {
    const picks = JSON.parse(localStorage.getItem("picks")) || [];
    picks.push(item);
    localStorage.setItem("picks", JSON.stringify(picks));
    displayPicks();
}

function addQuickPick() {
    const name = document.getElementById("quickName").value;
    let url = document.getElementById("quickURL").value;
    const icon = document.getElementById("quickIcon").value || "🌐";
    const color = document.getElementById("quickColor").value;

    if (!name || !url) return;
    if (!url.startsWith('http')) url = 'https://' + url;

    fastAdd({ name, url, icon, color });
    document.getElementById("quickName").value = "";
    document.getElementById("quickURL").value = "";
}

function displayPicks() {
    const container = document.getElementById("quickList");
    container.innerHTML = "";
    const picks = JSON.parse(localStorage.getItem("picks")) || [];

    picks.forEach((p, i) => {
        const a = document.createElement("a");
        a.className = "quick-item";
        a.href = p.url;
        a.style.borderTop = `2px solid ${p.color}`;
        a.innerHTML = `<span>${p.icon}</span><small>${p.name}</small>`;
        
        a.oncontextmenu = (e) => {
            e.preventDefault();
            picks.splice(i, 1);
            localStorage.setItem("picks", JSON.stringify(picks));
            displayPicks();
        };
        container.appendChild(a);
    });
}

// THEME & CORE
function applyState() {
    document.body.className = state.theme;
    document.getElementById("title").textContent = state.settings.title;
    document.getElementById("customTitle").value = state.settings.title;
    document.getElementById("accentColor").value = state.settings.accent;
    document.documentElement.style.setProperty('--accent', state.settings.accent);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    applyState();
}

function toggleSettings() {
    const modal = document.getElementById("settingsOverlay");
    modal.style.display = modal.style.display === "grid" ? "none" : "grid";
}

function closeSettings(e) {
    if(e.target.id === "settingsOverlay") toggleSettings();
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
