const sortby = [
  { value: "None", name: "Nenhum" },
  { value: "Highest Rating", name: "Maior nota" },
  { value: "Lowest Rating", name: "Menor nota" },
  { value: "Latest Upload", name: "Último envio" },
  { value: "Oldest Upload", name: "Envio mais antigo" },
  { value: "Recently Added", name: "Adicionado recentemente" },
  { value: "Oldest Added", name: "Adicionado mais antigo" },
  { value: "Most Follows", name: "Mais seguidores" },
  { value: "Fewest Follows", name: "Menos seguidores" },
  { value: "Year Ascending", name: "Ano ascendente" },
  { value: "Year Descending", name: "Ano descendente" }
];

const sortbyfilter = [
  { value: "None", name: "Nenhum", props: "none", param: "none" },
  { value: "Highest Rating", props: "desc", param: "rating" },
  { value: "Lowest Rating", props: "asc", param: "rating" },
  { value: "Latest Upload", props: "desc", param: "latestUploadedChapter" },
  { value: "Oldest Upload", props: "asc", param: "latestUploadedChapter" },
  { value: "Recently Added", props: "desc", param: "updatedAt" },
  { value: "Oldest Added", props: "asc", param: "updatedAt" },
  { value: "Most Follows",  props: "desc", param: "followedCount" },
  { value: "Fewest Follows", props: "asc", param: "followedCount" },
  { value: "Year Ascending", props: "asc", param: "createdAt" },
  { value: "Year Descending", props: "desc", param: "createdAt" }
];

const classificacao = [
  { value: "safe", name: "Seguro" },
  { value: "suggestive", name: "Sugestivo" },
  { value: "erotica", name: "Erótico" }
  // { value: 'pornographic', name: 'Pornográfico', },
];
const publico = [
  { value: "shounen", name: "Masculino adolescente" },
  { value: "shoujo", name: "Feminino adolescente" },
  { value: "seinen", name: "Masculino adulto" },
  { value: "josei", name: "Feminino adulto" },
  { value: "none", name: "Nenhum" }
];
const status = [
  { value: "ongoing", name: "Em andamento" },
  { value: "completed", name: "Completo" },
  { value: "hiatus", name: "Hiato" },
  { value: "cancelled", name: "Cancelado" }
];
export { sortby, classificacao, publico, status, sortbyfilter };
