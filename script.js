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

function updateUI() {
    xpDisplay.textContent = xp;
    levelDisplay.textContent = level;
    xpFill.style.width = xp + "%";
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    checkAchievements();
    saveXPHistory();

    const ranks = ['FRESH RECRUIT','INITIATE','APPRENTICE','RISING FIGHTER','SKILLED WARRIOR','VETERAN FIGHTER','BATTLE HARDENED','ELITE CHAMPION','LEGENDARY WARRIOR'];
    const rankEl = document.getElementById("sidebar-rank");
    const lvlEl = document.getElementById("sidebar-lvl");
    if(rankEl) rankEl.textContent = level >= 50 ? ranks[8] : level >= 30 ? ranks[7] : level >= 20 ? ranks[6] : level >= 15 ? ranks[5] : level >= 10 ? ranks[4] : level >= 7 ? ranks[3] : level >= 5 ? ranks[2] : level >= 3 ? ranks[1] : ranks[0];
    if(lvlEl) lvlEl.textContent = "LVL " + level;
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
        dealBossDamage(index);

        document.getElementById("xpSound").play();

        xp += Number(btn.dataset.xp);
        addSpendableXP(Number(btn.dataset.xp));

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
    { id:"first_task", icon:"⚡", name:"First Blood", desc:"Complete your first task", check:() => doneTasks.length >= 1 },
    { id:"all_tasks", icon:"👑", name:"Grind King", desc:"Complete all tasks in one day", check:() => doneTasks.length >= 8 },
    { id:"level2", icon:"⚔️", name:"Level Up", desc:"Reach Level 2", check:() => level >= 2 },
    { id:"level5", icon:"🔥", name:"On Fire", desc:"Reach Level 5", check:() => level >= 5 },
    { id:"level10", icon:"💀", name:"Unstoppable", desc:"Reach Level 10", check:() => level >= 10 },
    { id:"coding_done", icon:"💻", name:"Hacker", desc:"Complete the Coding task", check:() => doneTasks.includes(3) },
    { id:"taekwondo_done", icon:"🥋", name:"Warrior", desc:"Complete Taekwondo", check:() => doneTasks.includes(2) },
    { id:"early_bird", icon:"🌅", name:"Early Bird", desc:"Complete Morning Walk", check:() => doneTasks.includes(0) },
    { id:"boss_slayer", icon:"💀", name:"Boss Slayer", desc:"Defeat your first boss", check:() => defeatedBosses.length >= 1 },
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

// ── BOSS BATTLE ───────────────────────────────────────

const BOSSES = [
    { id:"sloth", emoji:"🦥", name:"Lord of Laziness", desc:"Defeat laziness by moving your body", hp:100, reward:150, damageFrom:[0,1,4,5,6,7] },
    { id:"ignorance", emoji:"📖", name:"The Ignorance Dragon", desc:"Slay ignorance with knowledge", hp:150, reward:200, damageFrom:[3,4] },
    { id:"weakness", emoji:"💀", name:"Weakness Demon", desc:"Destroy weakness through combat", hp:200, reward:300, damageFrom:[1,2,5] },
    { id:"final", emoji:"🔥", name:"The Final Boss", desc:"Complete ALL tasks to defeat him", hp:500, reward:1000, damageFrom:[0,1,2,3,4,5,6,7] },
];

const TASK_DAMAGE = [10, 20, 30, 25, 15, 15, 15, 15];

let bossState = JSON.parse(localStorage.getItem("bossState") || "null");
let defeatedBosses = JSON.parse(localStorage.getItem("defeatedBosses") || "[]");

function saveBossState() {
    localStorage.setItem("bossState", JSON.stringify(bossState));
    localStorage.setItem("defeatedBosses", JSON.stringify(defeatedBosses));
}

function renderBossPage() { renderBossList(); renderActiveBoss(); }

function renderBossList() {
    const list = document.getElementById("boss-list");
    if(!list) return;
    list.innerHTML = "";
    BOSSES.forEach(boss => {
        const isDefeated = defeatedBosses.includes(boss.id);
        const isActive = bossState && bossState.id === boss.id;
        const div = document.createElement("div");
        div.className = "boss-option" + (isActive ? " active-boss" : "") + (isDefeated ? " defeated" : "");
        div.innerHTML = `
            <div class="boss-option-emoji">${boss.emoji}</div>
            <div class="boss-option-info">
                <div class="boss-option-name">${boss.name}</div>
                <div class="boss-option-meta">${isDefeated ? "DEFEATED" : boss.desc}</div>
            </div>
            <div class="boss-option-xp">+${boss.reward} XP</div>
        `;
        if(!isDefeated && !isActive) div.onclick = () => startBoss(boss.id);
        list.appendChild(div);
    });
}

function startBoss(bossId) {
    const boss = BOSSES.find(b => b.id === bossId);
    if(!boss) return;
    if(bossState && bossState.hp > 0){
        if(!confirm("You have an active boss. Abandon it and start a new one?")) return;
    }
    bossState = { id: boss.id, hp: boss.hp };
    saveBossState();
    renderBossPage();
    showToast("⚔️ " + boss.name + " appeared!");
}

function renderActiveBoss() {
    const emojiEl = document.getElementById("boss-emoji");
    const nameEl = document.getElementById("boss-name");
    const descEl = document.getElementById("boss-desc");
    const hpText = document.getElementById("boss-hp-text");
    const hpBar = document.getElementById("boss-hp-bar");
    const rewardEl = document.getElementById("boss-reward");
    if(!emojiEl) return;
    if(!bossState){
        emojiEl.textContent = "👹";
        nameEl.textContent = "No Active Boss";
        descEl.textContent = "Select a boss below to begin";
        hpText.textContent = "— / —";
        hpBar.style.width = "100%";
        rewardEl.textContent = "🏆 Reward: — XP";
        return;
    }
    const boss = BOSSES.find(b => b.id === bossState.id);
    if(!boss) return;
    const hpPercent = Math.max(0, (bossState.hp / boss.hp) * 100);
    emojiEl.textContent = boss.emoji;
    nameEl.textContent = boss.name;
    descEl.textContent = boss.desc;
    hpText.textContent = bossState.hp + " / " + boss.hp;
    hpBar.style.width = hpPercent + "%";
    rewardEl.textContent = "🏆 Reward: " + boss.reward + " XP";
}

function dealBossDamage(taskIndex) {
    if(!bossState) return;
    const boss = BOSSES.find(b => b.id === bossState.id);
    if(!boss) return;
    if(!boss.damageFrom.includes(taskIndex)) return;
    const damage = TASK_DAMAGE[taskIndex] || 10;
    bossState.hp -= damage;
    const statusEl = document.getElementById("boss-status");
    if(bossState.hp <= 0){
        bossState.hp = 0;
        saveBossState();
        defeatedBosses.push(boss.id);
        bossState = null;
        saveBossState();
        xp += boss.reward;
        addSpendableXP(boss.reward);
        while(xp >= 100){ xp -= 100; level++; showLevelUp(level); }
        updateUI();
        showToast("💀 " + boss.name + " DEFEATED! +" + boss.reward + " XP!");
        if(statusEl) statusEl.textContent = "💀 BOSS DEFEATED!";
        if(!unlockedAchievements.includes("boss_slayer")){
            unlockedAchievements.push("boss_slayer");
            localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
            showToast("🏆 Boss Slayer — Defeat your first boss");
        }
    } else {
        saveBossState();
        if(statusEl) statusEl.textContent = "⚔️ -" + damage + " damage dealt!";
        setTimeout(() => { if(statusEl) statusEl.textContent = ""; }, 2000);
    }
    renderBossPage();
}

// ── STATS & XP HISTORY ───────────────────────────────

function saveXPHistory() {
    const todayKey = new Date().toISOString().split("T")[0];
    let history = JSON.parse(localStorage.getItem("xpHistory") || "{}");
    const todayXP = doneTasks.reduce((sum, idx) => {
        const btns = document.querySelectorAll(".task");
        return sum + (btns[idx] ? Number(btns[idx].dataset.xp) : 0);
    }, 0);
    history[todayKey] = todayXP;
    localStorage.setItem("xpHistory", JSON.stringify(history));
}

let xpChart = null;
let currentTab = "week";

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll(".stats-tab").forEach(btn => btn.classList.remove("active-tab"));
    event.target.classList.add("active-tab");
    renderChart();
}

function renderChart() {
    const history = JSON.parse(localStorage.getItem("xpHistory") || "{}");
    const labels = [], data = [];
    const now = new Date();
    if(currentTab === "week"){
        for(let i = 6; i >= 0; i--){
            const d = new Date(now); d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0];
            labels.push(d.toLocaleDateString("en", { weekday: "short" }));
            data.push(history[key] || 0);
        }
    } else if(currentTab === "month"){
        for(let i = 29; i >= 0; i--){
            const d = new Date(now); d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0];
            labels.push(d.getDate() + "/" + (d.getMonth()+1));
            data.push(history[key] || 0);
        }
    } else if(currentTab === "year"){
        for(let i = 11; i >= 0; i--){
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0");
            labels.push(d.toLocaleDateString("en", { month: "short" }));
            const monthTotal = Object.entries(history).reduce((sum, [date, xp]) => date.startsWith(monthKey) ? sum + xp : sum, 0);
            data.push(monthTotal);
        }
    }
    if(xpChart) xpChart.destroy();
    const ctx = document.getElementById("xpChart").getContext("2d");
    xpChart = new Chart(ctx, {
        type: "bar",
        data: { labels, datasets: [{ label: "XP Earned", data, backgroundColor: data.map(v => v > 0 ? "rgba(255,211,0,0.7)" : "rgba(255,255,255,0.05)"), borderColor: data.map(v => v > 0 ? "#FFD300" : "#222"), borderWidth: 2, borderRadius: 6 }] },
        options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.parsed.y + " XP" } } }, scales: { x: { ticks: { color: "#666", font: { size: 11 } }, grid: { color: "#1a1a1a" } }, y: { ticks: { color: "#666" }, grid: { color: "#1a1a1a" }, beginAtZero: true } } }
    });
    renderStatsSummary(history);
}

function renderStatsSummary(history) {
    const summary = document.getElementById("stats-summary");
    if(!summary) return;
    const values = Object.values(history);
    const total = values.reduce((a, b) => a + b, 0);
    const best = values.length ? Math.max(...values) : 0;
    const daysActive = values.filter(v => v > 0).length;
    summary.innerHTML = `
        <div class="stat-box"><div class="stat-box-val">${total}</div><div class="stat-box-lbl">TOTAL XP</div></div>
        <div class="stat-box"><div class="stat-box-val">${best}</div><div class="stat-box-lbl">BEST DAY</div></div>
        <div class="stat-box"><div class="stat-box-val">${daysActive}</div><div class="stat-box-lbl">DAYS ACTIVE</div></div>
        <div class="stat-box"><div class="stat-box-val">${level}</div><div class="stat-box-lbl">CURRENT LVL</div></div>
    `;
}

// ── PROFILE ───────────────────────────────────────────

function getHeroTitle(lvl) {
    if(lvl >= 50) return "LEGENDARY WARRIOR";
    if(lvl >= 30) return "ELITE CHAMPION";
    if(lvl >= 20) return "BATTLE HARDENED";
    if(lvl >= 15) return "VETERAN FIGHTER";
    if(lvl >= 10) return "SKILLED WARRIOR";
    if(lvl >= 7)  return "RISING FIGHTER";
    if(lvl >= 5)  return "APPRENTICE";
    if(lvl >= 3)  return "INITIATE";
    return "FRESH RECRUIT";
}

function renderProfile() {
    const container = document.getElementById("profile-container");
    if(!container) return;
    const history = JSON.parse(localStorage.getItem("xpHistory") || "{}");
    const values = Object.values(history);
    const totalXP = values.reduce((a, b) => a + b, 0);
    const daysActive = values.filter(v => v > 0).length;
    const bossesDefeated = defeatedBosses.length;
    const achievementsUnlocked = unlockedAchievements.length;
    const heroTitle = getHeroTitle(level);
    const recentBadges = unlockedAchievements.slice(-3).map(id => {
        const a = ACHIEVEMENTS.find(a => a.id === id);
        return a ? `<div class="profile-badge">${a.icon} ${a.name}</div>` : "";
    }).join("");
    container.innerHTML = `
        <div class="profile-hero-card">
            <div class="profile-avatar">⚔️</div>
            <div class="profile-name">SOUMIK</div>
            <div class="profile-title">${heroTitle}</div>
            <div class="profile-level-badge">LEVEL ${level}</div>
            <div class="profile-xp-bar-wrap">
                <div class="profile-xp-bar-inner" style="width:${xp}%"></div>
            </div>
            <div class="profile-xp-label">${xp} / 100 XP to next level</div>
        </div>
        <div class="profile-stats-grid">
            <div class="profile-stat"><div class="profile-stat-val">${totalXP}</div><div class="profile-stat-lbl">TOTAL XP</div></div>
            <div class="profile-stat"><div class="profile-stat-val">${daysActive}</div><div class="profile-stat-lbl">DAYS ACTIVE</div></div>
            <div class="profile-stat"><div class="profile-stat-val">${bossesDefeated}</div><div class="profile-stat-lbl">BOSSES SLAIN</div></div>
            <div class="profile-stat"><div class="profile-stat-val">${achievementsUnlocked}</div><div class="profile-stat-lbl">ACHIEVEMENTS</div></div>
        </div>
        <div class="profile-recent">
            <div class="profile-recent-title">— RECENT ACHIEVEMENTS —</div>
            <div class="profile-badge-row">
                ${recentBadges || '<div class="profile-empty">No achievements yet. Get grinding! 💪</div>'}
            </div>
        </div>
    `;
}

// ── XP SHOP ───────────────────────────────────────────

const SHOP_ITEMS = [
    { id:"gaming", icon:"🎮", name:"1 Hour Gaming", cost:50 },
    { id:"cheatmeal", icon:"🍕", name:"Cheat Meal", cost:75 },
    { id:"netflix", icon:"📺", name:"Netflix Binge", cost:60 },
    { id:"sleep", icon:"😴", name:"Sleep In Late", cost:40 },
    { id:"buy", icon:"🛍️", name:"Buy Something", cost:200 },
    { id:"phonebreak", icon:"📵", name:"Phone Break", cost:30 },
];

let spendableXP = parseInt(localStorage.getItem("spendableXP")) || 0;
let purchaseHistory = JSON.parse(localStorage.getItem("purchaseHistory") || "[]");

function saveShopState() {
    localStorage.setItem("spendableXP", spendableXP);
    localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));
}

function addSpendableXP(amount) {
    spendableXP += amount;
    saveShopState();
    const shopCount = document.getElementById("shop-xp-count");
    if(shopCount) shopCount.textContent = spendableXP;
}

function buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if(!item) return;
    if(spendableXP < item.cost){ showToast("❌ Not enough XP! Need " + item.cost + " XP"); return; }
    if(!confirm("Spend " + item.cost + " XP on " + item.name + "?")) return;
    spendableXP -= item.cost;
    purchaseHistory.push({ id:itemId, name:item.name, cost:item.cost, date:new Date().toLocaleDateString() });
    saveShopState();
    showToast("✅ Enjoyed: " + item.name + " 🎉");
    renderShop();
}

function renderShop() {
    const grid = document.getElementById("shop-grid");
    if(!grid) return;
    const shopCount = document.getElementById("shop-xp-count");
    if(shopCount) shopCount.textContent = spendableXP;
    grid.innerHTML = "";
    SHOP_ITEMS.forEach(item => {
        const canAfford = spendableXP >= item.cost;
        const timesBought = purchaseHistory.filter(p => p.id === item.id).length;
        const card = document.createElement("div");
        card.className = "shop-card" + (!canAfford ? " cant-afford" : "");
        card.innerHTML = `
            <div class="shop-icon">${item.icon}</div>
            <div class="shop-name">${item.name}</div>
            <div class="shop-cost">💰 ${item.cost} XP</div>
            <button class="shop-btn" onclick="buyItem('${item.id}')" ${!canAfford ? "disabled" : ""}>
                ${canAfford ? "BUY" : "NEED " + item.cost + " XP"}
            </button>
            ${timesBought > 0 ? `<div class="shop-purchased">BOUGHT ${timesBought}x</div>` : ""}
        `;
        grid.appendChild(card);
    });
}

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
    sidebar.style.left = "-260px";
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
    document.querySelectorAll(".page").forEach(page => page.style.display = "none");
    const target = document.getElementById("page-" + pageId);
    if(target) target.style.display = "block";
    if(pageId === "boss") renderBossPage();
    if(pageId === "stats") renderChart();
    if(pageId === "profile") renderProfile();
    if(pageId === "shop") renderShop();
    document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if(activeLink) activeLink.classList.add("active");
    closeSidebar();
}

document.querySelectorAll(".sidebar ul li").forEach(li => {
    li.addEventListener("click", () => {
        const page = li.dataset.page;
        if(page === "logout"){
            if(confirm("Log out and reset progress?")) { localStorage.clear(); location.reload(); }
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
if(savedTheme === "light") document.documentElement.setAttribute("data-theme", "light");

// ── INIT ──────────────────────────────────────────────

updateUI();
navigateTo("dashboard");
