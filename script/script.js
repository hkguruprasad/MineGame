var numberOfFlags;
var toDiscover;
var arrayMines = new Array();
var timer = false;
var count = 0;


function init() {
    $(document).bind("contextmenu", function (e) {
        return false;
    });
    $('#mineField').html('');
    $("#status").removeClass('won lost');
    $("#status").text("");
    columns = $("[name='columns']").val();
    rows = $("[name='rows']").val();
    mineCount = $("[name='mineCount']").val();
    numberOfFlags = mineCount;
    toDiscover = columns * rows - mineCount;
    $('#mineGrid').width(columns * 21);
    $('#mineGrid').height(rows * 21 + 52);
    $('#bombCountt').html(("00" + numberOfFlags).slice(-3));

    //Building the table
    for (var i = 0; i < rows; i++) {
        arrayMines[i] = new Array();
        for (var j = 0; j < columns; j++) {
            arrayMines[i][j] = 0;
            $("#mineField").append("<input type='button' class='mineBox' id=" + i + "_" + j + " value='' onclick='checkMines(" + i + "," + j + ")' oncontextmenu='markFlagged(" + i + "," + j + ")'/>");
        }
        $("#mineField").append('<br>');
    }

    //Assigning mines randomly
    var i = 0;
    while (i < mineCount) {
        var x = Math.floor(Math.random() * rows);
        var y = Math.floor(Math.random() * columns);
        if (arrayMines[x][y] === 0) {
            arrayMines[x][y] = 1;
            i++;
        }
    }
    timer = true;
    count = 0;
}

function checkMines(i, j) {
    if (arrayMines[i][j] > 1) {
        markFlagged(i, j);
    } else if (arrayMines[i][j] == 1) {
        $("#" + i + "_" + j).addClass("active");
        timer = false;
        showBombs();
        $("#status").addClass("lost");
        $("#status").text("Game Over!!!");
        //init();
    } else {
        $("#" + i + "_" + j).addClass("active");
        $("#" + i + "_" + j).attr('onclick', '');
        toDiscover--;
        var number = countMines(i, j);
        if (number !== 0) {
            $("#" + i + "_" + j).prop('value', number);
        }
        else {
            for (var x = Math.max(0, i - 1); x <= Math.min(rows - 1, i + 1); x++){
                for (var y = Math.max(0, j - 1); y <= Math.min(columns - 1, j + 1); y++){
                    if (arrayMines[x][y] < 2 && !$("#" + x + "_" + y).hasClass('active')) {
                        checkMines(x, y);
                    }
                }
            }
        }
        confirmWin();
    }
}

function countMines(i, j) {
    var k = 0;
    for (var x = Math.max(0, i - 1); x <= Math.min(rows - 1, i + 1); x++){
        for (var y = Math.max(0, j - 1); y <= Math.min(columns - 1, j + 1); y++) {
            if (arrayMines[x][y] == 1 || arrayMines[x][y] == 3) {
                k++;
            }
        }
    }
  
    return k;
}

function markFlagged(i, j) {
    if (!$("#" + i + "_" + j).hasClass('active')) {
        if (arrayMines[i][j] < 2) {
            if (numberOfFlags > 0) {
                arrayMines[i][j] += 2;
                $("#" + i + "_" + j).prop('value', "F");
                $("#" + i + "_" + j).css("color", "#FF0000");
                numberOfFlags--;
            }
        } else {
            arrayMines[i][j] -= 2;
            $("#" + i + "_" + j).prop('value', "");
            $("#" + i + "_" + j).css("color", "");
            numberOfFlags++;
        }
    }
    $('#bombCount').html(("00" + numberOfFlags).slice(-3));
}

function showBombs() {
    for (var i = 0; i < rows; i++)
    for (var j = 0; j < columns; j++) {
        if (arrayMines[i][j] == 1) {
            $("#" + i + "_" + j).prop('value', "*");
            $("#" + i + "_" + j).css("font-size", "20px");
            $("#" + i + "_" + j).css("background-color", "#FF0000");
        }
        $("#" + i + "_" + j).attr('onclick', 'init()');
    }
}

function confirmWin() {
    if (toDiscover === 0) {
        timer = false;
        for (var i = 0; i < rows; i++)
        for (var j = 0; j < columns; j++) {
            if (arrayMines[i][j] == 1) {
                $("#" + i + "_" + j).prop('value', "F");
                $("#" + i + "_" + j).css("color", "#FF0000");
            }
            $("#" + i + "_" + j).attr('onclick', 'init()');
        }
        $("#status").addClass("won");
        $("#status").text("Congrats. You Win!!!")
        toDiscover = -1;
    }
}