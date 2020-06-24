var canvas;
var ctx;
const lineGap = 75;
var w;
var h;
var colors = ['#FF0000', '#00BB00', '#0000FF'];

function draw()
{
    canvas = document.getElementById('graph_canvas');
    ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGraph();
    //drawBoxes();
}

function pixelToCoord(x, y)
{
    var mathX = (x - (w / 2)) / (lineGap * 2);
    var mathI = -(y - (h / 2)) / (lineGap * 2);

    return [mathX, mathI];
}

function coordToPixel(r, i)
{
    var screenX = r * (lineGap * 2) + w / 2
    var screenY = -i * (lineGap * 2) + h / 2;
    return [screenX, screenY];
}

function sign(number)
{
    if(number < 0)
        return number.toFixed(2);
    else
        return '+' + number.toFixed(2);
}

function factorial(k)
{
    if(k === 0)
        return 1;
    else
        return k * factorial(k - 1);
}

function getTerm(z_r, z_i, k)
{
    var theta = Math.atan2(z_i, z_r);
    var radius = Math.sqrt(Math.pow(z_r, 2) + Math.pow(z_i, 2));

    //using DeMoivre's theorem
    theta = theta * k;
    radius = Math.pow(radius, k) / factorial(k);

    var r = Math.cos(theta) * radius;
    var i = Math.sin(theta) * radius;
    return [r, i];
}

function dispfunc(e)
{
    drawGraph();
    drawArrow(w / 2, h / 2, e.clientX, e.clientY, '#000000', 2, true);

    var [x, i] = pixelToCoord(e.clientX, e.clientY);

    var lastR = 0;
    var lastI = 0;
    for(var n = 0; n < 15; n++)
    {
        var [termR, termI] = getTerm(x, i, n);
        var [dispX, dispY] = coordToPixel(termR + lastR, termI + lastI);
        var [origX, origY] = coordToPixel(lastR, lastI);
        if(n < 2)
            drawArrow(origX, origY, dispX, dispY, colors[n % 3], 1, true);
        else
            drawArrow(origX, origY, dispX, dispY, colors[n % 3], 1, false);
        lastR += termR;
        lastI += termI;
    }

    drawUI(x, i);
}

//always called last
function drawUI(x, i)
{
    //drawBoxes();
    const math = document.getElementById("textual");

    //contruct TeX syntax for showing partial sum
    fullExp = '$$e^{' + sign(x) + sign(i) + 'i}=';
    fullExp += '1+(' + sign(x) + sign(i) + 'i)';
    
    for(var n = 2; n < 5; n++)
    {
        fullExp += '+\\frac{';
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
    for(var x = -14; x < 14; x++)
    {
        if(x === 0)
            continue;
        
        var xPos = (w / 2) + (x * lineGap) - 0.5;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, h);
        ctx.stroke();
    }
    for(var y = -8; y < 8; y++)
    {
        if(y === 0)
            continue;
        
        var yPos = (h / 2) + (y * lineGap) - 0.5;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(w, yPos);
        ctx.stroke();
    }

    //draw the unit circle
    ctx.beginPath();
    ctx.arc((w / 2), (h / 2), lineGap * 2, 0, 2 * Math.PI, true);
    ctx.stroke();

    //draw the central axes
    ctx.strokeStyle = '#000000'

    ctx.beginPath();
    ctx.moveTo((w / 2) - 0.3, 0);
    ctx.lineTo((w / 2) - 0.3, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (h / 2) - 0.3);
    ctx.lineTo(w, (h / 2) - 0.3);
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

function drawArrow(x, y, toX, toY, color, size, head)
{
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    var len = Math.sqrt(Math.pow(toX - x, 2) + Math.pow(toY - y, 2));
    var backX = ((toX - x) / len) * 10 * size;
    var backY = ((toY - y) / len) * 10 * size;
    var corner1X = toX - backX + (backY * 0.2);
    var corner1Y = toY - backY + (-backX * 0.2);
    var corner2X = toX - backX + (-backY * 0.2);
    var corner2Y = toY - backY + (backX * 0.2);
    

    //draw arrow shaft
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    if(head)
        ctx.lineTo(toX - backX, toY - backY);
    else
        ctx.lineTo(toX, toY);
    ctx.stroke();

    if(head)
    {
        //draw arrow head
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(corner1X, corner1Y);
        ctx.lineTo(corner2X, corner2Y);
        ctx.fill();
    }
}