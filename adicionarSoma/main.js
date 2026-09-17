const state = {
  current: '0',
  previous: '',
  operator: null,
  waitingForOperand: false,
};

const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');

function updateDisplay() {
  currentDisplay.textContent = state.current;
  if (state.operator && state.previous) {
    const opSymbol = { subtrair: '−', dividir: '÷', multiplicar: '×', somar: '+' }[state.operator] || '';
    previousDisplay.textContent = ${state.previous} ${opSymbol};
  } else {
    previousDisplay.textContent = state.previous;
  }
}

function inputNumber(num) {
  if (state.waitingForOperand) {
    state.current = num;
    state.waitingForOperand = false;
  } else {
    state.current = state.current === '0' ? num : state.current + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (state.waitingForOperand) {
    state.current = '0.';
    state.waitingForOperand = false;
    updateDisplay();
    return;
  }
  if (!state.current.includes('.')) {
    state.current += '.';
  }
  updateDisplay();
}

function tratarOperador(op) {
  const current = parseFloat(state.current);

  if (state.operator && !state.waitingForOperand) {
    const prev = parseFloat(state.previous);
    let resultado;

    switch (state.operator) {
      case 'subtrair':    resultado = subtrair(prev, current); break;
      case 'dividir':     resultado = dividir(prev, current); break;
      case 'multiplicar': resultado = multiplicar(prev, current); break;
      case 'somar':       resultado = somar(prev, current); break;
    }

    state.current = String(resultado);
  }

  state.previous = state.current;
  state.operator = op;
  state.waitingForOperand = true;
  updateDisplay();
}

function tratarIgual() {
  if (!state.operator || state.waitingForOperand) return;

  const current = parseFloat(state.current);
  const prev = parseFloat(state.previous);
  let resultado;

  switch (state.operator) {
    case 'subtrair':    resultado = subtrair(prev, current); break;
    case 'dividir':     resultado = dividir(prev, current); break;
    case 'multiplicar': resultado = multiplicar(prev, current); break;
    case 'somar':       resultado = somar(prev, current); break;
  }

  state.current = String(resultado);
  state.previous = '';
  state.operator = null;
  state.waitingForOperand = true;
  updateDisplay();
}

function tratarPorcentagem() {
  const current = parseFloat(state.current);
  if (state.previous) {
    const base = parseFloat(state.previous);
    state.current = String(porcentagem(current, base));
  } else {
    state.current = String(current / 100);
  }
  updateDisplay();
}

document.querySelectorAll('[data-number]').forEach(btn => {
  btn.addEventListener('click', () => inputNumber(btn.dataset.number));
});

document.getElementById('decimal').addEventListener('click', inputDecimal);
document.getElementById('subtract').addEventListener('click', () => tratarOperador('subtrair'));
document.getElementById('divide').addEventListener('click', () => tratarOperador('dividir'));
document.getElementById('multiply').addEventListener('click', () => tratarOperador('multiplicar'));
document.getElementById('add').addEventListener('click', () => tratarOperador('somar'));
document.getElementById('percent').addEventListener('click', tratarPorcentagem);
document.getElementById('equals').addEventListener('click', tratarIgual);
document.getElementById('clearAll').addEventListener('click', () => {
  limparTudo(state);
  updateDisplay();
});
document.getElementById('backspace').addEventListener('click', () => {
  apagarDigito(state);
  updateDisplay();
});

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '+') tratarOperador('somar');
  else if (e.key === '.') inputDecimal();
  else if (e.key === '-') tratarOperador('subtrair');
  else if (e.key === '/') { e.preventDefault(); tratarOperador('dividir'); }
  else if (e.key === '*') tratarOperador('multiplicar');
  else if (e.key === '%') tratarPorcentagem();
  else if (e.key === 'Enter' || e.key === '=') tratarIgual();
  else if (e.key === 'Escape') { limparTudo(state); updateDisplay(); }
  else if (e.key === 'Backspace') { apagarDigito(state); updateDisplay(); }
});