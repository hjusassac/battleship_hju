// EXCERCISE "BATTLESHIP GAME"


// ~~~~~~~~~~~~~~~~~~ IMAGE SOURCES ~~~~~~~~~~~~~~~~~~
const marks = ["./images/qmark.svg", "./images/omark.svg", "./images/xmark.svg"];

// ~~~~~~~~~~~~~~~~~~ DOM ELEMENTS ~~~~~~~~~~~~~~~~~~
const flxCtn = document.getElementById('flex')
const span = document.getElementsByTagName('span');
const starter = document.getElementById('game');
const button = document.getElementsByTagName("button");
const section1 = document.querySelectorAll('section')[0];

// ~~~~~~~~~~~~~~~~~~ CREATE BOAT COORDINATES ~~~~~~~~~~~~~~~~~~
let boatCoor, rotaCase, count=0, wincount=0;

const arrCreator = (x) => {
    let arr = [];
    for(let i=0; i<x; i++) {
        arr.push(i+1);
    }
    return arr;
}

const rdmNumGen = (x) => {   // will return random element in the argument array
    let rand = Math.floor(Math.random()*x.length); 
    let rValue = x[rand]; 

    return rValue;
}

const boatHead = (x) => {
    x = arrCreator(x);
    let res = [rdmNumGen(x)];
    res.push(rdmNumGen(x));

    return res;
}

const boatTail = (x,y) => {
    let A = x[0], B = x[1]; // [A,B]
    let res = [[A+1, B], [A-1, B], [A, B+1], [A, B-1]];
    for(let i=3; i>=0; i--) {
        // console.log(`for ${y} by ${y}, running`);
        let check = res[i];
        let bTX = check[0], btY = check[1];
        if(bTX*btY == 0 || bTX == y+1 || btY == y+1) {
            res.splice(i,1);
            // console.log(check + '  is removed');
        }
    }
    let result = rdmNumGen(res)
    if(result[0] == A-1 && result[1] == B) rotaCase = 'rotaB';
    else if(result[0] == A && result[1] == B+1) rotaCase = 'rotaC';
    else if(result[0] == A && result[1] == B-1) rotaCase = 'rotaD';
    else rotaCase = '';

    return result;
}

const putBoat = (x) => {
    room(x);
    let bH = boatHead(x)
    let bT = boatTail(bH,x);
    boatCoor = [bH, bT];    //~~~~~~~~~~~~~~~~~~ BOAT COORDINATES RESULT
}

const room = (x) => {       // to create x*x space on HTML
    for(let i=1; i<x+1; i++) {
        for(let j=1; j<x+1; j++){
            creElm(flxCtn, 'span', '', '', 'data-x', j, 'data-y', i);
        }
    }
    for(let i=0; i<span.length; i++) {      // give the span right size
        span[i].style.width = `-webkit-calc((510px/${x} - 2px))`;
        span[i].style.height = `-webkit-calc((510px/${x} - 2px))`;
    }
}

const creElm =(prnt, tagN, inner, clsN, att1, val1, att2, val2)=> {       // this will create a new element in a parent tag
    let newE= document.createElement(tagN);
    newE.innerHTML = inner;
    if(clsN) newE.classList.add(clsN);
    if(att1 && val1) {
        newE.setAttribute(att1, val1);
        if(att2 && val2) newE.setAttribute(att2, val2);
    }
    prnt.appendChild(newE);
}


//~~~~~~~~~~~~~~~~~~ COORDINATES MATCH ~~~~~~~~~~~~~~~~~~

const inputValidator = (x) => {       // check if the input matches the coordinate
    let res = false, boatH = '';
    if(x[0] == boatCoor[0][0] && x[1] == boatCoor[0][1]) {
        res = true;
        boatH = 1;
    }
    else if(x[0] == boatCoor[1][0] && x[1] == boatCoor[1][1]) {
        res = true;
        boatH = 2;
    }
    return [res, boatH];
}

const getAttributeData = (x) => {
    let corX = x.getAttribute('data-x');
    let corY = x.getAttribute('data-y');
    let coor = [parseInt(corX), parseInt(corY)];    
    return inputValidator(coor);
}

const boatAt = (i) => {     // this gives the class to the span that has boat coordinate id
    let x = getAttributeData(span[i]);
    if (x[0]) {
        if (x[1] == 1) {
            span[i].id = 'bHead';
            span[i].className = rotaCase;
        }
        if (x[1] == 2) {
            span[i].id = 'bTail';
            span[i].className = rotaCase;
        }
    }
}

const mOver = (e) => {          //~~~~~~~~~~~~~~~~~~ mouse enter -> display ? mark
    creElm(e.target, 'img', '', 'mOver', 'src', marks[0])
}

const mOff = (e) => {           //~~~~~~~~~~~~~~~~~~ mouseleave -> delete ?, o, x marks
    setTimeout(() => {
        e.target.innerHTML = "";
    }, 200)     // 0.2초 후에 위 코드를 실행요청
}

const slct = (e) => {          //~~~~~~~~~~~~~~~~~~ when click
    let tar = e.currentTarget;  // instead of e.target, e.currentTarget refers to the element that's been added with the eventListener
    let x = getAttributeData(tar);
    let marksrc=2, msg='MISSED!', endMsg='YOU LOST!', win=false;
    if(x[0]) {
        marksrc = 1;
        msg = 'GOTCHA!';
        wincount ++;
        endMsg = 'YOU WIN!';
        win=true;
    }
    tar.classList.add('selected');
    tar.firstChild.src = marks[marksrc];
    tar.firstChild.classList.remove('mOver');
    creElm(tar, 'p', msg, "fadeOutUp");
    checkGameOver(win, endMsg);
}

const gameStart =(x, y)=> {
    button[0].removeEventListener("click", gamePlay);
    setTimeout(() => {
        starter.classList.add('hidden');    // Play 버튼 레이어 숨김
        document.querySelector('#walking + div p').innerHTML = `LEVEL ${wincount+1}`;
        if(wincount==4) document.querySelector('#walking + div p').innerHTML += `: FINAL`;
        putBoat(y);
        for(let i=0; i<span.length; i++) {
            boatAt(i);
            span[i].addEventListener('mouseenter', mOver);
            span[i].addEventListener('mouseleave', mOff);
            span[i].addEventListener('click', slct);
        }
    }, 2000/(x+1));
}

const checkGameOver = (winX, endMsgY) => {
    let miss = document.querySelectorAll('.selected');
    let shot = document.querySelectorAll('.selected#bHead, .selected#bTail').length;
    if(shot == 1 || miss.length == 3) {             // condition to GAMEOVER
        setTimeout(() => {
            creElm(flxCtn, 'h1', endMsgY,'');
            if(winX) document.querySelector('#flex h1').id= 'winner';
        },500);
        for(let i=0; i<span.length; i++){
            span[i].classList.add('selected');
            span[i].removeEventListener('mouseenter', mOver);
            span[i].removeEventListener('click', slct);     
        }
        setTimeout(() => {gameOver(winX)}, 3000);
    }
}

const gameOver = (x) => {
    if(wincount<5) {
        button[0].addEventListener("click", gamePlay);
        button[0].innerHTML = x? 'LEVEL UP':'REPLAY';
        document.querySelector("#game img").id = 'float';
        starter.classList.remove('hidden');    // Play 버튼 레이어 호출
    } else {
        setTimeout(() => {
            document.getElementById('winner').innerHTML='END OF GAME';
            creElm(flxCtn.parentElement.firstElementChild, 'section', '');
            let a = document.querySelectorAll('section')[0];
            creElm(a,'button', 'RE-START','', 'id', 'restart');
            congratsAnimation(a);
            button[0].addEventListener("click", gamePlay);
            wincount=0;
        },500);
    }
}

const boatOff = () => {
    flxCtn.innerHTML='';    // clear all the span for next game
}


//~~~~~~~~~~~~~~~~~~ PLAY ~~~~~~~~~~~~~~~~~~

const gamePlay = () => {
    if(button.length>1) document.querySelectorAll('section')[0].remove();
    if(count == 0) {
        document.querySelector("#float").id = 'fly';
        gameStart(count, 5);
    } else {
        boatOff();
        gameStart(200, 5+wincount);
    }
    count ++;
}

button[0].addEventListener("click", gamePlay);



// do some decoration~~

const bgImg = [`url(https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/main_image_star-forming_region_carina_nircam_final-5mb.jpg)`, `url(https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg)`];

document.querySelector('body').style.background = navigator.onLine ? `${rdmNumGen(bgImg)} center center / cover`:'black';

const txt = ['HOW', 'LUCKY', 'ARE', 'YOU?', 'JUST', 'TRY', 'YOUR', 'LUCK!'];
const mvTxt = document.querySelector('#walking');

for(let i=0; i<3; i++){
    for(let j=0; j<txt.length; j++) {
        creElm(mvTxt, 'p', txt[j]);
    }
}



// END OF GAME congratulations effects

const createCongrats = (section, x, y, i) => {
    creElm(section, 'div', '', 'congrats', 'style', `top:${x}%;left:${y}%;`);
    let ithCongrats = document.querySelectorAll('.congrats');
    ithCongrats[i].innerHTML = `
<img class="ship" src="./images/spaceShuttle.png" alt="">
<div class="explosions">
    <img class="explosion1" src="./images/explosion.png" alt="">
    <img class="explosion2" src="./images/explosion.png" alt="">
</div>
<div class="targets">
    <img class="target1" src="./images/targetMark.svg" title="http://www.onlinewebfonts.com">
    <img class="target2" src="./images/targetMark2.svg" title="http://www.onlinewebfonts.com">
</div>`
    if(i>3) {
        ithCongrats[0].remove();
    }
}
const congratsAnimation = (sec) => {
    let x, y, iter = 0;
    setInterval(() => {
            x = Math.floor(Math.random()*101)-10;
            y = Math.floor(Math.random()*90)-25;
            createCongrats(sec, x,y,iter);
            if(iter<4) iter++;
    }, 1200)
}