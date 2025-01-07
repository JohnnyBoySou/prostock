export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("pt-BR", { month: "short" });
  const year = date.getFullYear();
  return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
}
