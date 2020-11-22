const carouselIndicatorStyle = "carousel-indicator";
const carouselIndicatorHighlightedStyle = "carousel-indicator-selected";
const carouselNavLeftStyle = "carousel-left";
const carouselNavRightStyle = "carousel-right";
const carouselPresenterStyle = "carousel-presenter";
const carouselPresenterBackStyle = "carousel-presenter-back";
const carouselPresenterLeftStyle = "carousel-presenter-left";
const carouselPresenterFrontStyle = "carousel-presenter-front";
const carouselPresenterRightStyle = "carousel-presenter-right";

let slides = [
    "assets/feature-1.png",
    "assets/feature-2.png",
    "assets/feature-3.png",
    "assets/feature-4.png",
    "assets/feature-5.png",
    "assets/feature-6.png",
];
let indicators = [];
let carouselFrame = document.getElementById("carousel-frame");
let carouselPresenter = [];
let navLeft;
let navRight;

let carouselIndex = 0;
let intervalID = null;

function normalizeCarouselIndex(index) {
    return index < 0 ?
        slides.length + (index % slides.length) :
        index % slides.length;
}

function restartInterval() {
    if(intervalID != null) {
        clearInterval(intervalID)
    }

    intervalID = setInterval(function () {
        changeActiveSlide(normalizeCarouselIndex(carouselIndex + 1));
        changeSelectedIndicator(normalizeCarouselIndex(carouselIndex + 1));
    }, 5000);
}

function changeSelectedIndicator(val) {
    if (val < indicators.length && val >= 0 && indicators.length > 0) {
        indicators[carouselIndex].classList.remove(carouselIndicatorHighlightedStyle);
        indicators[val].classList.add(carouselIndicatorHighlightedStyle);
        carouselIndex = val;
    }
}

function createPresenterNode(initialRole) {
    let div = document.createElement("div");
    div.classList.add(carouselPresenterStyle);
    div.classList.add(initialRole);
    carouselPresenter.push(div);
    carouselFrame.appendChild(div);
    return div;
}

function indicatorClick(e) {
    changeActiveSlide(indicators.indexOf(e.target));
    changeSelectedIndicator(indicators.indexOf(e.target));
    restartInterval();
}

function arrowLeftClick(e) {
    changeActiveSlide(normalizeCarouselIndex(carouselIndex - 1));
    changeSelectedIndicator(normalizeCarouselIndex(carouselIndex - 1));
    restartInterval();
}

function arrowRightClick(e) {
    changeActiveSlide(normalizeCarouselIndex(carouselIndex + 1));
    changeSelectedIndicator(normalizeCarouselIndex(carouselIndex + 1));
    restartInterval();
}

function changeActiveSlide(index) {
    if(index >= 0 && index < slides.length) {
        // Figure out what direction should we slide
        // The slide direction: false -> left, true -> right
        let direction = false;

        if (normalizeCarouselIndex(carouselIndex + 1) === index) {
            direction = false;
        }
        else if (normalizeCarouselIndex(carouselIndex - 1) === index) {
            direction = true;
        }               // backward
        else {
            let l = Math.max(carouselIndex, index);
            let m = Math.min(carouselIndex, index);

            //           inward step    outward step
            direction = (l - m) - Math.abs(l - slides.length - m) > 0
        }


        let back = carouselPresenter.find(value => value.classList.contains(carouselPresenterBackStyle));
        let left = carouselPresenter.find(value => value.classList.contains(carouselPresenterLeftStyle));
        let front = carouselPresenter.find(value => value.classList.contains(carouselPresenterFrontStyle));
        let right = carouselPresenter.find(value => value.classList.contains(carouselPresenterRightStyle));

        // set background
        back.style.backgroundImage = `url('${slides[normalizeCarouselIndex(direction ? index - 1 : index + 1)]}')`;
        left.style.backgroundImage = `url('${slides[normalizeCarouselIndex(direction ? index : index - 2)]}')`;
        front.style.backgroundImage = `url('${slides[normalizeCarouselIndex(direction ? index + 1 : index - 1)]}')`;
        right.style.backgroundImage = `url('${slides[normalizeCarouselIndex(direction ? index + 2 : index)]}')`;

        // change styles
        back.classList.replace(carouselPresenterBackStyle, direction ? carouselPresenterLeftStyle : carouselPresenterRightStyle);
        left.classList.replace(carouselPresenterLeftStyle, direction ? carouselPresenterFrontStyle : carouselPresenterBackStyle);
        front.classList.replace(carouselPresenterFrontStyle, direction ? carouselPresenterRightStyle : carouselPresenterLeftStyle);
        right.classList.replace(carouselPresenterRightStyle, direction ? carouselPresenterBackStyle : carouselPresenterFrontStyle);
    }
}

// Get nav bar
let cn = document.getElementById("carousel-nav").children;
for(let i = 0; i < cn.length; i++) {
    if(cn[i].className.includes(carouselIndicatorStyle)) {
        cn[i].addEventListener("mousedown", indicatorClick);
        indicators.push(cn[i]);
    } else if (cn[i].className.includes(carouselNavLeftStyle)) {
        cn[i].addEventListener("mousedown", arrowLeftClick);
        navLeft = cn[i];
    } else if (cn[i].className.includes(carouselNavRightStyle)) {
        cn[i].addEventListener("mousedown", arrowRightClick);
        navRight = cn[i];
    }
}

// Generate presenter
createPresenterNode(carouselPresenterBackStyle);
createPresenterNode(carouselPresenterLeftStyle);
createPresenterNode(carouselPresenterFrontStyle);
createPresenterNode(carouselPresenterRightStyle);

changeActiveSlide(0);
changeSelectedIndicator(0);
restartInterval();