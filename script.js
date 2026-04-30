// ── DAILY RESET ─────────────────────────────

const today = new Date().toDateString();
const lastDate = localStorage.getItem("lastDate");

if (today !== lastDate) {
    localStorage.setItem("xp", 0);
    localStorage.setItem("lastDate", today);
    localStorage.removeItem("doneTasks");
}

// ── STATE ─────────────────────────────

let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;

const xpDisplay = document.getElementById("xp");
const levelDisplay = document.getElementById("level");
const xpFill = document.getElementById("xp-fill");

// ── UPDATE UI (FIXED) ─────────────────────────────

function updateUI() {
    xpDisplay.textContent = xp;
    levelDisplay.textContent = level;

    // ✅ FIXED progress bar
    xpFill.style.width = (xp / 100) * 100 + "%";

    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);

    checkAchievements();
    saveXPHistory();

    const ranks = [
        'FRESH RECRUIT','INITIATE','APPRENTICE','RISING FIGHTER',
        'SKILLED WARRIOR','VETERAN FIGHTER','BATTLE HARDENED',
        'ELITE CHAMPION','LEGENDARY WARRIOR'
    ];

    const rankEl = document.getElementById("sidebar-rank");
    const lvlEl = document.getElementById("sidebar-lvl");

    if (rankEl) {
        rankEl.textContent =
            level >= 50 ? ranks[8] :
            level >= 30 ? ranks[7] :
            level >= 20 ? ranks[6] :
            level >= 15 ? ranks[5] :
            level >= 10 ? ranks[4] :
            level >= 7  ? ranks[3] :
            level >= 5  ? ranks[2] :
            level >= 3  ? ranks[1] :
            ranks[0];
    }

    if (lvlEl) lvlEl.textContent = "LVL " + level;
}

// ── TASK SYSTEM (FIXED TEXT BUG) ─────────────────────────────

let doneTasks = JSON.parse(localStorage.getItem("doneTasks") || "[]");

document.querySelectorAll(".task").forEach((btn, index) => {

    if (doneTasks.includes(index)) {
        btn.classList.add("done");
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = "✅ " + btn.innerHTML; // ✅ FIX
    }

    btn.addEventListener("click", () => {
        if (btn.classList.contains("done")) return;

        btn.classList.add("done");
        btn.style.opacity = "0.4";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = "✅ " + btn.innerHTML; // ✅ FIX

        doneTasks.push(index);
        localStorage.setItem("doneTasks", JSON.stringify(doneTasks));

        dealBossDamage(index);

        const xpValue = Number(btn.dataset.xp);
        xp += xpValue;

        addSpendableXP(xpValue);

        // ✅ FIXED LEVEL LOGIC
        if (xp >= 100) {
            xp -= 100;
            level++;
            showLevelUp(level);
        }

        updateUI();
    });
});

// ── SIDEBAR (FULL FIX) ─────────────────────────────

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");

menuBtn.onclick = () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
};

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

overlay.onclick = closeSidebar;

// ── NAVIGATION FIX ─────────────────────────────

function navigateTo(pageId) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");

    const target = document.getElementById("page-" + pageId);
    if (target) target.style.display = "block";

    if (pageId === "boss") renderBossPage();
    if (pageId === "stats") renderChart();
    if (pageId === "profile") renderProfile();
    if (pageId === "shop") renderShop();

    closeSidebar();
}

// ── INIT ─────────────────────────────

updateUI();
navigateTo("dashboard");
