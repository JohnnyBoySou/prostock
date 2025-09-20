import { Toast } from "toastify-react-native";
import {
  Column,
  Row,
  Title,
  Label,
  Icon,
  SCREEN_WIDTH,
  colors,
} from "@/ui";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const DEFAULT_CONFIG = {
  visibilityTime: 2000,
  useModal: false,
  fontFamily: "Font_Regular",
};

export const CustomToast = ({ text1 }: { text1: string }) => {
  return (
    <Row>
      <Title>{text1}</Title>
    </Row>
  );
};

export const SuccessToast = ({ text1 }: { text1: string }) => {
  const theme = colors();
  return (
    <Row
      gh={8}
      pv={8}
      ph={8}
      style={{
        backgroundColor: theme.color.primary,
        borderRadius: 6,
        width: SCREEN_WIDTH - 32,
      }}
    >
      <Column
        style={{
          width: 42,
          height: 42,
          backgroundColor: "#fff",
          borderRadius: 6,
        }}
        justify="center"
        align="center"
      >
        <Icon name="Check" color={theme.color.primary} />
      </Column>
      <Label
        style={{ width: SCREEN_WIDTH - 100, letterSpacing: -0.5 }}
        color={"#fff"}
      >
        {text1}
      </Label>
    </Row>
  );
};

export const InfoToast = ({ message }: { message: string }) => {
  const theme = colors();
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
    >
      <Row
        gh={8}
        pv={8}
        ph={8}
        style={{
          backgroundColor: "#fff",
          borderRadius: 24,
          width: SCREEN_WIDTH - 32,
        }}
      >
        <Column
          style={{
            width: 42,
            height: 42,
            backgroundColor: theme.color.blue + 30,
            borderRadius: 18,
          }}
          justify="center"
          align="center"
        >
          <Icon name="Info" color={theme.color.blue} />
        </Column>
        <Label
          style={{ width: SCREEN_WIDTH - 100, letterSpacing: -0.5 }}
          color={theme.color.blue}
        >
          {message}
        </Label>
      </Row>
    </Animated.View>
  );
};

export const ErrorToast = ({ text1 }: { text1: string }) => {
  const theme = colors();
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
    >
      <Row
        gh={8}
        pv={8}
        ph={8}
        style={{
          backgroundColor: "#fff",
          borderRadius: 24,
          width: SCREEN_WIDTH - 32,
        }}
      >
        <Column
          style={{
            width: 42,
            height: 42,
            backgroundColor: theme.color.red + 30,
            borderRadius: 18,
          }}
          justify="center"
          align="center"
        >
          <Icon name="X" color={theme.color.red} />
        </Column>
        <Label
          style={{ width: SCREEN_WIDTH - 100, letterSpacing: -0.5 }}
          color={theme.color.red}
        >
          {text1}
        </Label>
      </Row>
    </Animated.View>
  );
};

export const WarningToast = ({ text1 }: { text1: string }) => {
  const theme = colors();
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
    >
      <Row
        gh={8}
        pv={8}
        ph={8}
        style={{
          backgroundColor: "#fff",
          borderRadius: 24,
          width: SCREEN_WIDTH - 32,
        }}
      >
        <Column
          style={{
            width: 42,
            height: 42,
            backgroundColor: theme.color.yellow + 30,
            borderRadius: 18,
          }}
          justify="center"
          align="center"
        >
          <Icon name="TriangleAlert" color={theme.color.yellow} />
        </Column>
        <Label
          style={{ width: SCREEN_WIDTH - 100, letterSpacing: -0.5 }}
            color={theme.color.yellow}
        >
          {text1}
        </Label>
      </Row>
    </Animated.View>
  );
};

const TOAST_COLORS = {
  primary: "#019866",
  green: "#43AA8B",
  yellow: "#FFB238",
  red: "#EA1E2C",
  blue: "#3590F3",
};

export const showCustom = (message: string) => {
  Toast.show({
    type: "success",
    text1: message ?? "Nenhuma mensagem enviada...",
    backgroundColor: TOAST_COLORS.primary,
    textColor: "#fff",
    progressBarColor: "#fff",
    ...DEFAULT_CONFIG,
  });
};

export const showSuccess = (message: string) => {
  Toast.show({
    type: "success",
    text1: message ?? "Nenhuma mensagem enviada...",
    backgroundColor: TOAST_COLORS.green,
    textColor: "#fff",
    progressBarColor: "#fff",
    ...DEFAULT_CONFIG,
  });
};

export const showWarning = (message: string) => {
  Toast.show({
    type: "warn",
    text1: message ?? "Nenhuma mensagem enviada...",
    backgroundColor: TOAST_COLORS.yellow,
    textColor: "#1f2937",
    progressBarColor: "#000",
    ...DEFAULT_CONFIG,
  });
};

export const showError = (message: string) => {
  Toast.show({
    type: "error",
    text1: message ?? "Nenhuma mensagem enviada...",
    backgroundColor: TOAST_COLORS.red,
    textColor: "#fff",
    progressBarColor: "#fff",
    ...DEFAULT_CONFIG,
  });
};

export const showInfo = (message: string) => {
  Toast.show({
    type: "info",
    text1: message ?? "Nenhuma mensagem enviada...",
    backgroundColor: TOAST_COLORS.blue,
    textColor: "#fff",
    progressBarColor: "#fff",
    ...DEFAULT_CONFIG,
  });
};

export const useToast = () => {
  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustom,
  };
};

export const toast = {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showCustom,
};
