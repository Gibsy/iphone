const $ = id => document.getElementById(id);

const TRACKS = [
    { title:'ICE', artist:'MORGENSHTERN', img:'img/ice.jpg', video:'video/ice.mp4' },
    { title:'Cadillac', artist:'MORGENSHTERN', img:'img/cadillac.jpg', video:'video/cadillac.mp4' },
    { title:'Дуло', artist:'MORGENSHTERN', img:'img/dulo.jpg', video:'video/dulo.mp4' }
];

function playVideo(url) {
    // iOS 12: открываем .mp4 напрямую — Safari сам запускает нативный плеер
    window.location.href = url;
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