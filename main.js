class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        this.memory = 0;
        this.isScientificMode = false;
        this.clear();
        this.setupToggleSwitch();
    }

    setupToggleSwitch() {
        const toggleSwitch = document.getElementById('calculator-toggle');
        const scientificButtons = document.querySelector('.scientific-buttons');
        const calculator = document.querySelector('.calculator');
        
        toggleSwitch.addEventListener('change', () => {
            this.isScientificMode = toggleSwitch.checked;
            if (this.isScientificMode) {
                scientificButtons.classList.add('active');
                calculator.classList.add('scientific-mode');
            } else {
                scientificButtons.classList.remove('active');
                calculator.classList.remove('scientific-mode');
            }
        });
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperandElement.innerText = 'Error';
                    this.previousOperandElement.innerText = '';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.currentOperand = '0';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Handle large numbers and floating point precision
        if (computation.toString().includes('.')) {
            const decimalPlaces = Math.min(
                8,
                Math.max(
                    this.getDecimalPlaces(prev),
                    this.getDecimalPlaces(current)
                ) + 2
            );
            computation = parseFloat(computation.toFixed(decimalPlaces));
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    // Scientific Calculator Functions
    calculateTrigFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(current * (Math.PI / 180)); // Convert to radians
                break;
            case 'cos':
                result = Math.cos(current * (Math.PI / 180));
                break;
            case 'tan':
                result = Math.tan(current * (Math.PI / 180));
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatScientificResult(result);
        this.updateDisplay();
    }

    calculateFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch (func) {
            case 'sqrt':
                if (current < 0) {
                    this.currentOperandElement.innerText = 'Error';
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'cbrt':
                result = Math.cbrt(current);
                break;
            case 'log':
                if (current <= 0) {
                    this.currentOperandElement.innerText = 'Error';
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    this.currentOperandElement.innerText = 'Error';
                    return;
                }
                result = Math.log(current);
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatScientificResult(result);
        this.updateDisplay();
    }

    power(power) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch (power) {
            case '2':
                result = Math.pow(current, 2);
                break;
            case '3':
                result = Math.pow(current, 3);
                break;
            case 'y':
                this.operation = '^';
                this.previousOperand = current;
                this.currentOperand = '0';
                this.updateDisplay();
                return;
            default:
                return;
        }
        
        this.currentOperand = this.formatScientificResult(result);
        this.updateDisplay();
    }

    calculateConstant(constant) {
        switch (constant) {
            case 'π':
                this.currentOperand = Math.PI;
                break;
            case 'e':
                this.currentOperand = Math.E;
                break;
            default:
                return;
        }
        this.updateDisplay();
    }

    factorial() {
        const num = parseInt(this.currentOperand);
        if (isNaN(num) || num < 0) {
            this.currentOperandElement.innerText = 'Error';
            return;
        }
        
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        
        this.currentOperand = this.formatScientificResult(result);
        this.updateDisplay();
    }

    inverse() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current === 0) {
            this.currentOperandElement.innerText = 'Error';
            return;
        }
        
        this.currentOperand = this.formatScientificResult(1 / current);
        this.updateDisplay();
    }

    toggleSign() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (-current).toString();
        this.updateDisplay();
    }

    memory(action) {
        const current = parseFloat(this.currentOperand);
        
        switch (action) {
            case 'store':
                if (!isNaN(current)) {
                    this.memory = current;
                }
                break;
            case 'recall':
                this.currentOperand = this.memory.toString();
                this.updateDisplay();
                break;
            case 'add':
                if (!isNaN(current)) {
                    this.memory += current;
                }
                break;
            case 'clear':
                this.memory = 0;
                break;
            default:
                return;
        }
    }

    formatScientificResult(result) {
        if (Math.abs(result) < 0.000001 || Math.abs(result) > 9999999) {
            return result.toExponential(6);
        }
        return parseFloat(result.toFixed(8)).toString();
    }

    getDecimalPlaces(num) {
        const numStr = num.toString();
        if (numStr.includes('.')) {
            return numStr.split('.')[1].length;
        }
        return 0;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        
        // Handle exponential notation
        if (stringNumber.includes('e')) {
            return stringNumber;
        }
        
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
    
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9') {
            calculator.appendNumber(event.key);
        } else if (event.key === '.') {
            calculator.appendNumber('.');
        } else if (event.key === '+') {
            calculator.chooseOperation('+');
        } else if (event.key === '-') {
            calculator.chooseOperation('-');
        } else if (event.key === '*') {
            calculator.chooseOperation('×');
        } else if (event.key === '/') {
            calculator.chooseOperation('÷');
        } else if (event.key === 'Enter' || event.key === '=') {
            calculator.compute();
        } else if (event.key === 'Backspace') {
            calculator.delete();
        } else if (event.key === 'Escape') {
            calculator.clear();
        }
    });
});