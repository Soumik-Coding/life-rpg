const today = new Date().toDateString();
const lastDate = localStorage.getItem("lastDate");

if(today !== lastDate){
    localStorage.setItem("xp", 0);
    localStorage.setItem("lastDate", today);
    localStorage.removeItem("doneTasks");
}

let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;

const xpDisplay = document.getElementById("xp");
const levelDisplay = document.getElementById("level");
const xpFill = document.getElementById("xp-fill");

// ✅ single updateUI with checkAchievements
function updateUI() {
    xpDisplay.textContent = xp;
    levelDisplay.textContent = level;
    xpFill.style.width = xp + "%";
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    checkAchievements();
}

let doneTasks = JSON.parse(localStorage.getItem("doneTasks") || "[]");

document.querySelectorAll(".task").forEach((btn, index) => {

    if(doneTasks.includes(index)){
        btn.classList.add("done");
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
        btn.textContent = "✅ " + btn.textContent;
    }

    btn.addEventListener("click", () => {
        if(btn.classList.contains("done")) return;

        btn.classList.add("done");
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
        btn.textContent = "✅ " + btn.textContent;

        doneTasks.push(index);
        localStorage.setItem("doneTasks", JSON.stringify(doneTasks));

        document.getElementById("xpSound").play();

        xp += Number(btn.dataset.xp);

        if(xp >= 100){
            xp = 0;
            level++;
            document.getElementById("levelSound").play();
            showLevelUp(level);
        }

        updateUI();
    });
});

// ── ACHIEVEMENTS ──────────────────────────────────────

const ACHIEVEMENTS = [
    {
        id: "first_task",
        icon: "⚡",
        name: "First Blood",
        desc: "Complete your first task",
        check: () => doneTasks.length >= 1
    },
    {
        id: "all_tasks",
        icon: "👑",
        name: "Grind King",
        desc: "Complete all tasks in one day",
        check: () => doneTasks.length >= 8
    },
    {
        id: "level2",
        icon: "⚔️",
        name: "Level Up",
        desc: "Reach Level 2",
        check: () => level >= 2
    },
    {
        id: "level5",
        icon: "🔥",
        name: "On Fire",
        desc: "Reach Level 5",
        check: () => level >= 5
    },
    {
        id: "level10",
        icon: "💀",
        name: "Unstoppable",
        desc: "Reach Level 10",
        check: () => level >= 10
    },
    {
        id: "coding_done",
        icon: "💻",
        name: "Hacker",
        desc: "Complete the Coding task",
        check: () => doneTasks.includes(3)
    },
    {
        id: "taekwondo_done",
        icon: "🥋",
        name: "Warrior",
        desc: "Complete Taekwondo",
        check: () => doneTasks.includes(2)
    },
    {
        id: "early_bird",
        icon: "🌅",
        name: "Early Bird",
        desc: "Complete Morning Walk",
        check: () => doneTasks.includes(0)
    },
];

let unlockedAchievements = JSON.parse(localStorage.getItem("achievements") || "[]");

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if(unlockedAchievements.includes(achievement.id)) return;
        if(achievement.check()){
            unlockedAchievements.push(achievement.id);
            localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
            showToast("🏆 " + achievement.name + " — " + achievement.desc);
        }
    });
    renderAchievements();
}

function renderAchievements() {
    const grid = document.getElementById("achievements-grid");
    if(!grid) return;
    grid.innerHTML = "";
    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const card = document.createElement("div");
        card.className = "achievement-card " + (isUnlocked ? "unlocked" : "locked");
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${isUnlocked ? achievement.desc : "???"}</div>
        `;
        grid.appendChild(card);
    });
}

renderAchievements();

// ── SIDEBAR ──────────────────────────────────────────

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeSidebar");

menuBtn.onclick = () => {
    sidebar.style.left = "0";
    overlay.style.display = "block";
};

function closeSidebar() {
    sidebar.style.left = "-240px";
    overlay.style.display = "none";
}

closeBtn.onclick = closeSidebar;
overlay.onclick = closeSidebar;

function showLevelUp(newLevel) {
    const popup = document.getElementById("levelUpPopup");
    const text = document.getElementById("levelUpText");
    text.textContent = "You reached Level " + newLevel;
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("show"), 50);
}

function navigateTo(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    const target = document.getElementById("page-" + pageId);
    if(target) target.style.display = "block";
    document.querySelectorAll(".sidebar ul li").forEach(li => {
        li.classList.remove("active");
    });
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if(activeLink) activeLink.classList.add("active");
    closeSidebar();
}

document.querySelectorAll(".sidebar ul li").forEach(li => {
    li.addEventListener("click", () => {
        const page = li.dataset.page;
        if(page === "logout"){
            if(confirm("Log out and reset progress?")) {
                localStorage.clear();
                location.reload();
            }
            return;
        }
        navigateTo(page);
    });
});

// ── THEME ─────────────────────────────────────────────

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    if(current === "light"){
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
}

const savedTheme = localStorage.getItem("theme");
if(savedTheme === "light"){
    document.documentElement.setAttribute("data-theme", "light");
}

// ── INIT ──────────────────────────────────────────────

updateUI();
navigateTo("dashboard");