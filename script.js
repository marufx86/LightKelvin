document.addEventListener("DOMContentLoaded", function() {
    const kelvinSlider = document.getElementById("kelvin-slider");
    const kelvinValue = document.getElementById("kelvin-value");
    const rgbValue = document.getElementById("rgb-value");
    const hsvValue = document.getElementById("hsv-value");
    const hslValue = document.getElementById("hsl-value");
    const linearValue = document.getElementById("linear-value");
    const lightDisplay = document.getElementById("light-display");
    const copyBtn = document.getElementById("copy-btn");
    const exportBtn = document.getElementById("export-btn");
    const exportOutput = document.getElementById("export-output");

    // Update display on Kelvin slider input
    kelvinSlider.addEventListener("input", function() {
        const kelvin = parseInt(kelvinSlider.value);
        kelvinValue.textContent = kelvin;
        const colorArray = getColorArray(kelvin);
        const colorString = `rgb(${colorArray.join(',')})`;
        lightDisplay.style.backgroundColor = colorString;
        lightDisplay.style.boxShadow = `0px 0px 50px ${colorString}`;
        rgbValue.textContent = colorArray.join(', ');
        
        // Update additional conversions
        hsvValue.textContent = rgbToHsv(colorArray[0], colorArray[1], colorArray[2]).join(', ');
        hslValue.textContent = rgbToHsl(colorArray[0], colorArray[1], colorArray[2]).join(', ');
        linearValue.textContent = rgbToLinear(colorArray[0], colorArray[1], colorArray[2]).join(', ');
        
        // Update export output with current settings
        updateExport(kelvin, colorArray);
    });

    // Copy RGB values (from slider conversion) to clipboard
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
        const exportData = {};
        if (kelvin != null) {
            exportData.kelvin = kelvin;
        }
        exportData.rgb = colorArray;
        exportData.hex = rgbToHex(colorArray);
        exportData.hsv = rgbToHsv(colorArray[0], colorArray[1], colorArray[2]);
        exportData.hsl = rgbToHsl(colorArray[0], colorArray[1], colorArray[2]);
        exportData.linear = rgbToLinear(colorArray[0], colorArray[1], colorArray[2]);
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

    // Convert RGB to HSV (Hue in degrees, Saturation and Value in percentage)
    function rgbToHsv(r, g, b) {
        let rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        let max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        let delta = max - min;
        let h = 0;
        if (delta === 0) {
            h = 0;
        } else if (max === rNorm) {
            h = 60 * (((gNorm - bNorm) / delta) % 6);
        } else if (max === gNorm) {
            h = 60 * (((bNorm - rNorm) / delta) + 2);
        } else if (max === bNorm) {
            h = 60 * (((rNorm - gNorm) / delta) + 4);
        }
        if (h < 0) h += 360;
        let s = max === 0 ? 0 : (delta / max);
        let v = max;
        return [Math.round(h), Math.round(s * 100), Math.round(v * 100)];
    }

    // Convert RGB to HSL (Hue in degrees, Saturation and Lightness in percentage)
    function rgbToHsl(r, g, b) {
        let rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        let max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
        let l = (max + min) / 2;
        let s = 0;
        let h = 0;
        if (max !== min) {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === rNorm) {
                h = ((gNorm - bNorm) / d) + (gNorm < bNorm ? 6 : 0);
            } else if (max === gNorm) {
                h = ((bNorm - rNorm) / d) + 2;
            } else if (max === bNorm) {
                h = ((rNorm - gNorm) / d) + 4;
            }
            h *= 60;
        }
        return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    }

    // Convert RGB to Linear space (values normalized between 0 and 1)
    function rgbToLinear(r, g, b) {
        return [
            (r / 255).toFixed(3),
            (g / 255).toFixed(3),
            (b / 255).toFixed(3)
        ];
    }

    // Function to copy text to clipboard for preset values
    window.copyText = function(text) {
        navigator.clipboard.writeText(text)
        .then(() => {
            alert("Preset RGB values copied to clipboard: " + text);
        })
        .catch(err => {
            alert("Failed to copy preset: " + err);
        });
    };

    // Function to visualize preset colors and update Kelvin slider if an approximate Kelvin value is provided
    window.visualizePreset = function(rgbString, approximateKelvin) {
        let rgbArray = rgbString.split(',').map(x => parseInt(x.trim()));
        let colorString = `rgb(${rgbArray.join(',')})`;
        // Update display with preset color
        lightDisplay.style.backgroundColor = colorString;
        lightDisplay.style.boxShadow = `0px 0px 50px ${colorString}`;
        rgbValue.textContent = rgbArray.join(', ');
        
        // Update additional conversions for preset
        hsvValue.textContent = rgbToHsv(rgbArray[0], rgbArray[1], rgbArray[2]).join(', ');
        hslValue.textContent = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2]).join(', ');
        linearValue.textContent = rgbToLinear(rgbArray[0], rgbArray[1], rgbArray[2]).join(', ');
        
        // If an approximate Kelvin value is provided and is a valid number, update the slider and Kelvin display
        if (typeof approximateKelvin === 'number') {
            kelvinSlider.value = approximateKelvin;
            kelvinValue.textContent = approximateKelvin;
        }
        
        // Update export output with current (or preset) settings
        updateExport(approximateKelvin, rgbArray);
    };

    // Initialize the display on page load
    kelvinSlider.dispatchEvent(new Event("input"));
});
