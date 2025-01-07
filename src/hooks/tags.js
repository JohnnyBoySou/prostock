const categories = [
  { id: "acao", name: "Ação", titles: 4992, color: "#363137", img: "https://static3.mangalivre.net/capas/c-aH6sSjILEMLNO--UVDMg/6950/613881e16f42fexternal_cover.jpg" },
  { id: "adulto", name: "Adulto", titles: 1290, img: "https://static3.mangalivre.net/capas/UfImono9zPu7PTk5SrpSdw/7403/625b30e19b8b3_external_cover.jpg" },
  { id: 36, name: "Artes Marciais", titles: 1108, color: "#BD38D6", img: "https://static3.mangalivre.net/capas/UfImono9zPu7PTk5SrpSdw/7403/625b30e19b8b3_external_cover.jpg" },
  { id: 24, name: "Aventura", titles: 2709, color: "#55D3E6", img: "https://static3.mangalivre.net/capas/gD0Oa7y2CPW5rtPpe0HmRA/2412/external_cover.jpg" },
  { id: 26, name: "Comédia", titles: 5735, color: "#AC501F", img: "https://static3.mangalivre.net/capas/gCELLr4DNpa4XBAy0RjmtA/13/623e0f34a0ce7_external_cover.jpg" },
  { id: 57, name: "Doujinshi", titles: 226, img: "https://static3.mangalivre.net/capas/Qy5AWN_aoXDkZAITYi8HZA/15124/6262f8e398c78_external_cover.jpg", color: "#97BEB5" },
  { id: 29, name: "Drama", titles: 5172, color: "#070B0E", img: "https://static3.mangalivre.net/capas/75i1MyyphXB1YA_3NuQ8vg/117/external_cover.jpg" },
  { id: 18, name: "Ecchi", titles: 2040, color: "#45B2FC", img: "https://static3.mangalivre.net/capas/KzuNWlZEtfh8OOjysSloHg/11646/5ff9a44981ff7external_cover.jpg" },

  { id: 46, name: "Escolar", titles: 3235, color: "#90A8CF", img: "https://static3.mangalivre.net/capas/gqeqmLPYcss8MR23WquhTA/1319/647b41730751a_external_cover.jpg" },
  { id: 50, name: "Esportes", titles: 356, color: "#529562", img: "https://static3.mangalivre.net/capas/uH9E_OvryCF2gFFI97qjTw/805/601ead45b1da7external_cover.jpg" },
  { id: 30, name: "Fantasia", titles: 5441, img: "https://static3.mangalivre.net/capas/oDR4VtFL_puGVJtRT4Eymg/7302/6022e659a8e56external_cover.jpg", color: "#6299BF" },
  { id: 32, name: "Histórico", titles: 1037, img: "https://static3.mangalivre.net/capas/erg7K5BI0s__s3Uzx49tTw/70/external_cover.jpg", color: "#49636A" },
  { id: 33, name: "Horror", titles: 801, img: "https://static3.mangalivre.net/capas/oA3IRYsUKsYzddF_M_z71Q/210/60293e103f488external_cover.jpg", color: "#7D5445" },
  { id: 59, name: "Isekai", titles: 425, img: "https://static3.mangalivre.net/capas/wJEinHJVAh57AQICtcqhrA/7718/6021bf742eee2external_cover.jpg", color: "#876C77" },
  { id: 8, name: "Jogos", titles: 209 },
  { id: 9, name: "Josei", titles: 870, img: "https://static3.mangalivre.net/capas/Hnbofnr-McGZ2heu8X3ZtA/15063/6256f57de5a5f_external_cover.jpg", color: "#365047" },
  { id: 16, name: "Light Novel", titles: 62, img: "https://static3.mangalivre.net/capas/2AkGlT7vAuSxCfmoE1qO8g/7263/external_cover.jpg", color: "#7B89B9" },
  { id: 35, name: "Magia", titles: 675, img: "https://static3.mangalivre.net/capas/IitK3EFLDewwE3JBiP5Mhg/2551/645c1977bdaf5_external_cover.jpg", color: "#9A85B3" },
  { id: 37, name: "Mechas", titles: 115, img: "https://static3.mangalivre.net/capas/rrd-CH3jMtndC0E5ccfmRw/7035/external_cover.jpg", color: "#DC3144" },
  { id: 38, name: "Militar", titles: 129, img: "https://static3.mangalivre.net/capas/856wPSXJeqg23ishlyl6bA/8222/627bea5faf967_external_cover.jpg", color: "#3C4749" },
  { id: 40, name: "Mistério", titles: 1045, img: "https://static3.mangalivre.net/capas/XxG_-E0-93XIygjOX_lGqQ/4055/external_cover.jpg", color: "#E29731" },
  { id: 11, name: "One Shot", titles: 599, color: "#EA5348", img: "https://static3.mangalivre.net/capas/5VlBM3kMR2UGmsOTA5Yihg/14695/6205ac68428c1external_cover.jpg" },
  { id: 41, name: "Paródia", titles: 63 },
  { id: 42, name: "Policial", titles: 72, color: "#172937", img: "https://static3.mangalivre.net/capas/Q_3A-vxV3Z7pBni_mzQUGA/10357/5f7d4e4ac65b9_capa.jpg" },
  { id: 43, name: "Psicológico", titles: 863, color: "#292F58", img: "https://static3.mangalivre.net/capas/dvn2SxKGPb1R2RisF65Vrw/10775/5f5d8669bedd5external_cover.jpg" },
  { id: 44, name: "Romance", titles: 7829, color: "#DD8AAF", img: "https://static3.mangalivre.net/capas/oAT0k_bPQU7yk3pG0AZIAg/12259/604f6fa33c54dexternal_cover.jpg" },
  { id: 47, name: "Sci-Fi", titles: 999, color: "#085937", img: "https://static3.mangalivre.net/capas/3XHD60qUP5WHzyxyMLKv3g/4948/62c621fe1d315_external_cover.jpg" },
  { id: 3, name: "Seinen", titles: 2963, color: "#0C1C2B", img: "https://static3.mangalivre.net/capas/MBkLlwCnUX0k-XmYzL4Agg/7966/60243e9fd22bcexternal_cover.jpg" },
  { id: 77, name: "Manhuas", img: "https://static3.mangalivre.net/capas/BLIbiQdT5ovjK75bDg59aw/17915/64a412f32de9d_external_cover.jpg", color: "#35528E" },
  { id: 2, name: "Shoujo", titles: 3017, color: "#D33C4D", img: "https://static3.mangalivre.net/capas/Wp8UmJlGc2Hhhm8LcohKwQ/12120/603d68d3c7456external_cover.jpg" },

  { id: 1, name: "Shounen", titles: 3864, color: "#CC4E2B", img: "https://static3.mangalivre.net/capas/c-aH6sSjILEMLNO--UVDMg/6950/613881e16f42fexternal_cover.jpg" },

  { id: 48, name: "Slice of Life", titles: 2732, color: "#E9B49F", img: "https://static3.mangalivre.net/capas/y7V6bwxm2uEM5GhVc1-FTw/6938/644e724608926_external_cover.jpg" },
  { id: 52, name: "Sobrenatural", titles: 3281, color: "#B61527", img: "https://static3.mangalivre.net/capas/1zx18VapuHH5ulDnfKJtYQ/7178/64998ce6647b3_external_cover.jpg" },
  { id: 51, name: "Super Poderes", titles: 275, color: "#8C8E9C", img: "https://static3.mangalivre.net/capas/5vU5IWrZOwaVVI0NccxfTQ/1036/651222cd3ed72_external_cover.jpg" },
  { id: 53, name: "Suspense", titles: 108, img: "https://static3.mangalivre.net/capas/kMej2d4Bb2uJsdL-T5e7tA/12981/6123aabb4a824external_cover.jpg", color: "#CEB961" },
  { id: 54, name: "Vampiros", titles: 145 },

  { id: 56, name: "Webtoon", titles: 641, img: "https://static3.mangalivre.net/capas/bFPYOWjPwfabVA04JWNb9A/17339/6439af80dee11_capa.jpg", color: "#CD4C54" }
];

const genres = categories.filter(category => ["acao", 17, 19, 21, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 58].includes(category.id));
const styles = categories.filter(category => [1, 3, 16, 56, 18, 20, 2, 22, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 57, 59, 77].includes(category.id));
const themes = categories.filter(category => [0, 62].includes(category.id));

const dividedCategories = {
  genres: genres,
  styles: styles,
  themes: themes
};
export default dividedCategories;

export const tags = [
  { id: "Action", name: "Ação", color: "#FF7323" },
  { id: "Martial Arts", name: "Artes Marciais", color: "#BD38D6" },
  { id: "Adventure", name: "Aventura", color: "#d1b306" },
  { id: "Comedy", name: "Comédia", color: "#AC501F" },
  { id: "Drama", name: "Drama", color: "#FF3D96" },
  { id: "School Life", name: "Escolar", color: "#90A8CF" },
  { id: "Sports", name: "Esportes", color: "#529562" },
  { id: "Fantasy", name: "Fantasia", color: "#6299BF" },
  { id: "Crime", name: "Crime", color: "#F956CC" },
  { id: "Historical", name: "Histórico", color: "#57BB9F" },
  { id: "Horror", name: "Horror", color: "#7D5445" },
  { id: "Magic", name: "Magia", color: "#9A85B3" },
  { id: "Mecha", name: "Mechas", color: "#DC3144" },
  { id: "Harem", name: "Harém", color: "#3C4749" },
  { id: "Mystery", name: "Mistério", color: "#E29731" },
  { id: "Police", name: "Policial", color: "#00C444" },
  { id: "Psychological", name: "Psicológico", color: "#292F58" },
  { id: "Romance", name: "Romance", color: "#DD8AAF" },
  { id: "Sci-Fi", name: "Sci Fi", color: "#B7C75D" },
  { id: "Slice of Life", name: "Slice of Life", color: "#E9B49F" },
  { id: "Supernatural", name: "Sobrenatural", color: "#B61527" },
  { id: "Superhero", name: "Super Poderes", color: "#8C8E9C" },
  { id: "Thriller", name: "Suspense", color: "#CEB961" },
  { id: "Vampires", name: "Vampiros", color: "red" }

];
