const $ = id => document.getElementById(id);

const TRACKS = [
    { title:'ICE', artist:'MORGENSHTERN', img:'img/ice.jpg' },
    { title:'Cadillac', artist:'MORGENSHTERN', img:'img/cadillac.jpg' },
    { title:'Дуло', artist:'MORGENSHTERN', img:'img/dulo.jpg' }
];

function renderList() {
    $('trackList').innerHTML = TRACKS.map(t => `
            <li class="track-item">
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
    $('mainScreen').classList.remove('active');
    $('trackScreen').classList.add('active');
    $('backBtn').style.display = 'block';
}

function goBack() {
    $('trackScreen').classList.remove('active');
    $('mainScreen').classList.add('active');
    $('navTitle').innerText = 'MORGENSHTERN';
    $('backBtn').style.display = 'none';
}

document.addEventListener('touchmove', e => {
    if (!e.target.closest('.screen')) e.preventDefault();
}, { passive: false });