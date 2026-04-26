:root {
    --bg: #111111;
    --text: #ffffff;
}

[data-theme="light"] {
    --bg: #ffffff;
    --text: #111111;
}

body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: Consolas, sans-serif;
    text-align: center;
}

.title {
    margin-top: 40px;
    font-size: 34px;
    color: #FFD300;
    text-shadow: 0px 0px 12px yellow;
}

.xp-section {
    margin-top: 20px;
}

.xp-bar {
    width: 60%;
    height: 25px;
    background: #333;
    margin: auto;
    border-radius: 20px;
}

#xp-fill {
    height: 100%;
    background: lime;
    width: 0%;
    border-radius: 20px;
    transition: .4s;
}

button {
    font-size: 18px;
    margin-top: 20px;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
}

.task {
    width: 70%;
    background: black;
    color: white;
    border: 2px solid lime;
    transition: .2s;
}

.task:hover {
    background: lime;
    color: black;
}

.task.done {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: #555;
}

.sidebar {
    position: fixed;
    left: -240px;
    top: 0;
    width: 220px;
    height: 100vh;
    background: #000;
    padding: 20px;
    transition: .3s;
    z-index: 1000;
    box-shadow: 0px 0px 12px yellow;
    overflow-y: auto;
    overflow-x: hidden;
}

.close-btn {
    font-size: 22px;
    background: none;
    border: none;
    color: #ff0000;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    transition: .2s;
}

.close-btn:hover {
    transform: scale(1.2);
    color: white;
}

.menu-btn {
    position: fixed;
    left: 15px;
    top: 15px;
    font-size: 26px;
    background: none;
    border: none;
    color: #FFD300;
    cursor: pointer;
    z-index: 1100;
    animation: flash 2s infinite;
}

#overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 900;
}

@keyframes flash {
    0%   { transform: scale(1); color: yellow; }
    50%  { transform: scale(1.3); }
    100% { transform: scale(1); }
}

.sidebar ul li {
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: .2s;
    list-style: none;
}

.sidebar ul li:hover {
    background: #222;
}

.sidebar ul li.active {
    background: #FFD300;
    color: black;
    font-weight: bold;
}

.levelup-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: #111;
    border: 3px solid #FFD300;
    border-radius: 16px;
    padding: 40px 60px;
    text-align: center;
    z-index: 9999;
    opacity: 0;
    transition: none;
}

.levelup-popup h2 {
    font-size: 42px;
    color: #FFD300;
    text-shadow: 0 0 20px yellow;
    margin-bottom: 10px;
}

.levelup-popup p {
    font-size: 20px;
    color: white;
}

@keyframes popupAnim {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    20%  { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    30%  { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    70%  { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
}

.levelup-popup.show {
    animation: popupAnim 2s ease forwards;
}

.achievements-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    padding: 20px;
}

.achievement-card {
    width: 160px;
    background: #111;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 20px 12px;
    text-align: center;
    transition: .3s;
}

.achievement-card.unlocked {
    border-color: #FFD300;
    box-shadow: 0 0 12px rgba(255, 211, 0, 0.3);
}

.achievement-card.locked {
    opacity: 0.35;
    filter: grayscale(1);
}

.achievement-icon {
    font-size: 36px;
    margin-bottom: 8px;
}

.achievement-name {
    font-size: 13px;
    color: #FFD300;
    font-weight: bold;
    margin-bottom: 4px;
}

.achievement-desc {
    font-size: 11px;
    color: #888;
}

.toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    background: #111;
    border: 2px solid #FFD300;
    border-radius: 10px;
    padding: 12px 18px;
    color: white;
    font-size: 14px;
    animation: toastAnim 3s ease forwards;
}

@keyframes toastAnim {
    0%   { opacity: 0; transform: translateX(60px); }
    15%  { opacity: 1; transform: translateX(0); }
    75%  { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(60px); }
}
/* BOSS BATTLE */
.boss-container {
    padding: 20px;
    max-width: 500px;
    margin: auto;
}

.boss-card {
    background: #111;
    border: 2px solid #ff4444;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 0 20px rgba(255, 50, 50, 0.2);
}

.boss-emoji {
    font-size: 64px;
    margin-bottom: 8px;
    animation: bossPulse 2s infinite;
}

@keyframes bossPulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.08); }
    100% { transform: scale(1); }
}

.boss-name {
    font-size: 22px;
    color: #ff4444;
    font-weight: bold;
    margin-bottom: 6px;
}

.boss-desc {
    font-size: 13px;
    color: #888;
    margin-bottom: 16px;
}

.boss-hp-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #aaa;
    margin-bottom: 6px;
}

.boss-hp-track {
    width: 100%;
    height: 14px;
    background: #222;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;
}

.boss-hp-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff4444, #ff8800);
    border-radius: 10px;
    width: 100%;
    transition: width 0.5s ease;
}

.boss-reward {
    font-size: 14px;
    color: #FFD300;
}

.boss-status {
    font-size: 16px;
    color: #39FF14;
    min-height: 24px;
    margin-bottom: 12px;
    font-weight: bold;
}

.boss-select-title {
    font-size: 12px;
    letter-spacing: 3px;
    color: #555;
    margin-bottom: 14px;
}

.boss-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.boss-option {
    background: #111;
    border: 2px solid #333;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: .2s;
    text-align: left;
}

.boss-option:hover {
    border-color: #ff4444;
    background: #1a1a1a;
}

.boss-option.active-boss {
    border-color: #ff4444;
    box-shadow: 0 0 10px rgba(255,50,50,0.3);
}

.boss-option.defeated {
    opacity: 0.35;
    filter: grayscale(1);
    cursor: not-allowed;
}

.boss-option-emoji { font-size: 28px; }

.boss-option-info { flex: 1; }

.boss-option-name {
    font-size: 14px;
    color: white;
    font-weight: bold;
}

.boss-option-meta {
    font-size: 11px;
    color: #666;
    margin-top: 2px;
}

.boss-option-xp {
    font-size: 13px;
    color: #FFD300;
    font-weight: bold;
}
/* STATS PAGE */
.stats-tabs {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
}

.stats-tab {
    background: #111;
    border: 2px solid #333;
    color: #aaa;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    transition: .2s;
    margin-top: 0;
}

.stats-tab:hover {
    border-color: #FFD300;
    color: #FFD300;
}

.stats-tab.active-tab {
    background: #FFD300;
    color: black;
    border-color: #FFD300;
    font-weight: bold;
}

.chart-container {
    width: 80%;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #111;
    border: 1px solid #222;
    border-radius: 16px;
}

.stats-summary {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px auto;
    max-width: 500px;
    flex-wrap: wrap;
}

.stat-box {
    background: #111;
    border: 1px solid #222;
    border-radius: 10px;
    padding: 14px 20px;
    min-width: 100px;
}

.stat-box-val {
    font-size: 22px;
    color: #FFD300;
    font-weight: bold;
}

.stat-box-lbl {
    font-size: 10px;
    color: #555;
    margin-top: 4px;
    letter-spacing: 1px;
}
/* PROFILE PAGE */
.profile-container {
    max-width: 480px;
    margin: 20px auto;
    padding: 0 20px;
}

.profile-hero-card {
    background: #111;
    border: 2px solid #FFD300;
    border-radius: 20px;
    padding: 30px 20px;
    text-align: center;
    box-shadow: 0 0 30px rgba(255,211,0,0.1);
    margin-bottom: 20px;
}

.profile-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 3px solid #FFD300;
    margin: 0 auto 14px;
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
}

.profile-name {
    font-size: 24px;
    font-weight: bold;
    color: white;
    margin-bottom: 4px;
}

.profile-title {
    font-size: 13px;
    color: #FFD300;
    letter-spacing: 2px;
    margin-bottom: 16px;
}

.profile-level-badge {
    display: inline-block;
    background: #FFD300;
    color: black;
    font-weight: bold;
    font-size: 13px;
    padding: 4px 16px;
    border-radius: 20px;
    margin-bottom: 20px;
}

.profile-xp-bar-wrap {
    width: 100%;
    height: 8px;
    background: #222;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 6px;
}

.profile-xp-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, #FFD300, #ff8800);
    border-radius: 10px;
    transition: width .4s;
}

.profile-xp-label {
    font-size: 11px;
    color: #555;
    margin-bottom: 0;
}

.profile-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
}

.profile-stat {
    background: #111;
    border: 1px solid #222;
    border-radius: 10px;
    padding: 14px;
    text-align: center;
}

.profile-stat-val {
    font-size: 22px;
    font-weight: bold;
    color: #FFD300;
}

.profile-stat-lbl {
    font-size: 10px;
    color: #555;
    margin-top: 4px;
    letter-spacing: 1px;
}

.profile-recent {
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    padding: 16px;
    text-align: left;
}

.profile-recent-title {
    font-size: 10px;
    letter-spacing: 3px;
    color: #555;
    margin-bottom: 12px;
}

.profile-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.profile-badge {
    background: #1a1a1a;
    border: 1px solid #FFD300;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    color: #FFD300;
}

.profile-empty {
    font-size: 12px;
    color: #444;
}
