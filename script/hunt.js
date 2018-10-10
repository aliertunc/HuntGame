var anim_id;
var gameover = false;
var bird1 = $('#bird1'),
    bird2 = $('#bird2'),
    bird3 = $('#bird3'),
    bird4 = $('#bird4'),
    bird5 = $('#bird5'),
    bird6 = $('#bird6');
var shooter = $('#shooter'),
    center = $('#center');
var mainWidth = $('#main').width(),
    mainTop = $('#main').width();
var myObj = {
    "birds": [
        { "id": "bird1", "speed": "3", "isdown": false, "falltop": "0", "fallleft": "0", "flyway": "l" },
        { "id": "bird2", "speed": "2", "isdown": false, "falltop": "0", "fallleft": "0", "flyway": "l" },
        { "id": "bird3", "speed": "1", "isdown": false, "falltop": "0", "fallleft": "0", "flyway": "l" },
        { "id": "bird4", "speed": "3", "isdown": false, "falltop": "0", "fallleft": "0", "flyway": "r" },
        { "id": "bird5", "speed": "2", "isdown": false, "falltop": "0", "fallleft": "0", "flyway": "r" },
        { "id": "bird6", "speed": "1", "isdown": false, "falltop": "0", "fallleft": "0", "flyway": "l" }
    ]
}
var score = 0,
    shootCount = 50;
var sniperAudio = document.getElementById('sniper');

function changeLeft(birdAny) {
    try {
        var currentleft = parseInt($("#" + birdAny).css('left'));
        var index = parseInt(birdAny.slice(-1));
        var speedLeft = parseInt(myObj.birds[index - 1].speed);

        if (currentleft > mainWidth) {
            speedLeft = flySpeed();
            myObj.birds[index - 1].speed = speedLeft;
            $("#" + birdAny).css('left', -350 + 'px');
            changeTop(birdAny);
        }
        $("#" + birdAny).css('left', parseInt($("#" + birdAny).css('left')) + speedLeft + 'px');
    } catch (error) {
        console.log(error.message);
    }
}

function changeRight(birdAny) {
    try {
        var currentleft = parseInt($("#" + birdAny).css('left'));
        var index = parseInt(birdAny.slice(-1));
        var birdWidth = parseInt($("#" + birdAny).css('width'));
        var speedRight = parseInt(myObj.birds[index].speed);
        if (currentleft + birdWidth < 0) {
            $("#" + birdAny).css('left', mainWidth + 350 + 'px');
            speedRight = flySpeed();
            changeTop(birdAny);
        }
        $("#" + birdAny).css('left', parseInt($("#" + birdAny).css('left')) - speedRight + 'px');
    } catch (error) {
        console.log(error.message);
    }
}

function changeTop(birdAny) {
    var min = parseInt($("#" + birdAny).css('height'));
    var max = parseInt($('#main').height() - parseInt($("#" + birdAny).css('height')));
    var newTop = birdTop(min, max);
    $("#" + birdAny).css('top', newTop);
}
anim_id = requestAnimationFrame(repeat);

function repeat() {
    if (shootCount == 0) {
        stopGame();
    } else {
        var state1 = myObj.birds[0].isdown,
            state2 = myObj.birds[1].isdown,
            state3 = myObj.birds[2].isdown,
            state4 = myObj.birds[3].isdown,
            state5 = myObj.birds[4].isdown,
            state6 = myObj.birds[5].isdown;
        var falltop1 = myObj.birds[0].falltop,
            falltop2 = myObj.birds[1].falltop,
            falltop3 = myObj.birds[2].falltop,
            falltop4 = myObj.birds[3].falltop,
            falltop5 = myObj.birds[4].falltop,
            falltop6 = myObj.birds[5].falltop;
        changeLeft('bird1');
        changeLeft('bird2');
        changeLeft('bird3');
        changeRight('bird4'); //right
        changeRight('bird5'); //right
        changeLeft('bird6');
        downFallBird(1, falltop1, state1);
        downFallBird(2, falltop2, state2);
        downFallBird(3, falltop3, state3);
        downFallBird(4, falltop4, state4);
        downFallBird(5, falltop5, state5);
        downFallBird(6, falltop6, state6);
        anim_id = requestAnimationFrame(repeat);
    }

}

function flySpeed() {
    return Math.floor((Math.random() * 10) + 1);
}
//google dan 
function birdTop(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function checkShot() {
    if (gameover === false) {
        for (let index = 1; index < 7; index++) {
            var bird = $('#' + "bird" + index.toString());
            if (collision(center, bird)) {

                var fallBirdTop = parseInt(bird.css('top')),
                    fallBirdLeft = parseInt(bird.css('left'));

                var point = myObj.birds[index - 1].speed;
                myObj.birds[index - 1].falltop = fallBirdTop;

                var way = myObj.birds[index - 1].flyway;
                restartBird(bird, way);

                addFallBird(index, fallBirdTop, fallBirdLeft);
                score = scoreUpdate(score, point);
                break;
            }
        }
        shootCount = shootUptdate(shootCount);
    }
}

function moveShooter() {
    parseInt($('#shooter').css('left')) / 2;
}

$("#main").mousemove(function(event) {

    $('#shooter').css('left', event.pageX - 36 + 'px');
    $('#shooter').css('top', event.pageY - 36 + 'px');

    $('#center').css('left', event.pageX - 18 + 'px');
    $('#center').css('top', event.pageY - 18 + 'px');

});

$(window).click(function() {
    playAudio();
    checkShot();
});

function shootUptdate(number) {
    $('#shoot').text(shootCount - 1);
    return number - 1;
}

function scoreUpdate(number1, number2) {
    $('#score').text(parseInt(number1) + parseInt(number2));
    return parseInt(number1) + parseInt(number2);
}

function playAudio() {
    if (parseFloat(sniperAudio.currentTime) !== 0.000000) {
        sniperAudio.currentTime = 0;
    }
    sniperAudio.play();
}

function addFallBird(index, fallnewtop, fallNewLeft) {
    $("#fallBird" + index).remove();
    $("<div />", { "class": "fallBird", id: "fallBird" + index })
        .append($("<img />", { src: "images/fall.png", id: "name" + index }))
        .appendTo("#main");
    $('#fallBird' + index).css('top', fallnewtop);
    $('#fallBird' + index).css('left', fallNewLeft + $('#fallBird' + index).width() / 2);
    myObj.birds[index - 1].isdown = true;
}

function downFallBird(index, fallnewtop, state) {
    if (fallnewtop < mainTop && state === true) {
        fallnewtop = fallnewtop + 1;
        myObj.birds[index - 1].falltop = fallnewtop;
        $('#fallBird' + index).css('top', fallnewtop);
    }
}

function restartBird(bird, way) {
    if (way === "l") {
        bird.css('left', mainWidth + 10);
    }
    if (way === "r") {
        bird.css('left', -350);
    }
}

function stopGame() {
    cancelAnimationFrame(anim_id);
    gameover = true;
    $('#game').css({ 'display': 'none' });
    // $("p:first").addClass("intro");
    $('#main').css({ 'background-image': 'url(images/gameover.png)' })
        // .css({ 'background-image': 'url(1.jpg)' })
}