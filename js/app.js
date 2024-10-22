let previousZoom = window.devicePixelRatio;
const doc = document;
addEventListener("DOMContentLoaded", (event) => {
    hideLoader();
    toggleInputPassword();
    detectFirstLoadZoom();
    doc.querySelectorAll('.sub-menu').forEach(function (element, index) {
        const a = element.firstElementChild;
        const list = element.querySelector('.sub-list');
        a.addEventListener('click', function (e) {
            e.preventDefault();
            if (element.classList.contains('open')) {
                element.classList.remove("open");
                a.classList.remove("active");
                slideUp(list, 500);
            } else {
                hideElementsSidebar({
                    exclude: index
                });
                element.classList.add("open");
                a.classList.add("active");
                slideDown(list, 500);
            }
        });
    });
    doc.querySelectorAll('.hide-element').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            const href = element.getAttribute('href');
            const el = doc.querySelector(href);
            if (el) {
                if (el.classList.contains('sidebar') && window.innerWidth <= 560) {
                    el.classList.remove('show');
                } else {
                    el.classList.add('hidden-element');
                    slideLeft(el, 400);
                }
            }
        });
    });
    doc.querySelectorAll('.show-element').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            const href = element.getAttribute('href');
            const el = doc.querySelector(href);
            if (el) {
                el.classList.remove('hidden-element');
                slideRight(el, 400);
            }
        });
    });
    doc.querySelectorAll('.burger').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            const href = element.getAttribute('href');
            const el = doc.querySelector(href);
            if (el) {
                el.removeAttribute('style');
                el.classList.add('show');
            }
        });
    });
});

window.addEventListener('resize', () => {
    detectPreviousZoom();
});

function hideElementsSidebar(args) {
    let exclude = -1;
    if (args.hasOwnProperty('exclude')) {
        exclude = args.exclude;
    }
    doc.querySelectorAll('.sub-menu').forEach(function (element, index) {
        if (exclude !== index) {
            const a = element.firstElementChild;
            const list = element.querySelector('.sub-list');
            element.classList.remove("open");
            a.classList.remove("active");
            slideUp(list, 200);
        }

    });
}

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
    if (document.getElementsByClassName('authorization-image-load__progress').length === 0) return;
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
        previousZoom = Number(currentZoom.toFixed(2));
        var fontSize = 10;
        fontSize = fontSize * previousZoom;
        fontSize = Number(fontSize.toFixed(0));
        document.querySelectorAll('html')[0].setAttribute('data-zoom-level', previousZoom);
    }
}

function detectFirstLoadZoom() {
    let currentZoom = window.devicePixelRatio;
    if (currentZoom !== 1) {
        previousZoom = Number(currentZoom.toFixed(2));
        var fontSize = 10;
        fontSize = fontSize * previousZoom;
        fontSize = Number(fontSize.toFixed(0));
        document.querySelectorAll('html')[0].setAttribute('data-zoom-level', previousZoom);
    }
}

function slideDown(element, duration = 400) {
    element.style.removeProperty('display');
    let display = window.getComputedStyle(element).display;

    if (display === 'none') {
        element.style.display = 'block';
    }

    let height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.transition = `height ${duration}ms ease`;

    setTimeout(() => {
        element.style.height = height + 'px';
    }, 10);

    setTimeout(() => {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
    }, duration);
}

function slideRight(element, duration = 400) {
    element.style.removeProperty('display');
    let display = window.getComputedStyle(element).display;

    if (display === 'none') {
        element.style.display = 'block';
    }

    let width = element.offsetWidth;
    element.style.overflow = 'hidden';
    element.style.width = 0;
    element.style.transition = `width ${duration}ms ease`;

    setTimeout(() => {
        element.style.width = width + 'px';
    }, 10);

    setTimeout(() => {
        element.style.removeProperty('width');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
    }, duration);
}

function slideUp(element, duration = 400) {
    element.style.height = element.offsetHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;

    setTimeout(() => {
        element.style.height = 0;
    }, 10);

    setTimeout(() => {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
    }, duration);
}

function slideLeft(element, duration = 400) {
    element.style.width = element.offsetWidth + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `width ${duration}ms ease`;

    setTimeout(() => {
        element.style.width = 0;
    }, 10);

    setTimeout(() => {
        element.style.display = 'none';
        element.style.removeProperty('width');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
    }, duration);
}

function slideToggle(element, duration = 400) {
    if (window.getComputedStyle(element).display === 'none') {
        slideDown(element, duration);
    } else {
        slideUp(element, duration);
    }
}




