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


/**
 * This is to pick a random item from an array.
 * @param {array} x any array
 * @returns random item from the argument array
 */
const pickRandom = (x) => {
    let rand = Math.floor(Math.random()*x.length); 
    return x[rand];
}

/**
 * This is to have an array with two number items.
 * @param {number} x make an array [1, 2, ..., x] and pick a random item two times
 * @returns [number, number]
 */
const boatHead = (x) => {
    let arr = [];
    for(let i=0; i<x; i++) arr.push(i+1);
    return [pickRandom(arr), pickRandom(arr)];
}

/**
 * This is to pick a random item from an array that has 4 array items [[?, ?], [?, ?], [?, ?], [?, ?]]
 * @param {array} x get an array from boatHead function and create another array with 4 item arrays
 * @param {number} y limit the number items from getting bigger than y
 * @returns [number, number]
 */
const boatTail = (x,y) => {
    let A = x[0], B = x[1]; // x=[A,B]
    let res = [[A+1, B], [A-1, B], [A, B+1], [A, B-1]];
    for(let i=3; i>=0; i--) {
        let bt = res[i];
        if(bt[0]*bt[1]*(bt[0]-(y+1))*(bt[1]-(y+1)) == 0) res.splice(i,1);
    }
    x = pickRandom(res)
    if(x[0] == A-1 && x[1] == B) rotaCase = 'rotaB';
    else if(x[0] == A && x[1] == B+1) rotaCase = 'rotaC';
    else if(x[0] == A && x[1] == B-1) rotaCase = 'rotaD';
    else rotaCase = '';

    return x;
}

/**
 * This will create a coordinate for each element, boatHead and boatTail.
 * Also create the coordinate plane on HTML.
 * @param {number} x this is to limit the size of the coordinate plane to x*x
 */
const putBoat = (x) => {
    room(x);
    let bH = boatHead(x);
    boatCoor = [bH, boatTail(bH,x)];    //~~~~~~~~~~~~~~~~~~ BOAT COORDINATES RESULT
}

/**
 * This will create x*x spans as a coordinate plane in HTML.
 * @param {number} x limit the size of the coordinate plane to x*x
 */
const room = (x) => {
    for(let i=1; i<x+1; i++) {
        for(let j=1; j<x+1; j++) creElm(flxCtn, 'span', '', '', 'data-x', j, 'data-y', i);
    }
    for(let i=0; i<span.length; i++) span[i].style.width = `-webkit-calc((510px/${x} - 2px))`;
}

/**
 * This is to create an element in HTML!
 * @param {string} prnt where you want to create the element in
 * @param {string} tagN give a tage name | ex, "div"
 * @param {string} inner give contents for innerHTML
 * @param {string} clsN give a class name, optional arguments from this
 * @param {string} att1 give an attribute | ex, "id"
 * @param {string} val1 give a value for the attribute above | ex, "hello"
 * @param {string} att2 give another attribute | ex, "src"
 * @param {string} val2 give a value for the attribute above | ex, "./images/image.png"
 */
const creElm =(prnt, tagN, inner, clsN, att1, val1, att2, val2)=> {
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

/**
 * This will check if the input matches with the given coordinates from putBoat function.
 * The return can be 
 * 1) [false, false]
 * 2) [true, true] if x matches with boatHead
 * 3) [true, false] if x matches with boatTail
 * @param {array} x [number, number]
 * @returns [boolean, boolean]
 */
const inputValidator = (x) => {
    let res = false, boatH = false;
    if(x[0] == boatCoor[0][0] && x[1] == boatCoor[0][1]) {
        res = true;
        boatH = true;
    }
    else if(x[0] == boatCoor[1][0] && x[1] == boatCoor[1][1]) res = true;
    return [res, boatH];
}

/**
 * This is to check if the arguent HTML element has a data attribute that matches with the given coordinates.
 * @param {*} x input should be an HTML element
 * @returns [boolean, '' | number] from inputValidator function
 */
const getAttributeData = (x) => {
    let corX = x.getAttribute('data-x');
    let corY = x.getAttribute('data-y');
    let coor = [parseInt(corX), parseInt(corY)];    
    return inputValidator(coor);
}

/**
 * This is to give an id to the span that has the right data attribute.
 * @param {number} i 
 */
const boatAt = (i) => {     
    let x = getAttributeData(span[i]);
    if (x[0]) {
        span[i].className = rotaCase;
        span[i].id = x[1]? 'bHead':'bTail';
    }
}

/**
 * This is to display ? mark when mouse enters the HTML element event target.
 * @param {*} e refers to the event object
 */
const mOver = (e) => {          //~~~~~~~~~~~~~~~~~~ mouse enter -> display ? mark
    creElm(e.target, 'img', '', 'mOver', 'src', marks[0]);
}

/**
 * This is to delete ?, O, X marks when the mouse leaves the HTML element event target.
 * @param {*} e refers to the event object
 */
const mOff = (e) => {
    setTimeout(() => {e.target.innerHTML = "";}, 200);
}

/**
 * This is to check if the user clicked on the right HTML element with a data attribute that matches with the given coordinates.
 * If no, show message 'MISSED!' and display X mark.
 * If yes, show message 'GOTCHA!', display O mark and increment wincount to level up.
 * @param {*} e refers to the event object
 */
const slct = (e) => {
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
    tar.firstChild.classList.remove('mOver');
    tar.firstChild.src = marks[marksrc];
    creElm(tar, 'p', msg, "fadeOutUp");
    checkGameOver(win, endMsg);
}

/**
 * This is to prepare fot starting the game.
 * 1) Hide Play button layer. 
 * 2) Display level. 
 * 3) Fire putBoat function. 
 * 4) Add event-listeners to each span.
 * @param {number} x This is to set the timeout seconds, from variable count
 * @param {number} y This is to set the coordinate plane -> y*y
 */
const gameStart =(x, y)=> {
    button[0].removeEventListener("click", gamePlay);
    if(x!=0) x=200;
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

/**
 * This is to check if the user selected the right span or ran out of given 3 chances.
 * If so, remove event-listeners from the spans, display endMsgY and execute gameOver function in 3 seconds.
 * @param {boolean} winX If true, endMsgY = 'YOU WIN!'. Otherwise, endMsgY = 'YOU LOST!'
 * @param {string} endMsgY 
 */
const checkGameOver = (winX, endMsgY) => {
    let miss = document.querySelectorAll('.selected');
    if(winX || miss.length == 3) {             // condition to GAMEOVER
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

/**
 * This is to display Play button layer again when the game is over.
 * If the user defeated the final level, the user will see 
 * 1) 'END OF GAME' message on a darker layer on top of everything
 * 2) with a RE-START button.
 * 3) Congratulations animation
 * @param {boolean} x If win, show 'LEVEL UP' button. Otherwise, 'REPLAY' button.
 */
const gameOver = (x) => {
    if(wincount<5) {
        button[0].addEventListener("click", gamePlay);
        button[0].innerHTML = x? 'LEVEL UP':'REPLAY';
        document.querySelector("#game img").id = 'float';
        starter.classList.remove('hidden');
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



//~~~~~~~~~~~~~~~~~~ PLAY ~~~~~~~~~~~~~~~~~~

/**
 * When the user presses on Play button, gameStart function will be executed after the following happens
 * 1) If after a cycle of 5 levels, remove the section with congratulations animation and stop the interval animation.
 * 2) If the 1st trial, show starting animation of the battleship flying away into the screen.
 * 3) If after the 1st trial, clear all the spans in the container for next game.
 */
const gamePlay = () => {
    if(button.length>1) {
        document.querySelectorAll('section')[0].remove();
        endCongrats();
    }
    count ==0 ? document.querySelector("#float").id = 'fly':flxCtn.innerHTML='';
    gameStart(count, 5+wincount);
    count ++;
}

button[0].addEventListener("click", gamePlay);



// do some decoration~~

const bgImgs = [`url(https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/main_image_star-forming_region_carina_nircam_final-5mb.jpg)`, `url(https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/main_image_deep_field_smacs0723-5mb.jpg)`];

document.querySelector('body').style.background = `${pickRandom(bgImgs)} center center / cover`;
if(!navigator.onLine) document.querySelector('body').style.backgroundColor = 'black';

const txts = ['HOW', 'LUCKY', 'ARE', 'YOU?', 'JUST', 'TRY', 'YOUR', 'LUCK!'];
const mvTxt = document.querySelector('#walking');

for(let i=0; i<3; i++){
    for(let j=0; j<txts.length; j++) creElm(mvTxt, 'p', txts[j]);
}



// END OF GAME congratulations effects

/**
 * This is to create 4 div elements with images for congratulaitons aimation in the given section.
 * If there's more than 4 divs, the first div element at the moment will be removed.
 * @param {*} section refers to an HTML element with tag name 'section' that you want to create the divs
 * @param {number} x refers to the absoulte position location from top
 * @param {number} y refers to the absoulte position location from left
 * @param {number} i THis is to refer to last div element.
 */
const createCongrats = (section, x, y, i) => {
    let inH = `
    <img class="ship" src="./images/spaceShuttle.png" title="https://www.vhv.rs/viewpic/hobhohT_sci-fi-art-png-clipart-sci-fi-starship/">
    <div class="explosions">
        <img class="explosion1" src="./images/explosion.png" title="https://www.pngitem.com/middle/hmhmbJm_explosion-png-download-explosion-transparent-png/">
        <img class="explosion2" src="./images/explosion.png" title="https://www.pngitem.com/middle/hmhmbJm_explosion-png-download-explosion-transparent-png/">
    </div>
    <div class="targets">
        <img class="target1" src="./images/targetMark.svg" title="http://www.onlinewebfonts.com">
        <img class="target2" src="./images/targetMark2.svg" title="http://www.onlinewebfonts.com">
    </div>`;
    creElm(section, 'div', inH, 'congrats', 'style', `top:${x}%;left:${y}%;`);
    if(i>3) document.querySelector('.congrats').remove();
}
let startCongrats;
/**
 * This is to give random absolute position to the congratulations animaiton images.
 * @param {*} sec refers to an HTML element
 */
const congratsAnimation = (sec) => {
    let x, y, iter = 0;
    startCongrats = setInterval(() => {
        x = Math.floor(Math.random()*101)-10;
        y = Math.floor(Math.random()*90)-25;
        createCongrats(sec, x,y,iter);
        if(iter<4) iter++;
    }, 1200)
}
/**
 * This is to end the Interval animation.
 */
const endCongrats = () => {
    clearInterval(startCongrats);
    startCongrats='';
}