function changeColor() {
    const colors = ['#1a1a1a', '#444', '#000', '#2c2c2c'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}

// Простой алерт
function sayHi() {
    alert('Шоу начинается!');
}

function shakePhoto() {
    const img = document.getElementById('mainPhoto');
    img.style.transform = 'scale(1.2) rotate(5deg)';
    setTimeout(() => {
        img.style.transform = 'scale(1)';
    }, 300);
}