function limparTudo(state) {
  state.current = '0';
  state.previous = '';
  state.operator = null;
  state.waitingForOperand = false;
}
