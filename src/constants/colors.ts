export const Colors = {
  primary: {
    P30: "#E8F5E9",
    P50: "#f0fdf5",
    P100: "#ddfbe9",
    P200: "#bcf6d3",
    P300: "#88edb1",
    P400: "#4ddb87",
    P500: "#2dd673",
    P600: "#19a051",
    P700: "#177e42",
    P800: "#186338",
    P900: "#155230",
    P950: "#062d18",
  },
  neutral: {
    N900: "#1F2223",
    N800: "#363939",
    N700: "#57595A",
    N600: "#797A7B",
    N500: "#8E9090",
    N400: "#B1B2B2",
    N300: "#D2D3D3",
    N200: "#EAEAEA",
    N100: "#F6F6F6",
    white: "#FFFFFF",
    whiteBg: "#F8F9FB",
  },
  warning: {
    O500: "#F59E0B",
    O300: "#FCD34D",
    O100: "#FEF3C7",
  },
  error: {
    R500: "#EF4444",
    R300: "#FCA5A5",
    R100: "#F3E6E7",
  },
};

// Semantic Aliases for easier usage
export const PRIMARY_GREEN = Colors.primary.P600;
export const BLACK = Colors.neutral.N900;
export const WHITE = Colors.neutral.white;
export const TEXT_PRIMARY = Colors.neutral.N900;
export const TEXT_SECONDARY = Colors.neutral.N600;
export const BORDER_GRAY = Colors.neutral.N200;
export const LIGHT_GRAY = Colors.neutral.N100;
export const RED = Colors.error.R500;
export const ORANGE = Colors.warning.O500;
export const SUCCESS = Colors.primary.P600;
export const BACKGROUND = Colors.neutral.whiteBg;
export const ACCENT_GREEN = "#2ECC71";
export const FOREST_GREEN = "#1A7A3C";

// Legacy Aliases for Onboarding Screens
export const LIGHT_GREEN = Colors.primary.P100;
export const DARK_GREEN = Colors.primary.P800;
export const DARK_CARD = Colors.primary.P950;
export const BG_LIGHT = Colors.neutral.whiteBg;
