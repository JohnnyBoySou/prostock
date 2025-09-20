import { useTheme } from '@/hooks/useTheme';

const whiteTheme = {
  color: {
    background: "#EDF0F1",
    header: "#FFFFFF",
    card: "#FFFFFF",

    primary: "#019866",
    secundary: "#fff",
    destructive: "#e74c3c", // Vermelho destrutivo
    ghost: "#D1D1D1", // Azul-escuro ghost
    link: "#EA1E2C", // Cor do link

    blue: "#3590F3",
    red: "#EA1E2C",
    green: "#43AA8B",
    yellow: "#FFB238",
  
    alert: "#FF620A",
    warning: "#ebd557",
    
    title: "#053721",
    label: "#666666",

    sidebar: "#FFF",
    sidebarText: "#303030",
    sidebarIcon: "#303030",

    premium: "#21533A",

    textPrimary: "#ED274A", // Cor do texto para fundo claro
    textSecondary: "#FF620A", // Cor do texto para fundo escuro
    textGhost: "#ffffff", // Cor do texto para fundo ghost
    textLink: "#303030", // Cor do texto para link

    borderPrimary: "#ED274A", // Cor da borda para a variante outline
    borderSecondary: "#FF620A", // Cor da borda para a variante outline
    borderDestructive: "#e74c3c", // Cor da borda para a variante outline
    borderGhost: "#303030", // Cor da borda para a variante outline
    true: "#ED274A",
    false: "#505050",
    muted: "#d1d1d1",
    activeText: "#f1f1f1",
    text: "#303030"

  },
  size: {
    headtitle: 32,
    title: 24,
    label: 18,
    sublabel: 16,
    small: 12
  },
  font: {
    black: "Font_Black",
    bold: "Font_Bold",
    medium: "Font_Medium",
    book: "Font_Book"
  }
};

const darkTheme = {
  color: {
    background: "#1E1E1E",
    header: "#000000",
    card: "#2A2A2A",

    primary: "#019866",
    secundary: "#2A2A2A",
    destructive: "#e74c3c", // Vermelho destrutivo
    ghost: "#404040", // Azul-escuro ghost
    link: "#EA1E2C", // Cor do link

    blue: "#3590F3",
    red: "#EA1E2C",
    green: "#43AA8B",
    yellow: "#FFB238",
  
    alert: "#FF620A",
    warning: "#ebd557",
    
    title: "#f1f1f1",
    label: "#f7f7f7",

    sidebar: "#2A2A2A",
    sidebarText: "#f7f7f7",
    sidebarIcon: "#f7f7f7",

    premium: "#4FDB9E",

    textPrimary: "#ED274A", // Cor do texto para fundo claro
    textSecondary: "#FF620A", // Cor do texto para fundo escuro
    textGhost: "#ffffff", // Cor do texto para fundo ghost
    textLink: "#f1f1f1", // Cor do texto para link

    borderPrimary: "#ED274A", // Cor da borda para a variante outline
    borderSecondary: "#FF620A", // Cor da borda para a variante outline
    borderDestructive: "#e74c3c", // Cor da borda para a variante outline
    borderGhost: "#f1f1f1", // Cor da borda para a variante outline
    true: "#ED274A",
    false: "#505050",
    muted: "#d1d1d1",
    activeText: "#f1f1f1",
    text: "#f1f1f1"

  },
  size: {
    headtitle: 32,
    title: 24,
    label: 18,
    sublabel: 16,
    small: 12
  },
  font: {
    black: "Font_Black",
    bold: "Font_Bold",
    medium: "Font_Medium",
    book: "Font_Book"
  }
};

// Hook para retornar o tema de cores correto baseado no modo atual
const colors = () => {
  const { mode, isLoading } = useTheme();
  
  if (isLoading) {
    return whiteTheme; // Tema padrão enquanto carrega
  }
  
  return mode === 'dark' ? darkTheme : whiteTheme;
};

export default colors;

