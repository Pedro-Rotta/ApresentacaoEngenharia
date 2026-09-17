function apagarDigito(state) {
  if (state.waitingForOperand) return;

  if (state.current.length === 1 || (state.current.length === 2 && state.current[0] === '-')) {
    state.current = '0';
  } else {
    state.current = state.current.slice(0, -1);
  }
}
