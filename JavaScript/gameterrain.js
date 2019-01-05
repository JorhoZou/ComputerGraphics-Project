var GAME_Gradient = {
    Apply: function(inCanvas, inParameters) {

        var context = inCanvas.getContext("2d");

        context.beginPath();

        context.fillStyle = "#000";
        context.rect(0, 0, inCanvas.width, inCanvas.height);
        context.fill();

        // 地形
        var gradient = context.createLinearGradient(inCanvas.width, 0, 0, 0);
        gradient.addColorStop(0, '#1b1b1b');
        gradient.addColorStop(1, '#1b1b1b');
        context.fillStyle = gradient;
        context.rect(0, 0, inCanvas.width, inCanvas.height);
        context.fill();


        BLUR_FILTER.Apply(inCanvas, inParameters);
    }
};