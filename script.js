/* script.js */
document.addEventListener("DOMContentLoaded", function() {
    const kelvinSlider = document.getElementById("kelvin-slider");
    const kelvinValue = document.getElementById("kelvin-value");
    const lightDisplay = document.getElementById("light-display");

    kelvinSlider.addEventListener("input", function() {
        const kelvin = parseInt(kelvinSlider.value);
        kelvinValue.textContent = kelvin;
        const color = getInterpolatedColor(kelvin);
        lightDisplay.style.backgroundColor = color;
        lightDisplay.style.boxShadow = `0px 0px 50px ${color}`;
    });

    function interpolateColor(color1, color2, factor) {
        return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
    }

    function getInterpolatedColor(kelvin) {
        if (kelvin <= 3500) {
            return `rgb(${interpolateColor([255, 140, 0], [255, 183, 76], (kelvin - 2000) / 1500).join(',')})`;
        } else if (kelvin <= 5500) {
            return `rgb(${interpolateColor([255, 183, 76], [255, 255, 224], (kelvin - 3500) / 2000).join(',')})`;
        } else {
            return `rgb(${interpolateColor([255, 255, 224], [200, 220, 255], (kelvin - 5500) / 4500).join(',')})`;
        }
    }

    kelvinSlider.dispatchEvent(new Event("input")); // Initialize on page load
});
