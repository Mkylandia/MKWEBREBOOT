// SEARCH
function search() {
    let q = document.getElementById("search").value;
    window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(q);
}

// TIME
function updateTime() {
    let now = new Date();
    document.getElementById("time").textContent = now.toLocaleTimeString();
    document.getElementById("date").textContent = now.toLocaleDateString("de-DE");
}
setInterval(updateTime, 1000);

// QUICK PICKS
function addQuickPick() {
    let name = quickName.value;
    let url = quickURL.value;
    let icon = quickIcon.value || "🌐";
    let color = quickColor.value || "#6366f1";

    let picks = JSON.parse(localStorage.getItem("picks")) || [];
    picks.push({ name, url, icon, color });

    localStorage.setItem("picks", JSON.stringify(picks));
    displayPicks();
}

function displayPicks() {
    let container = document.getElementById("quickList");
    container.innerHTML = "";

    let picks = JSON.parse(localStorage.getItem("picks")) || [];

    picks.forEach((p, i) => {
        let div = document.createElement("div");
        div.className = "quick-item";
        div.style.border = "2px solid " + p.color;
        div.innerHTML = `${p.icon} <br> ${p.name}`;

        div.onclick = () => window.location.href = p.url;

        div.oncontextmenu = (e) => {
            e.preventDefault();
            picks.splice(i,1);
            localStorage.setItem("picks", JSON.stringify(picks));
            displayPicks();
        };

        container.appendChild(div);
    });
}

// CUSTOM SETTINGS
function applySettings() {
    let title = customTitle.value;
    let bg = bgColor.value;
    let accent = accentColor.value;

    document.getElementById("title").textContent = title;

    document.body.style.background = bg;
    document.documentElement.style.setProperty('--accent', accent);

    localStorage.setItem("settings", JSON.stringify({title, bg, accent}));
}

function loadSettings() {
    let s = JSON.parse(localStorage.getItem("settings"));
    if (!s) return;

    title.textContent = s.title;
    document.body.style.background = s.bg;
    document.documentElement.style.setProperty('--accent', s.accent);
}

// THEME
themeToggle.onclick = () => {
    document.body.classList.toggle("light");
};

// INIT
window.onload = () => {
    updateTime();
    displayPicks();
    loadSettings();
};
