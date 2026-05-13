const $ = id => document.getElementById(id);

const TRACKS = [
    { title:'ICE', artist:'MORGENSHTERN', img:'img/ice.jpg', bigImg:'img/iceBIG.jpg', audio:'audio/ice.mp3' },
    { title:'Cadillac', artist:'MORGENSHTERN', img:'img/cadillac.jpg', bigImg:'img/cadillacBIG.jpg', audio:'audio/cadillac.mp3' },
    { title:'Дуло', artist:'MORGENSHTERN', img:'img/dulo.jpg', bigImg:'img/duloBIG.jpg', audio:'audio/dulo.mp3' }
];

let currentAudio = null;

function playTrack(track) {
    // Останавливаем предыдущий
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    // Показываем экран трека
    $('playerImg').src = track.bigImg;
    $('playerTitle').innerText = track.title;
    $('playerArtist').innerText = track.artist;

    $('navTitle').innerText = track.title;
    $('trackScreen').classList.remove('active');
    $('mainScreen').classList.remove('active');
    $('AuthorsScreen').classList.remove('active');
    $('playerScreen').classList.add('active');
    $('backBtn').style.display = 'block';

    // Запускаем аудио
    currentAudio = new Audio(track.audio);
    currentAudio.play().catch(err => console.warn('Autoplay blocked:', err));
}

function renderList() {
    $('trackList').innerHTML = TRACKS.map((t, i) => `
        <li class="track-item" onclick="playTrack(TRACKS[${i}])">
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
    $('playerScreen').classList.remove('active');
    $('trackScreen').classList.add('active');
    $('backBtn').style.display = 'block';
}

function openAuthors() {
    $('navTitle').innerText = 'Авторы';
    $('mainScreen').classList.remove('active');
    $('trackScreen').classList.remove('active');
    $('playerScreen').classList.remove('active');
    $('AuthorsScreen').classList.add('active');
    $('backBtn').style.display = 'block';
}

function goBack() {
    // Если на экране плеера — возвращаемся к трекам, аудио продолжает играть
    if ($('playerScreen').classList.contains('active')) {
        $('playerScreen').classList.remove('active');
        $('trackScreen').classList.add('active');
        $('navTitle').innerText = 'Треки';
        return;
    }

    // Иначе — на главную, останавливаем аудио
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    $('trackScreen').classList.remove('active');
    $('AuthorsScreen').classList.remove('active');
    $('playerScreen').classList.remove('active');
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