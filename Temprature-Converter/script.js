const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertBtn = document.getElementById("convertBtn");

const errorMessage = document.getElementById("errorMessage");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");

convertBtn.addEventListener("click", convertTemperature);

function convertTemperature() {
    const temperature = temperatureInput.value.trim();
    const unit = unitSelect.value;

    clearError();

    if (temperature === "") {
        showError("Please enter a temperature.");
        resetResults();
        return;
    }

    const value = Number(temperature);

    if (!Number.isFinite(value)) {
        showError("Please enter a valid numeric value.");
        resetResults();
        return;
    }

    let celsius;
    let fahrenheit;
    let kelvin;

    if (unit === "celsius") {
        celsius = value;
        fahrenheit = (celsius * 9 / 5) + 32;
        kelvin = celsius + 273.15;
    }

    if (unit === "fahrenheit") {
        fahrenheit = value;
        celsius = (fahrenheit - 32) * 5 / 9;
        kelvin = celsius + 273.15;
    }

    if (unit === "kelvin") {
        kelvin = value;
        celsius = kelvin - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;
    }

    if (celsius < -273.15) {
        showError("Temperature cannot be below absolute zero (-273.15°C).");
        resetResults();
        return;
    }

    displayResults(celsius, fahrenheit, kelvin);
}

function displayResults(celsius, fahrenheit, kelvin) {
    celsiusResult.textContent = `${formatValue(celsius)} °C`;
    fahrenheitResult.textContent = `${formatValue(fahrenheit)} °F`;
    kelvinResult.textContent = `${formatValue(kelvin)} K`;
}

function formatValue(value) {
    return Number(value.toFixed(2));
}

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = "";
}

function resetResults() {
    celsiusResult.textContent = "--";
    fahrenheitResult.textContent = "--";
    kelvinResult.textContent = "--";
}