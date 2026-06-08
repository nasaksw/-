import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "./firebase.js";

const gus = ["동구", "서구", "남구", "북구", "광산구"];

const dongs = {
    "동구": ["충장동", "동명동", "계림동", "산수동", "지산동", "서남동", "학동", "지원동"],
    "서구": ["양동", "농성동", "광천동", "유덕동", "치평동", "상무동", "화정동", "서창동", "금호동", "풍암동", "동천동"],
    "남구": ["양림동", "방림동", "봉선동", "사직동", "월산동", "백운동", "주월동", "효덕동", "송암동", "대촌동", "진월동"],
    "북구": ["중흥동", "중앙동", "임동", "신안동", "용봉동", "운암동", "동림동", "우산동", "풍향동", "문화동", "문흥동", "두암동", "오치동", "매곡동", "삼각동", "일곡동", "건국동", "양산동", "신용동"],
    "광산구": ["송정동", "도산동", "신흥동", "어룡동", "우산동", "월곡동", "비아동", "첨단동", "수완동", "하남동", "운남동", "신창동", "신가동", "월산동", "평동", "동곡동", "본량동"]
};

let currentFilter = "all";

window.onload = function () {
    initSelectOptions("lostGu");
    initSelectOptions("foundGu");
    renderBoard();
};

function initSelectOptions(selectId) {
    const select = document.getElementById(selectId);

    if (!select) return;

    gus.forEach((gu) => {
        const opt = document.createElement("option");
        opt.value = gu;
        opt.textContent = gu;
        select.appendChild(opt);
    });
}

function updateDongSelect(guId, dongId) {
    const guSelect = document.getElementById(guId);
    const dongSelect = document.getElementById(dongId);

    if (!guSelect || !dongSelect) return;

    const selectedGu = guSelect.value;

    dongSelect.innerHTML = '<option value="">동 선택</option>';

    if (selectedGu && dongs[selectedGu]) {
        dongs[selectedGu].forEach((dong) => {
            const opt = document.createElement("option");
            opt.value = dong;
            opt.textContent = dong;
            dongSelect.appendChild(opt);
        });
    }
}

function openTab(tabId) {
    document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.remove("active");
    });

    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");

    if (tabId === "lost-tab") {
        document.querySelectorAll(".tab-btn")[0].classList.add("active");
    }

    if (tabId === "found-tab") {
        document.querySelectorAll(".tab-btn")[1].classList.add("active");
    }

    if (tabId === "board-tab") {
        document.querySelectorAll(".tab-btn")[2].classList.add("active");
        renderBoard();
    }
}

async function addLostPost() {
    const gu = document.getElementById("lostGu").value;
    const dong = document.getElementById("lostDong").value;
    const info = document.getElementById("lostInfo").value.trim();
    const reward = Number(document.getElementById("lostReward").value);

    if (!gu || !dong || !info || Number.isNaN(reward)) {
        alert("모든 항목을 정확히 입력해주세요.");
        return;
    }

    if (reward < 0 || reward % 100 !== 0) {
        alert("사례금은 0 이상이며 100원 단위로 입력해야 합니다.");
        return;
    }

    await addDoc(collection(db, "lostPosts"), {
        gu,
        dong,
        info,
        reward,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleString("ko-KR")
    });

    alert("분실물 찾기 글이 등록되었습니다.");

    document.getElementById("lostForm").reset();
    updateDongSelect("lostGu", "lostDong");

    await renderBoard();
    openTab("board-tab");
}

async function addFoundPost() {
    const gu = document.getElementById("foundGu").value;
    const dong = document.getElementById("foundDong").value;
    const type = document.getElementById("foundType").value;
    const title = document.getElementById("foundTitle").value.trim();
    const content = document.getElementById("foundContent").value.trim();

    if (!gu || !dong || !type || !title || !content) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    await addDoc(collection(db, "foundPosts"), {
        gu,
        dong,
        type,
        title,
        content,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleString("ko-KR")
    });

    alert("습득물 글이 게시판에 등록되었습니다.");

    document.getElementById("foundForm").reset();
    updateDongSelect("foundGu", "foundDong");

    await renderBoard();
    openTab("board-tab");
}

function filterBoard(type) {
    currentFilter = type;

    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    const activeButton = document.getElementById(`btn-${type}`);
    if (activeButton) {
        activeButton.classList.add("active");
    }

    renderBoard();
}

async function renderBoard() {
    const boardList = document.getElementById("boardList");

    if (!boardList) return;

    boardList.innerHTML = "";

    let html = "";

    if (currentFilter === "all" || currentFilter === "lost") {
        const lostQuery = query(collection(db, "lostPosts"), orderBy("createdAt", "desc"));
        const lostSnapshot = await getDocs(lostQuery);

        lostSnapshot.forEach((doc) => {
            const post = doc.data();

            html += `
                <div class="card lost">
                    <span class="card-badge">잃어버렸어요</span>

                    <h3>주소: 광주광역시 ${escapeHtml(post.gu)} ${escapeHtml(post.dong)}</h3>

                    <p>
                        <strong>설명:</strong>
                        ${escapeHtml(post.info)}
                    </p>

                    <p style="color:#e74c3c;font-weight:bold;">
                        사례금 ${Number(post.reward).toLocaleString()}원
                    </p>

                    <small>등록일: ${escapeHtml(post.date || "")}</small>
                </div>
            `;
        });
    }

    if (currentFilter === "all" || currentFilter === "found") {
        const foundQuery = query(collection(db, "foundPosts"), orderBy("createdAt", "desc"));
        const foundSnapshot = await getDocs(foundQuery);

        foundSnapshot.forEach((doc) => {
            const post = doc.data();

            html += `
                <div class="card found">
                    <span class="card-badge">주웠어요</span>

                    <h3>[${escapeHtml(post.type)}] ${escapeHtml(post.title)}</h3>

                    <p>
                        <strong>습득 장소:</strong>
                        광주광역시 ${escapeHtml(post.gu)} ${escapeHtml(post.dong)}
                    </p>

                    <p>
                        <strong>상세 내용:</strong>
                        ${escapeHtml(post.content)}
                    </p>

                    <small>등록일: ${escapeHtml(post.date || "")}</small>
                </div>
            `;
        });
    }

    if (html === "") {
        boardList.innerHTML = '<p class="empty-msg">등록된 게시글이 없습니다.</p>';
    } else {
        boardList.innerHTML = html;
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

window.updateDongSelect = updateDongSelect;
window.openTab = openTab;
window.addLostPost = addLostPost;
window.addFoundPost = addFoundPost;
window.filterBoard = filterBoard;
