document.addEventListener("DOMContentLoaded", function() {
    const kelvinSlider = document.getElementById("kelvin-slider");
    const kelvinValue = document.getElementById("kelvin-value");
    const rgbValue = document.getElementById("rgb-value");
    const lightDisplay = document.getElementById("light-display");
    const copyBtn = document.getElementById("copy-btn");
    const exportBtn = document.getElementById("export-btn");
    const exportOutput = document.getElementById("export-output");

    // Update display on slider input
    kelvinSlider.addEventListener("input", function() {
        const kelvin = parseInt(kelvinSlider.value);
        kelvinValue.textContent = kelvin;
        const colorArray = getColorArray(kelvin);
        const colorString = `rgb(${colorArray.join(',')})`;
        lightDisplay.style.backgroundColor = colorString;
        lightDisplay.style.boxShadow = `0px 0px 50px ${colorString}`;
        rgbValue.textContent = colorArray.join(', ');

        // Update export output with current settings
        updateExport(kelvin, colorArray);
    });

    // Copy RGB values to clipboard
    copyBtn.addEventListener("click", function() {
        navigator.clipboard.writeText(rgbValue.textContent)
        .then(() => {
            alert("RGB values copied to clipboard!");
        })
        .catch(err => {
            alert("Failed to copy: " + err);
        });
    });

    // Export settings to JSON and copy to clipboard
    exportBtn.addEventListener("click", function() {
        navigator.clipboard.writeText(exportOutput.value)
        .then(() => {
            alert("Settings exported and copied to clipboard!");
        })
        .catch(err => {
            alert("Failed to copy export: " + err);
        });
    });

    // Update export area with JSON of current settings
    function updateExport(kelvin, colorArray) {
        const exportData = {
            kelvin: kelvin,
            rgb: colorArray,
            hex: rgbToHex(colorArray)
        };
        exportOutput.value = JSON.stringify(exportData, null, 2);
    }

    // Convert RGB array to hexadecimal string
    function rgbToHex(rgb) {
        return "#" + rgb.map(c => {
            let hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join('');
    }

    // Linear interpolation between two colors
    function interpolateColor(color1, color2, factor) {
        return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
    }

    // Get interpolated color based on Kelvin value
    function getColorArray(kelvin) {
        if (kelvin <= 3500) {
            return interpolateColor([255, 140, 0], [255, 183, 76], (kelvin - 2000) / 1500);
        } else if (kelvin <= 5500) {
            return interpolateColor([255, 183, 76], [255, 255, 224], (kelvin - 3500) / 2000);
        } else {
            return interpolateColor([255, 255, 224], [200, 220, 255], (kelvin - 5500) / 4500);
        }
    }

    // Initialize the display on page load
    kelvinSlider.dispatchEvent(new Event("input"));
});
