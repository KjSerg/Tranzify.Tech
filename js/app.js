let previousZoom = window.devicePixelRatio;
let lastWidth = window.innerWidth;
var doc = document;
var charts = {};
var dt = new DataTransfer();
let resizeTimer;
addEventListener("DOMContentLoaded", (event) => {
    hideLoader();
    chartInit();
    toggleInputPassword();
    detectFirstLoadZoom();
    escKeyPressEvent();
    emojiInit();
    setBrowserName();
    replaceGap();
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

                    doc.querySelector('.main-content').classList.add('full-width');
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
                if (isSidebar) {
                    reinitMainCart();
                    doc.querySelector('.main-content').classList.remove('full-width');
                }
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
    doc.querySelectorAll('.notifications-link, .chat-link').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var el = doc.querySelector(href);
            var body = doc.querySelector('body');
            var bodyClassName = element.classList.contains('chat-link') ? 'open-chat' : 'open-notifications';
            if (el) {
                if (el.classList.contains('active')) {
                    el.classList.remove('active');
                    body.classList.remove(bodyClassName);
                } else {
                    el.classList.add('active');
                    body.classList.add(bodyClassName);
                    if (element.classList.contains('chat-link')) {
                        var container = el.querySelector('.chat-header-container');
                        if(container !== null) {
                            container.scrollTop = container.scrollHeight;
                        }
                    }
                }
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
            if (element.classList.contains('open-and-close-modal')) {
                closeModal();
            }
            openModal(el);
        });
    });
    doc.querySelectorAll('.modal-close, .trigger-close-modal').forEach(function (element, index) {
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
                setTimeout(function () {

                    closest.classList.add('showed');
                    slideDown(content, 500);
                }, 101)
            }
        });
    });
    doc.querySelectorAll('.correspondence-item__link').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            if (href && href !== '#') {
                var el = doc.querySelector(href);
                if (el !== null) {
                    doc.querySelectorAll('.correspondence-item').forEach(function (item) {
                        item.classList.remove('active');
                    });
                    doc.querySelectorAll('.correspondence-chat-inner').forEach(function (chat) {
                        chat.style.display = 'none';
                    });
                    el.style.display = 'block';
                    element.closest('.correspondence-item').classList.add('active');
                    doc.querySelector('.correspondence-content').classList.add('active');
                    el.scrollTop = el.scrollHeight;
                }
            }

        });
    });
    doc.querySelectorAll('.correspondence-content__close').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            doc.querySelector('.correspondence-content').classList.remove('active');
        });
    });
    doc.querySelectorAll('.settings-personal-information-avatar-text').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var selector = element.getAttribute('href');
            var el = doc.querySelector(selector);
            if (el === null) return;
            el.click();
        });
    });
    doc.querySelectorAll('.score__control .switcher input[type="checkbox"], .tool .switcher input[type="checkbox"]').forEach(function (element, index) {
        element.addEventListener('change', function (e) {
            e.preventDefault();
            var card = element.closest('.score');
            if (card === null) card = element.closest('.tool');
            if (element.checked) {
                card.classList.remove('disable');
            } else {
                card.classList.add('disable');
            }
        });
    });
    doc.querySelectorAll('input[type="file"]').forEach(function (element, index) {
        element.addEventListener('change', function (event) {
            const fileInput = event.target;
            const form = element.closest('form');
            const preview = form.querySelector(".file-preview");
            console.log(preview)
            if (preview === null) {
                var fileList = element.closest('.files-list');
                var closest = element.closest('.form-group-file');
                var text = closest.querySelector('.form-group-file__text');
                var max = element.getAttribute('data-max') || 2;
                max = Number(max);
                if (fileList === null) {
                    var file = fileInput.files[0];
                    if (file) {
                        var name = file.name;
                        if (name.length > 20) {
                            var words = name.split('.');
                            name = name.slice(0, 10);
                            name = name + '...';
                        }
                        text.innerHTML = name;
                    } else {
                        text.innerHTML = text.dataset.text;
                    }
                } else {
                    var files = fileInput.files;
                    var filesListLength = files.length;
                    if ((max !== undefined) && !isNaN(max) && filesListLength > max) {
                        alert(max + ' files max');
                        element.value = null;
                        clearFileListItems(fileList);
                        return;
                    }
                    var dtFiles = dt.files;
                    var dtFilesLength = dtFiles.length;
                    if (dtFilesLength > 0) {
                        var testLength = dtFilesLength + filesListLength;
                        if (testLength > max) {
                            alert(max + ' files max');
                            return;
                        } else {
                            for (let file of files) {
                                dt.items.add(file);
                            }
                            element.files = dt.files;
                            renderPreviewFileInput(dt.files, fileList);
                            return;
                        }
                    }
                    if (files) {
                        for (let file of files) {
                            dt.items.add(file);
                        }
                        console.log(dt.items)
                        renderPreviewFileInput(dt.files, fileList);
                    } else {
                        clearFileListItems(fileList);
                    }
                }

            } else {
                const icon = form.querySelector(".avatar-icon");
                const text = form.querySelector(".settings-personal-information-avatar-text");
                const defaultSrc = preview.dataset.src;
                var file = fileInput.files[0];
                if (icon !== null) icon.src = addAvatarIcon;
                if (text !== null) text.innerHTML = text.getAttribute('data-add-text');
                if (file) {
                    if (text !== null) text.innerHTML = text.getAttribute('data-change-text');
                    const fileReader = new FileReader();
                    if (file.type.startsWith("image/")) {
                        fileReader.onload = function () {
                            preview.src = fileReader.result;
                            if (icon !== null) icon.src = editAvatarIcon;
                        };
                        fileReader.readAsDataURL(file);
                    } else if (file.type === "application/pdf") {
                        preview.src = attachFile;
                    } else {
                        preview.src = defaultSrc;
                    }
                } else {
                    preview.src = defaultSrc;
                }
            }

        });
    });
    doc.querySelectorAll('.copy-link').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var copy = element.getAttribute('data-copy');
            if (copy === undefined || copy === null) {
                copy = href;
            }
            console.log(copy)
            const tempTextArea = document.createElement("textarea");
            tempTextArea.value = copy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(tempTextArea);
            showMessage(copyText);
        });
    });
    doc.querySelectorAll('.toggle-class-element').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var className = element.getAttribute('data-class-name') || 'active';
            var el = doc.querySelector(href);
            if (el.classList.contains(className)) {
                el.classList.remove(className);
                element.classList.remove('active');
            } else {

                el.classList.add(className);
                element.classList.add('active');
            }
        });
    });
    doc.querySelectorAll('.tab-link').forEach(function (element, index) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            var href = element.getAttribute('href');
            var parentSelector = element.getAttribute('data-tab-parent');
            var el = doc.querySelector(href);
            var className = 'active';
            if (element.classList.contains(className)) return;
            if (parentSelector !== undefined) {
                parent = doc.querySelector(parentSelector);
                if (parent !== null) {
                    el = parent.querySelector(href);
                    parent.querySelectorAll('.tab-link').forEach(function (link, index) {
                        link.classList.remove(className);
                    });
                    parent.querySelectorAll('.tab-content').forEach(function (box, index) {
                        box.classList.remove(className);
                    });
                }

            }
            el.classList.add(className);
            element.classList.add(className);

        });
    });
    doc.querySelectorAll('.files-list').forEach(function (fileList, index) {
        fileList.addEventListener('click', function (e) {
            var element = e.target;
            if (e.target && e.target.classList.contains("files-list-item__remove")) {
                e.preventDefault();
                var index = element.getAttribute('data-index');
                if (index !== undefined) {
                    index = Number(index);
                    if (!isNaN(index)) {
                        var input = fileList.querySelector('input[type="file"]');
                        var dataList = dt.items;
                        dataList.remove(index);
                        input.files = dt.files;
                        renderPreviewFileInput(input.files, fileList);
                    }
                }
            }
        });
    });
});

function renderPreviewFileInput(files, fileList) {
    var html = '';
    if (files.length === 0) {
        clearFileListItems(fileList);
        return;
    }
    for (var a = 0; a < files.length; a++) {
        var ID = makeID();
        ID = 'file-item-' + ID + '' + a;
        var file = files[a];
        var size = getFileSize(file);
        var name = file.name;
        if (name.length > 25) {
            var words = name.split('.');
            name = name.slice(0, 15);
            name = name + '...';
        }
        var temp = '<div class="files-list-item" id="' + ID + '">';
        temp += '<div class="files-list-item__icon"><img src="' + fileCheckIcon + '" alt=""></div>';
        temp += '<div class="files-list-item-text">';
        temp += '<div class="files-list-item__name">' + name + '</div>';
        temp += '<div class="files-list-item__size">' + size + '</div>';
        temp += '</div>';
        temp += '<div data-selector="' + ID + '" data-index="' + a + '" class="files-list-item__remove"><img src="' + deleteIcon + '" alt=""></div>';
        temp += '</div>';

        html += temp;
    }
    clearFileListItems(fileList);
    fileList.insertAdjacentHTML("beforeend", html);
}

function makeID(arguments) {
    var args = arguments || {};
    var length = args.length || 5;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function getFileSize(file) {
    var fileSizeInBytes = file.size;
    var fileSize;
    if (fileSizeInBytes >= 1048576) {
        fileSize = (fileSizeInBytes / 1048576).toFixed(2) + " MB";
    } else {
        fileSize = (fileSizeInBytes / 1024).toFixed(2) + " KB";
    }
    return fileSize;
}

function clearFileListItems(fileList) {
    fileList.querySelectorAll('.files-list-item').forEach(function (fileItem, index) {
        fileItem.remove();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const chatElement = document.querySelector('.correspondence-chat-inner');
    if (chatElement === null) return;
    chatElement.scrollTop = chatElement.scrollHeight;
});

var elementsWithGap = Array.from(document.querySelectorAll("*")).filter(element => {
    const style = window.getComputedStyle(element);
    return style.gap !== "normal" && style.gap !== "";
});

function replaceGap() {
    var browser = detectBrowser();
    if (browser === 'safari' && !supportsFlexGap()) {
        document.querySelectorAll("*").forEach(function (element) {
            var style = window.getComputedStyle(element);
            var gap = style.gap;
            if (gap !== "normal" && gap !== "") {
                element.classList.add('safari-gap');
            }
        });
    }
}

function supportsFlexGap() {
    const testElement = document.createElement('div');
    testElement.style.display = 'flex';
    testElement.style.gap = '10px';
    document.body.appendChild(testElement);
    const supportsGap = window.getComputedStyle(testElement).gap === '10px';
    document.body.removeChild(testElement);
    return supportsGap;
}

function detectBrowser() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";

    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "safari";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        browserName = "internet-explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "edge";
    }

    return browserName;
}

function setBrowserName() {
    var browser = detectBrowser();
    doc.querySelector('body').classList.add(browser);
}

function showMessage(text) {
    var el = doc.getElementById('message');
    el.querySelector('.modal__title').innerHTML = text;
    openModal(el);
    setTimeout(function () {
        closeModal({
            element: el
        });
    }, 1000);
}

function emojiInit() {
    var script = doc.getElementById("emoji-button-script");
    if (script === null) return;
    const triggerButton = document.querySelector('#emoji-trigger');
    const inputField = document.querySelector('#message-input');
    const pickerContainer = document.querySelector('#emoji-picker');
    if (pickerContainer === null) return;
    const picker = new EmojiMart.Picker({
        onEmojiSelect: emoji => {
            inputField.value += emoji.native;
            pickerContainer.style.display = 'none';
        },
        theme: 'light'
    });
    pickerContainer.appendChild(picker);
    triggerButton.addEventListener('click', () => {
        pickerContainer.style.display = pickerContainer.style.display === 'none' ? 'block' : 'none';
    });
}

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
    if (element !== null) {
        element.classList.remove('open');
    } else {
        doc.querySelectorAll('.modal-window.open').forEach(function (element, index) {
            element.classList.remove('open');
        });
    }
    var modalsCount = doc.querySelectorAll('.modal-window.open').length;
    if (modalsCount === 0) doc.querySelector('body').classList.remove('open-modal');
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
    var bigChart = doc.querySelector('.main-content .main-data-container-chart');
    if (chart !== null) {
        chart.classList.add('loading');
        setTimeout(function () {
            chartReinit(doc.querySelector('.main-content .main-data-chart'));
        }, 1000);
    }
    if (bigChart !== null) {
        bigChart.classList.add('loading');
        setTimeout(function () {
            chartReinit(bigChart);
        }, 1000);
    }

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
    var type = element.getAttribute('data-type') || 'line';
    var customLegendItems = element.getAttribute('data-custom-legend-items') || false;
    var strokeWidth = 3;
    if (element.classList.contains('small-chart')) {
        strokeWidth = 10;
    }
    var categories = json.categories;
    var series = json.series;
    if (categories && series) {
        var legend = {
            show: !!customLegendItems,
            showForSingleSeries: true,
            customLegendItems: customLegendItems ? customLegendItems.split(',') : [],
            position: 'bottom',
        };
        var chart = new ApexCharts(element, {
            chart: {
                type: type,
                toolbar: {
                    show: false
                },
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
            },
            legend: legend,
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




