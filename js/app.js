const $ = id => document.getElementById(id);

const TRACKS = [
    { title:'ICE', artist:'MORGENSHTERN', img:'img/ice.jpg', video:'video/ice.mp4' },
    { title:'Cadillac', artist:'MORGENSHTERN', img:'img/cadillac.jpg', video:'video/cadillac.mp4' },
    { title:'Дуло', artist:'MORGENSHTERN', img:'img/dulo.jpg', video:'video/dulo.mp4' }
];

function playVideo(url) {
    const v = $('videoPlayer');
    v.src = url;
    v.style.display = 'block'; // Временно показываем, чтобы Safari "увидел" видео

    // Сначала запускаем видео
    v.play().then(() => {
        // И СРАЗУ (без ожиданий событий) просим фуллскрин
        if (v.webkitEnterFullscreen) {
            v.webkitEnterFullscreen();
        } else if (v.requestFullscreen) {
            v.requestFullscreen();
        }
    }).catch(err => {
        console.log("Ошибка запуска:", err);
    });
}

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
    renderList();
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
    navigator.serviceWorker.register('./sw.js') // точка важна
        .then(() => console.log("SW загружен"))
        .catch(err => console.log("Ошибка SW:", err));
}