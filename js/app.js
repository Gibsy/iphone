const $ = id => document.getElementById(id);

const TRACKS = [
    { title:'ICE', artist:'MORGENSHTERN', img:'img/ice.jpg', video:'video/ice.mp4' },
    { title:'Cadillac', artist:'MORGENSHTERN', img:'img/cadillac.jpg', video:'video/cadillac.mp4' },
    { title:'Дуло', artist:'MORGENSHTERN', img:'img/dulo.jpg', video:'video/dulo.mp4' }
];

// ── Модальный плеер ──────────────────────────────────────────────────────────
function createModal() {
    if ($('videoModal')) return;

    const modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        background:#000; align-items:center; justify-content:center;
        flex-direction:column;
    `;

    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '✕';
    closeBtn.style.cssText = `
        position:absolute; top:16px; right:20px;
        background:rgba(255,255,255,0.15); border:none; color:#fff;
        font-size:22px; width:44px; height:44px; border-radius:50%;
        cursor:pointer; z-index:10000; display:flex;
        align-items:center; justify-content:center;
    `;
    closeBtn.onclick = closeModal;

    // Видео-элемент — ВИДИМЫЙ, полноразмерный внутри модала
    const video = document.createElement('video');
    video.id = 'videoPlayer';
    video.controls = true;
    video.playsinline = true;                 // iOS: не уходить в системный плеер
    video.setAttribute('playsinline', '');    // дублируем атрибут для старых Safari
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'metadata';
    video.style.cssText = `
        width:100%; height:100%; max-height:100dvh;
        object-fit:contain; background:#000;
    `;

    modal.appendChild(closeBtn);
    modal.appendChild(video);
    document.body.appendChild(modal);

    // Закрыть по клику на фон (не на само видео)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Закрыть по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal() {
    const modal = $('videoModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = $('videoModal');
    const video = $('videoPlayer');
    if (video) { video.pause(); video.src = ''; }
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

async function playVideo(url) {
    createModal();
    openModal();

    const video = $('videoPlayer');
    video.src = url;
    video.load();

    try {
        await video.play();
    } catch (err) {
        // iOS может потребовать жест пользователя — controls уже видны, юзер нажмёт сам
        console.warn('Autoplay blocked, user can tap play:', err);
    }
}
// ────────────────────────────────────────────────────────────────────────────

function renderList() {
    $('trackList').innerHTML = TRACKS.map(t => `
        <li class="track-item" onclick="playVideo('${t.video}')">
            <img class="track-thumb" src="${t.img}">
            <div class="track-info">
                <div class="track-name">${t.title}</div>
                <div class="track-artist">${t.artist}</div>
            </div>
            <div class="chevron"></div>
        </li>
    `).join('');
}

function openTracks() {
    renderList();
    $('navTitle').innerText = 'Треки';
    $('AuthorsScreen').classList.remove('active');
    $('mainScreen').classList.remove('active');
    $('trackScreen').classList.add('active');
    $('backBtn').style.display = 'block';
}

function openAuthors() {
    $('navTitle').innerText = 'Авторы';
    $('mainScreen').classList.remove('active');
    $('trackScreen').classList.remove('active');
    $('AuthorsScreen').classList.add('active');
    $('backBtn').style.display = 'block';
}

function goBack() {
    $('trackScreen').classList.remove('active');
    $('AuthorsScreen').classList.remove('active');
    $('mainScreen').classList.add('active');
    $('navTitle').innerText = 'MORGENSHTERN';
    $('backBtn').style.display = 'none';
}

document.addEventListener('touchmove', e => {
    if (!e.target.closest('.screen')) e.preventDefault();
}, { passive: false });

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log("SW загружен"))
        .catch(err => console.log("Ошибка SW:", err));
}