// Konfiguration & State
const state = {
    theme: localStorage.getItem('theme') || 'dark',
    settings: JSON.parse(localStorage.getItem('settings')) || { title: 'MKWEB', accent: '#6366f1' }
};

// INITIALISIERUNG
window.onload = () => {
    applyTheme(state.theme);
    displayPicks();
    loadSettingsUI();
    updateTime();
    setInterval(updateTime, 1000);
    
    // Enter-Taste für Suche
    document.getElementById('search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search();
    });
};

// TIME & DATE
function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById("time").textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById("date").textContent = now.toLocaleDateString("de-DE", options);
}

// SEARCH
function search() {
    const query = document.getElementById("search").value;
    if (query.trim() !== "") {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
}

// SETTINGS MODAL
function toggleSettings() {
    const modal = document.getElementById('settingsOverlay');
    modal.style.display = (modal.style.display === 'grid') ? 'none' : 'grid';
}

// QUICK PICKS
function addQuickPick() {
    let name = document.getElementById("quickName").value;
    let url = document.getElementById("quickURL").value;
    let icon = document.getElementById("quickIcon").value || "🌐";
    let color = document.getElementById("quickColor").value;

    if (!name || !url) return alert("Bitte Name und URL angeben!");
    
    // URL Validierung (fügt https hinzu falls fehlt)
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    const picks = JSON.parse(localStorage.getItem("picks")) || [];
    picks.push({ name, url, icon, color });
    localStorage.setItem("picks", JSON.stringify(picks));

    // Felder leeren
    document.getElementById("quickName").value = "";
    document.getElementById("quickURL").value = "";
    
    displayPicks();
}

function displayPicks() {
    const container = document.getElementById("quickList");
    container.innerHTML = "";
    const picks = JSON.parse(localStorage.getItem("picks")) || [];

    picks.forEach((p, i) => {
        const div = document.createElement("a");
        div.className = "quick-item";
        div.href = p.url;
        div.style.borderBottom = `4px solid ${p.color}`;
        div.innerHTML = `
            <span class="delete-hint">Rechtsklick zum Löschen</span>
            <div style="font-size: 2rem; margin-bottom: 10px;">${p.icon}</div>
            <div style="font-weight: 600;">${p.name}</div>
        `;

        div.oncontextmenu = (e) => {
            e.preventDefault();
            picks.splice(i, 1);
            localStorage.setItem("picks", JSON.stringify(picks));
            displayPicks();
        };
        container.appendChild(div);
    });
}

// SETTINGS APPLY
function applySettings() {
    const titleVal = document.getElementById("customTitle").value;
    const accentVal = document.getElementById("accentColor").value;

    state.settings.title = titleVal || state.settings.title;
    state.settings.accent = accentVal;

    localStorage.setItem("settings", JSON.stringify(state.settings));
    loadSettingsUI();
    toggleSettings();
}

function loadSettingsUI() {
    document.getElementById("title").textContent = state.settings.title;
    document.documentElement.style.setProperty('--accent', state.settings.accent);
}

// THEME TOGGLE
document.getElementById('themeToggle').onclick = () => {
    state.theme = (state.theme === 'dark') ? 'light' : 'dark';
    applyTheme(state.theme);
};

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
    document.getElementById('themeToggle').textContent = (theme === 'dark') ? '🌙' : '☀️';
}
