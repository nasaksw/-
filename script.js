// 광주 지역 데이터 정의 (C언어 배열 매핑)
const gus = ["동구", "서구", "남구", "북구", "광산구"];

const dongs = {
    "동구": ["충장동", "동명동", "계림동", "산수동", "지산동", "서남동", "학동", "지원동"],
    "서구": ["양동", "농성동", "광천동", "유덕동", "치평동", "상무동", "화정동", "서창동", "금호동", "풍암동", "동천동"],
    "남구": ["양림동", "방림동", "봉선동", "사직동", "월산동", "백운동", "주월동", "효덕동", "송암동", "대촌동", "진월동"],
    "북구": ["중흥동", "중앙동", "임동", "신안동", "용봉동", "운암동", "동림동", "우산동", "풍향동", "문흥동", "두암동", "삼각동", "일곡동", "매곡동", "오치동", "석곡동", "건국동", "양산동", "신용동"],
    "광산구": ["송정동", "도산동", "신흥동", "어룡동", "우산동", "월곡동", "비아동", "첨단동", "수완동", "운남동", "신창동", "하남동", "임곡동", "동곡동", "평동", "삼도동", "본량동"]
};

// 게시글 저장소 (C언어의 구조체 배열 역할)
let lostPosts = [];
let foundPosts = [];
let currentFilter = 'all';

// 초기 로드 시 구 드롭다운 생성
window.onload = function() {
    initSelectOptions('lostGu');
    initSelectOptions('foundGu');
};

function initSelectOptions(selectId) {
    const select = document.getElementById(selectId);
    gus.forEach(gu => {
        let opt = document.createElement('option');
        opt.value = gu;
        opt.textContent = gu;
        select.appendChild(opt);
    });
}

// 구 선택에 따라 동 자동 동기화 (C언어 selectDong 대응)
function updateDongSelect(guId, dongId) {
    const guSelect = document.getElementById(guId);
    const dongSelect = document.getElementById(dongId);
    const selectedGu = guSelect.value;

    dongSelect.innerHTML = '<option value="">동 선택</option>';

    if (selectedGu && dongs[selectedGu]) {
        dongs[selectedGu].forEach(dong => {
            let opt = document.createElement('option');
            opt.value = dong;
            opt.textContent = dong;
            dongSelect.appendChild(opt);
        });
    }
}

// 탭 전환 기능 (C언어 메뉴 루프 대응)
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    if(tabId === 'board-tab') {
        renderBoard();
    }
}

// 1. 분실물 찾기 글 등록 (C언어 writeLostPost 대응)
function addLostPost() {
    const gu = document.getElementById('lostGu').value;
    const dong = document.getElementById('lostDong').value;
    const info = document.getElementById('lostInfo').value;
    const reward = parseInt(document.getElementById('lostReward').value);

    if (!gu || !dong || !info || isNaN(reward)) {
        alert("모든 필드를 정확히 입력해주세요.");
        return;
    }

    if (reward < 0 || reward % 100 !== 0) {
        alert("현상금은 0원 이상이며 100원 단위여야 합니다.");
        return;
    }

    lostPosts.push({ gu, dong, info, reward, date: new Date().toLocaleString() });
    alert("분실물 찾기 글이 성공적으로 등록되었습니다!");
    document.getElementById('lostForm').reset();
    updateDongSelect('lostGu', 'lostDong');
    openTab('board-tab');
}

// 2. 분실물 등록 글 등록 (C언어 writeFoundPost 대응)
function addFoundPost() {
    const gu = document.getElementById('foundGu').value;
    const dong = document.getElementById('foundDong').value;
    const type = document.getElementById('foundType').value;
    const title = document.getElementById('foundTitle').value;
    const content = document.getElementById('foundContent').value;

    if (!gu || !dong || !type || !title || !content) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    foundPosts.push({ gu, dong, type, title, content, date: new Date().toLocaleString() });
    alert("분실물 습득 글이 게시판에 올라갔습니다!");
    document.getElementById('foundForm').reset();
    updateDongSelect('foundGu', 'foundDong');
    openTab('board-tab');
}

// 필터링 버튼 동작
function filterBoard(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');
    renderBoard();
}

// 3. 통합 게시판 렌더링 (C언어 showLostPosts, showFoundPosts 대응)
function renderBoard() {
    const boardList = document.getElementById('boardList');
    boardList.innerHTML = '';

    let html = '';

    // 잃어버린 사람 글 생성
    if (currentFilter === 'all' || currentFilter === 'lost') {
        lostPosts.forEach((post, idx) => {
            html += `
                <div class="card lost">
                    <span class="card-badge">잃어버렸어요 (No.${idx + 1})</span>
                    <h3>장소: 광주광역시 ${post.gu} ${post.dong}</h3>
                    <p><strong>설명/정보:</strong> ${post.info}</p>
                    <p style="color: #e74c3c; font-weight: bold;">💰 현상금: ${post.reward.toLocaleString()}원</p>
                    <small style="color: #999;">등록일: ${post.date}</small>
                </div>
            `;
        });
    }

    // 주운 사람 글 생성
    if (currentFilter === 'all' || currentFilter === 'found') {
        foundPosts.forEach((post, idx) => {
            html += `
                <div class="card found">
                    <span class="card-badge">주웠어요 (No.${idx + 1})</span>
                    <h3>[${post.type}] ${post.title}</h3>
                    <p><strong>습득 장소:</strong> 광주광역시 ${post.gu} ${post.dong}</p>
                    <p><strong>상세 내용:</strong> ${post.content}</p>
                    <small style="color: #999;">등록일: ${post.date}</small>
                </div>
            `;
        });
    }

    if (html === '') {
        boardList.innerHTML = '<p class="empty-msg">등록된 게시글이 없습니다.</p>';
    } else {
        boardList.innerHTML = html;
    }
}