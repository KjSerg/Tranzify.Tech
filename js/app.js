let previousZoom = window.devicePixelRatio;

function toggleInputPassword() {
    document.querySelectorAll('.form-password__button').forEach(function (element, key, parent) {
        element.addEventListener('click', function (e) {
            var wrapper = element.closest(".form-password");
            var input = wrapper.firstElementChild;
            var img = element.firstElementChild;
            if (input.type === 'password') {
                input.type = 'text';
                img.src = passwordShowIcon;
            } else {
                input.type = 'password';
                img.src = passwordHideIcon;
            }
        });
    });
}

function hideLoader() {
    document.getElementsByClassName('authorization-image-load__progress')[0].classList.add('loaded');
    setTimeout(function () {
        document.getElementsByClassName('authorization-image')[0].classList.add('hidden-sm');
        document.getElementsByClassName('header__logo')[0].classList.add('hidden-sm');
        document.querySelectorAll('.show-after-load-sm').forEach(function (element) {
            element.classList.add('loaded');
        });
    }, 800)

}

function detectPreviousZoom() {
    let currentZoom = window.devicePixelRatio;
    if (currentZoom !== previousZoom) {
        console.log('Zoom level changed!');
        previousZoom = Number(currentZoom.toFixed(2));
        console.log(previousZoom);
        var fontSize = 10;
        fontSize = fontSize * previousZoom;
        fontSize = Number(fontSize.toFixed(0));
        console.log(fontSize);
        document.querySelectorAll('html')[0].setAttribute('data-zoom-level', previousZoom);
    }
}
function detectFirstLoadZoom() {
    let currentZoom = window.devicePixelRatio;
    console.log(currentZoom);
    if (currentZoom !== 1) {
        console.log('Zoom level changed!');
        previousZoom = Number(currentZoom.toFixed(2));
        console.log(previousZoom);
        var fontSize = 10;
        fontSize = fontSize * previousZoom;
        fontSize = Number(fontSize.toFixed(0));
        console.log(fontSize);
        document.querySelectorAll('html')[0].setAttribute('data-zoom-level', previousZoom);
    }
}

addEventListener("DOMContentLoaded", (event) => {
    hideLoader();
    toggleInputPassword();
    detectFirstLoadZoom();
});

window.addEventListener('resize', () => {
    detectPreviousZoom();
});

