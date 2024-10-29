let previousZoom = window.devicePixelRatio;
let lastWidth = window.innerWidth;
var doc = document;
var charts = {};
let resizeTimer;
addEventListener("DOMContentLoaded", (event) => {
    hideLoader();
    chartInit();
    toggleInputPassword();
    detectFirstLoadZoom();
    escKeyPressEvent();
    doc.querySelectorAll('.sub-menu').forEach(function (element, index) {
        var a = element.firstElementChild;
        var list = element.querySelector('.sub-list');
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
            var href = element.getAttribute('href');
            var el = doc.querySelector(href);
            var isSidebar = el.classList.contains('sidebar');
            if (el) {
                if (isSidebar && window.innerWidth <= 560) {
                    el.classList.remove('show');
                } else {
                    el.classList.add('hidden-element');
                    slideLeft(el, 400);
                }
                if (isSidebar) {

                    var body = doc.querySelector('body');
                    body.classList.remove('open-sidebar');
                }
                if (isSidebar && window.innerWidth > 1024) reinitMainCart();
            }
        });
    });
    doc.querySelectorAll('.show-element').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var el = doc.querySelector(href);
            var isSidebar = el.classList.contains('sidebar');
            if (el) {
                el.classList.remove('hidden-element');
                slideRight(el, 400);
                if (isSidebar) reinitMainCart();
            }
        });
    });
    doc.querySelectorAll('.burger').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var el = doc.querySelector(href);
            var body = doc.querySelector('body');
            if (el) {
                el.removeAttribute('style');
                el.classList.add('show');
                el.classList.remove('hidden-element');
                body.classList.add('open-sidebar');
            }
        });
    });
    doc.querySelectorAll('.change-chart-data').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            if (element.classList.contains('active')) return;
            var id = element.getAttribute('data-element-id');
            var jsonUrl = element.getAttribute('href');
            var el = doc.querySelector('#' + id);
            removeClass('.change-chart-data[data-element-id="' + id + '"]', 'active');
            element.classList.add('active');
            if (el && jsonUrl !== undefined) {
                el.classList.add('loading');
                el.setAttribute('data-json-url', jsonUrl);
                chartDestroy(charts[id]);
                el.classList.remove('chart-init');
                chartItemInit(el);
            }
        });
    });
    doc.querySelectorAll('.open-modal').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var el = doc.querySelector(href);
            var rect = element.getBoundingClientRect();
            openModal(el);

        });
    });
    doc.querySelectorAll('.modal-close').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            if (href !== undefined) {
                var el = doc.querySelector(href);
                closeModal({
                    element: el
                });
            }
        });
    });
    doc.querySelectorAll('.accordion__title').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var closest = element.closest('.accordion-item');
            var accordion = element.closest('.accordion');
            var content = closest.querySelector('.accordion__text');

            if (closest.classList.contains('showed')) {
                closest.classList.remove('showed');
                slideUp(content, 400);
            } else {
                accordion.querySelectorAll('.accordion-item').forEach(function (el, index) {
                    el.classList.remove('showed');
                    slideUp(el.querySelector('.accordion__text'), 100);
                });
                setTimeout(function (){

                    closest.classList.add('showed');
                    slideDown(content, 500);
                },101)
            }
        });
    });
    doc.querySelectorAll('.score__control .switcher input[type="checkbox"]').forEach(function (element, index) {
        element.addEventListener('change', function (e) {
            e.preventDefault();
            var score = element.closest('.score');
            if (element.checked) {
                score.classList.remove('disable');
            } else {
                score.classList.add('disable');
            }
        });
    });
});

function escKeyPressEvent() {
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            closeModal();
        }
    };
}

function closeModal(args = {}) {
    var element = args.element || null;
    doc.querySelector('body').classList.remove('open-modal');
    if (element !== null) {
        element.classList.remove('open');
    } else {
        doc.querySelectorAll('.modal-window.open').forEach(function (element, index) {
            element.classList.remove('open');
        });
    }
}

function openModal(el) {
    el.classList.add('open');
    doc.querySelector('body').classList.add('open-modal');
}

window.addEventListener('resize', () => {
    detectPreviousZoom();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        var currentWidth = window.innerWidth;
        if (lastWidth !== currentWidth) {
            lastWidth = currentWidth;
            doc.querySelectorAll('.chart-js').forEach(function (element, index) {
                var id = element.getAttribute('id');
                if (id === undefined) {
                    id = 'chart-js-' + index;
                    element.setAttribute('id', 'chart-js-' + index);
                }
                element.classList.add('loading');
                chartReinit(element);
            });
        }
    }, 500);
});

function isDesktop() {
    var userAgent = navigator.userAgent.toLowerCase();
    var isMobile = /mobile|android|iphone|ipad|tablet|touch/.test(userAgent);
    var hasPointer = window.matchMedia('(pointer: fine)').matches;

    return !isMobile && hasPointer && window.screen.width >= 1024;
}

function reinitMainCart() {
    var chart = doc.querySelector('.main-content .main-data-chart');
    doc.querySelector('.main-content').classList.add('full-width');
    chart.classList.add('loading');
    setTimeout(function () {
        chartReinit(doc.querySelector('.main-content .main-data-chart'));
    }, 1000);
}

function removeClass(querySelector, className) {
    doc.querySelectorAll(querySelector).forEach(function (element, index) {
        element.classList.remove(className);
    });
}

function chartInit() {
    var collection = {};
    var charts = {};
    doc.querySelectorAll('.chart-js').forEach(function (element, index) {
        var id = element.getAttribute('id');
        if (id === undefined) {
            id = 'chart-js-' + index;
            element.setAttribute('id', 'chart-js-' + index);
        }
        element.classList.add('loading');
        chartItemInit(element);
    });
}

function chartItemInit(element) {
    var id = element.getAttribute('id');
    var theme = element.getAttribute('data-theme') || 'default';
    var jsonUrl = element.getAttribute('data-json-url');

    if (!element.classList.contains('chart-init') && jsonUrl !== undefined) {
        caches.open(id).then(cache => {
            cache.match(jsonUrl).then(cachedResponse => {
                if (cachedResponse) {
                    cachedResponse.json().then(json => setParametersAndRenderChart({
                        json: json, element: element, theme: theme
                    }));
                } else {
                    fetch(jsonUrl).then(response => {
                        cache.put(jsonUrl, response.clone());
                        response.json().then(json => setParametersAndRenderChart({
                            json: json, element: element, theme: theme
                        }));

                    });
                }
            });
        });
    }
}

function setParametersAndRenderChart(args) {
    var json = args.json;
    var element = args.element;
    var id = element.getAttribute('id');
    var theme = args.theme || (element.getAttribute('data-theme') || 'default');
    var strokeWidth = 3;
    if (element.classList.contains('small-chart')) {
        strokeWidth = 25;
    }
    var categories = json.categories;
    var series = json.series;
    if (categories && series) {
        var chart = new ApexCharts(element, {
            chart: {
                type: 'line',
                toolbar: false,
                height: element.offsetHeight,
                width: element.offsetWidth,
                background: theme === 'transparent' ? "transparent" : ''
            },
            grid: {
                show: theme !== 'transparent'
            },
            series: series,
            xaxis: {
                categories: categories,
                labels: {
                    show: theme !== 'transparent'
                },
                axisBorder: {
                    show: theme !== 'transparent'
                },
                axisTicks: {
                    show: theme !== 'transparent'
                }
            },
            yaxis: {
                labels: {
                    show: theme !== 'transparent'
                }
            },
            fill: {
                colors: ['#0CAE35'],
                type: 'solid',

            },
            stroke: {
                width: strokeWidth,
                curve: 'straight'
            },
            tooltip: {
                enabled: theme !== 'transparent'
            }
        });
        chart.render();
        charts[id] = chart;
        element.classList.add('chart-init');
        setTimeout(function () {
            element.classList.remove('loading');
        }, 10);
    }
}

function chartDestroy(chart) {
    chart.destroy();
}

function chartReinit(element) {
    var id = element.getAttribute('id');
    chartDestroy(charts[id]);
    element.classList.remove('chart-init');
    chartItemInit(element);
}

function hideElementsSidebar(args) {
    let exclude = -1;
    if (args.hasOwnProperty('exclude')) {
        exclude = args.exclude;
    }
    doc.querySelectorAll('.sub-menu').forEach(function (element, index) {
        if (exclude !== index) {
            var a = element.firstElementChild;
            var list = element.querySelector('.sub-list');
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
    if (isDesktop()) {
        let currentZoom = window.devicePixelRatio;
        if (currentZoom !== previousZoom) {
            previousZoom = Number(currentZoom.toFixed(2));
            var fontSize = 10;
            fontSize = fontSize * previousZoom;
            fontSize = Number(fontSize.toFixed(0));
            document.querySelectorAll('html')[0].setAttribute('data-zoom-level', previousZoom);
        }
    }
}

function detectFirstLoadZoom() {
    if (isDesktop()) {
        let currentZoom = window.devicePixelRatio;
        if (currentZoom !== 1) {
            previousZoom = Number(currentZoom.toFixed(2));
            var fontSize = 10;
            fontSize = fontSize * previousZoom;
            fontSize = Number(fontSize.toFixed(0));
            document.querySelectorAll('html')[0].setAttribute('data-zoom-level', previousZoom);
        }
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
    element.style.transition = `${duration}ms ease`;

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

    let w = element.offsetWidth;
    element.style.overflow = 'hidden';
    element.style.width = 0;

    console.log(w)
    setTimeout(() => {
        element.style.transition = `width ${duration}ms ease`;
        element.style.width = w + 'px';
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
    element.style.transition = `${duration}ms ease`;

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




