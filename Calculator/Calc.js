const display = document.getElementById("display");
const expression = document.getElementById("expression");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "";
let previousValue = "";
let operator = "";
let shouldResetDisplay = false;

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

actionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLastCharacter();
        }

        if (action === "decimal") {
            addDecimal();
        }

        if (action === "equals") {
            calculateResult();
        }
    });
});


function appendNumber(number) {
    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


function addDecimal() {
    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (!currentValue.includes(".")) {
        currentValue = currentValue === "" ? "0." : currentValue + ".";
    }

    updateDisplay();
}


function chooseOperator(selectedOperator) {
    if (currentValue === "" && previousValue === "") {
        return;
    }

    if (currentValue !== "" && previousValue !== "" && operator !== "") {
        calculateResult();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    shouldResetDisplay = true;

    expression.textContent =
        `${formatNumber(previousValue)} ${getOperatorSymbol(operator)}`;
}


function calculateResult() {
    if (previousValue === "" || currentValue === "" || operator === "") {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    if (operator === "+") {
        result = firstNumber + secondNumber;
    } else if (operator === "-") {
        result = firstNumber - secondNumber;
    } else if (operator === "*") {
        result = firstNumber * secondNumber;
    } else if (operator === "/") {
        if (secondNumber === 0) {
            showError("Cannot divide by zero");
            return;
        }

        result = firstNumber / secondNumber;
    }

    result = roundResult(result);

    expression.textContent =
        `${formatNumber(firstNumber)} ${getOperatorSymbol(operator)} ${formatNumber(secondNumber)} =`;

    currentValue = String(result);
    previousValue = "";
    operator = "";
    shouldResetDisplay = true;

    updateDisplay();
}


function clearCalculator() {
    currentValue = "";
    previousValue = "";
    operator = "";
    shouldResetDisplay = false;

    display.textContent = "0";
    expression.textContent = "";
}


function deleteLastCharacter() {
    if (shouldResetDisplay) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


function updateDisplay() {
    display.textContent = currentValue || "0";
}


function showError(message) {
    display.textContent = message;
    expression.textContent = "";

    currentValue = "";
    previousValue = "";
    operator = "";
    shouldResetDisplay = true;
}


function getOperatorSymbol(operator) {
    if (operator === "+") {
        return "+";
    }

    if (operator === "-") {
        return "−";
    }

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }
}


function formatNumber(number) {
    return Number(number).toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}


function roundResult(number) {
    return Number(number.toFixed(10));
}