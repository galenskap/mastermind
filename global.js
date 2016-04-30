// Set this to true for debug mode (shows the solution):
var spoilerMode = false;

// Color definition
function whatColorIsThis(number)
{
    switch(number){
        case 1:
            var color = 'red';
            break;
        case 2:
            var color = 'blue';
            break;
        case 3:
            var color = 'yellow';
            break;
        case 4:
            var color = 'black';
            break;
        case 5:
            var color = 'green';
            break;
        case 6:
            var color = 'orange';
            break;
        case 7:
            var color = 'violet';
            break;
        case 8:
            var color = 'white';
            break;
        default:
            console.log('error in color switch');
            break;
    }
    return color;
}


// Function to create the to-be discovered combination
function createCombo(comboLength, nbChoices)
{
    var validCombo = new Array();
    for(var i = 0; i < comboLength; i++) {
        var random = Math.floor(1 + Math.random() * nbChoices );
        validCombo[i] = whatColorIsThis(random);
    }
    return validCombo;
}


// Game initialization
function startGame()
{
    if(spoilerMode)
  	{
        $(".solutionPart.spoilerMode").addClass('on');
    }

    // 0 : Erase everything from the previous play
    $(".board .newGuess").empty();
    $(".board .oldGuesses").empty();
    $(".solutionPart.spoilerMode.on").empty();
    $(".colorsList").empty();

    // 1 : Define the options
    comboLength = $("#comboLength").val();
    nbChoices = $("#nbChoices").val();

    // 2 : Generate the solution
    solution = createCombo(comboLength, nbChoices);
    // Spoilermode : show the solution!
    $(".solutionPart.spoilerMode.on").append('Solution : ' + solution);

    // 3 : Generate the board
    for (var i = 0; i < comboLength; i++)
    {
        $(".board .newGuess").append('<input type="text" class="case red" name="case[' + i + ']" value="red" onclick=clickInput(this) />');
    }
    $(".board .newGuess").append('<button class="tryButton" onclick=tryGuess()>Try</button>');

    // 4 : Add the color list at the end
    listColors();
    $(".colorsList").hide();

    // 5 : Change the "start" button
    $(".playButton span").text("Restart");
}


// List available colors
function listColors()
{
    // Generate list
    var list = '';
    for (var i = 1; i <= nbChoices; i++)
    {
        list += '<li class="' + whatColorIsThis(i) + '">' + whatColorIsThis(i) + '</li>';
    }
    $(".colorsList").append(list);
}


// Move the colors list near the clicked element
function clickInput(element)
{
    // If already displayed, hide it
    if( $(".colorsList").hasClass('displayed') )
    {
        $(".colorsList").hide();
        $(".colorsList").removeClass('displayed');
        $(".colorsList").attr("target", "");
    }
    else
    {
        // Show the list
        $(".colorsList").show();
        $(".colorsList").addClass('displayed');
        // And, in order to know which input is concerned :
        $(".colorsList").attr("target", $(element).attr("name"));

        // Calculate where to place the list so it will be easier to select a new color
        var topPos = $(element).position()['top'] - $(".colorsList").height();
        var leftPos = $(element).position()['left'] + 'px';
        $(".colorsList").css('top', topPos + 'px');
        $(".colorsList").css('left', leftPos);
    }

    // Handle the color selection
    $('.colorsList li').on("click", function()
    {
        // Fetch the target to change the right input
        var targetName = $('.colorsList').attr("target");
        var target = $('input[name="' + targetName + '"]');

        // What will be the new color?
        var selection = $(this).attr("class");
        // So change the input now
        $(target).attr("class","case " + selection);
        $(target).val(selection);

        // And hide the list
        $(".colorsList").hide();
        $(".colorsList").removeClass('displayed');
    });
}


// Fetch the current guess combo
function tryGuess()
{
    // Create the new guess combo from inputs
    var guess = new Array();
    $('.newGuess .case').each(function() {
        guess.push($(this).val());
    });

    // Try me!
    var answer = compareCombos(guess, solution);

    // Feedback
    // Create a line in the old guesses part
    var line = '<div class="guessItem">';
    line += '<ul class="combo">';
    for (var i = 0; i < guess.length; i++)
    {
        line += '<li class="' + guess[i] + '">' + guess[i] + '</li>';
    }
    line += '</ul>';

    // Add the blacks-whites answer
    line += '<ul class="answer">';
    for (var x = 0; x < answer.blacks; x++)
    {
        line += '<li class="blacks">Black</li>';
    }
    for (var z = 0; z < answer.whites; z++)
    {
        line += '<li class="whites">White</li>';
    }
    line += '</ul>';
    line += '</div>';

    $(".board .oldGuesses").prepend(line);
}


// Return the number of blacks and whites
function compareCombos(guess, solution)
{
    var blacks = 0;
    var whites = 0;
    var currentSolutionState = new Array(); // To avoid compromising the original solution
    var currentGuessState = new Array(); // To avoid compromising the original guess

    // Is there any right color at the right place? (= blacks)
    for(var a = 0; a < comboLength; a++)
    {
        if (guess[a] == solution[a])
        {
            blacks++;
            currentSolutionState[a] = "already_checked"; // I used this to avoid detecting a whitee later
            currentGuessState[a] = "ignore_me";
        }
        else
        {
            currentSolutionState[a] = solution[a];
            currentGuessState[a] = guess[a];
        }
    }

    // Then, is there any right color at the wrong place? (= whites)
    for(var b = 0; b < comboLength; b++)
    {
        position = jQuery.inArray(currentGuessState[b], currentSolutionState);
        if (position != -1) // -1 = not in array
        {
            whites++;
            currentSolutionState[position] = "already_checked";
            currentGuessState[b] = "ignore_me";
        }
    }

    var answer = {};
    answer["blacks"] = blacks;
    answer["whites"] = whites;

    if(answer["blacks"] == comboLength)
    {
        // Todo : handle the game win !!!
        var moves = 1;
        $('.oldGuesses .guessItem').each(function() {
            moves++;
        });
        alert("Congratulations, that is the right combination! It took you " + moves + " moves to crack it.")
    }

    return answer;
}
