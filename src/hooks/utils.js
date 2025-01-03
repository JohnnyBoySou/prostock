const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  // Extrair os componentes da data
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses em JavaScript começam do zero
  const year = date.getFullYear();

  // Extrair os componentes da hora
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export { formatDateTime, formatCurrency }