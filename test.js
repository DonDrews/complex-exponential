var canvas;
var ctx;
const lineGap = 100;

function draw()
{
    canvas = document.getElementById('graph_canvas');
    ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGraph();
    drawBoxes();
}

function pixelToCoord(x, y)
{
    mathX = (x - (w / 2)) / (lineGap * 2);
    mathI = -(y - (h / 2)) / (lineGap * 2);

    return [mathX, mathI];
}

function sign(number)
{
    if(number < 0)
        return number.toFixed(2);
    else
        return '+' + number.toFixed(2);
}

function dispfunc(e)
{
    const math = document.getElementById("textual");

    [x, i] = pixelToCoord(e.clientX, e.clientY);

    fullExp = '$$e^{' + sign(x) + sign(i) + '}=';
    fullExp += '1+(' + sign(x) + sign(i) + 'i)';
    
    for(var n = 2; n < 5; n++)
    {
        fullExp += '+\\frac{';
        //remove the plus based on sign
        fullExp += '(' + sign(x) + sign(i);

        fullExp += 'i)^' + n;
        fullExp += '}{' + n + '!}';
    }
    
    fullExp += '\\ldots$$';
    math.innerHTML = fullExp;

    // display and re-render the expression
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, math])
}


function drawGraph()
{
    //convienent variables
    w = canvas.width;
    h = canvas.height;

    //background color
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 1;

    //draw all the graph lines
    ctx.strokeStyle = '#A0A0A0'
    for(var x = -10; x < 10; x++)
    {
        if(x === 0)
            continue;
        
        var xPos = (w / 2) + (x * lineGap) - 0.5;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, h);
        ctx.closePath();
        ctx.stroke();
    }
    for(var y = -5; y < 5; y++)
    {
        if(y === 0)
            continue;
        
        var yPos = (h / 2) + (y * lineGap) - 0.5;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(w, yPos);
        ctx.closePath();
        ctx.stroke();
    }

    //draw the unit circle
    ctx.beginPath();
    ctx.arc((w / 2), (h / 2), lineGap * 2, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.stroke();

    //draw the central axes
    ctx.strokeStyle = '#000000'

    ctx.beginPath();
    ctx.moveTo((w / 2) - 0.3, 0);
    ctx.lineTo((w / 2) - 0.3, h);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (h / 2) - 0.3);
    ctx.lineTo(w, (h / 2) - 0.3);
    ctx.closePath();
    ctx.stroke();

    //draw the axis numbers
    ctx.fillStyle = '#000000'
    ctx.font = '15px sans-serif'
    offset = 3;
    for(var x = -5; x < 5; x++)
    {
        ctx.fillText(x, (w / 2) + lineGap * 2 * x + offset, (h / 2) - offset);
    }

    for(var i = -3; i < 3; i++)
    {
        var text;
        if(i === 0)
            continue;
        else if(i === -1)
            text = '-i';
        else if(i === 1)
            text = 'i';
        else
            text = i + 'i';

        ctx.fillText(text, (w / 2) + offset, (h / 2) - lineGap * 2 * i - offset);
    }
}

function drawBoxes()
{
    ctx.fillStyle = '#000000B0';
    ctx.fillRect(290, 15, 1000, 80);
}