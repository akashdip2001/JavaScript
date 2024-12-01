const passwardBox = document.getElementById('passward');
const length = 12;
const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+';

// Event Listener for copy button
function generatePassward() {
    let passward = '';
    for (let i = 0; i < length; i++) {
        const x = isPassward();
        passward += x;
    }
    passwardBox.value = passward;
}

// take Radome value from each array and return it
function isPassward() {
    const x = [];
    x.push(upperCase[Math.floor(Math.random() * upperCase.length)]);
    x.push(lowerCase[Math.floor(Math.random() * lowerCase.length)]);
    x.push(numbers[Math.floor(Math.random() * numbers.length)]);
    x.push(symbols[Math.floor(Math.random() * symbols.length)]);
    return x[Math.floor(Math.random() * x.length)];
}

generatePassward();
