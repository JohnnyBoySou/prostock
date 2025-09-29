import { useState, useEffect, forwardRef } from "react";
import { useAnimationState, } from "moti";
import { colors, Column, Label, Row } from "@/ui";
import { Pressable, TextInput, TextInputProps, KeyboardTypeOptions, ActivityIndicator, } from "react-native";
import { ChevronDown, Eye, EyeOff, Lock, Search } from "lucide-react-native";

// Tipos para as máscaras disponíveis
type MaskType = "CPF" | "PHONE" | "CEP" | "NASCIMENTO" | "CNPJ" | "DATE" | "PRICE";

// Interface para as propriedades do Input
interface InputProps extends Omit<TextInputProps, 'onChangeText' | 'value' | 'defaultValue'> {
  focused?: boolean;
  defaultValue?: string | number;
  value?: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  label?: string;
  select?: boolean;
  selectAction?: () => void;
  mask?: MaskType;
  keyboardType?: KeyboardTypeOptions;
  onSubmitEditing?: () => void;
  pass?: boolean;
  lock?: boolean;
  placeholder?: string;
  errorMessage?: string;
  successMessage?: string;
  search?: boolean;
  onSearch?: () => void;
  loading?: boolean;
  required?: boolean;
}

// Interface para o retorno das funções de máscara
interface MaskFunction {
  maskFunction: (text: string) => string;
  maxLength?: number;
}

const INPUT_HEIGHT = 56;

const Input = forwardRef<TextInput, InputProps>(({
  focused = false,
  defaultValue,
  value,
  setValue,
  disabled,
  label,
  select = false,
  selectAction = () => { },
  mask,
  keyboardType = "default",
  onSubmitEditing = () => { },
  pass = false,
  lock = false,
  placeholder,
  errorMessage,
  successMessage,
  search = false,
  loading = false,
  onSearch = () => { },
  required = false,
  ...props
}, ref) => {
  const theme = colors();
  const [focus, setFocus] = useState(false);
  const [secure, setsecure] = useState(pass);
  const inputAnimation = useAnimationState({
    from: { translateY: 10, fontSize: 18 },
    to: { translateY: 0, fontSize: 14 }
  });

  useEffect(() => {
    if (value?.length > 0) {
      inputAnimation.transitionTo("to");
    } else {
      inputAnimation.transitionTo("from");
    }
  }, []);

  const handleFocus = () => {
    setFocus(true); inputAnimation.transitionTo("to");
  };
  const handleBlur = () => {
    if (!value || value.length === 0) {
      inputAnimation.transitionTo("from");
      setFocus(false);
    } else {
      setFocus(false);
    }
  };

  const handleChangeText = (text: string) => {
    const { maskFunction, maxLength } = getMaskFunction(mask);
    let maskedText = maskFunction(text);

    if (maxLength && maskedText.length > maxLength) {
      maskedText = maskedText.slice(0, maxLength);
    }
    setValue(maskedText);
  };

  // Função para determinar a cor da borda baseada no estado
  const getBorderColor = () => {
    if (errorMessage) return "#FF4444"; // Vermelho para erro
    if (disabled || lock || select) return theme.color.border; // Cinza para desabilitado
    if (focus) return theme.color.primary; // Preto para focado
    return theme.color.foreground; // Branco para normal
  };

  return (
    <Column gv={8}>
      <Label color={theme.color.text}>{label} {required && <Label color={theme.color.red}>*</Label>}</Label>
      <Row
        style={{
          borderWidth: 2,
          borderColor: getBorderColor(),
          borderRadius: 8,
          borderBottomWidth: 2,
          backgroundColor: theme.color.header,
          alignItems: 'center',
        }}
      >
        <TextInput
          {...props}
          style={{
            fontSize: 18,
            fontFamily: 'Font_Book',
            color: disabled ? "#00000090" : theme.color.text, height: INPUT_HEIGHT,
            paddingLeft: 12,
            borderRadius: 12,
            flexGrow: 1,
          }}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={focused}
          editable={!disabled && !lock && !select}
          onChangeText={handleChangeText}
          value={value}
          defaultValue={defaultValue?.toString()}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={theme.color.text}
        />
        {select &&
          <Column style={{ width: INPUT_HEIGHT, height: INPUT_HEIGHT, zIndex: 99, justifyContent: "center", alignItems: "center" }}>
            <Pressable onPress={selectAction} style={{ backgroundColor: '#f1f1f1', borderRadius: 8, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
              <ChevronDown size={24} color='#7B7B7B' />
            </Pressable>
          </Column>
        }
        {lock &&
          <Column style={{ width: INPUT_HEIGHT, height: INPUT_HEIGHT, zIndex: 99, justifyContent: "center", alignItems: "center" }}>
            <Pressable style={{ backgroundColor: '#f1f1f1', borderRadius: 8, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
              <Lock size={24} color='#7B7B7B' />
            </Pressable>
          </Column>
        }
        {pass && (
          <Column style={{ width: INPUT_HEIGHT, height: INPUT_HEIGHT, zIndex: 99, justifyContent: "center", alignItems: "center" }}>
            <Pressable onPress={() => setsecure(!secure)} style={{ backgroundColor: theme.color.foreground, borderRadius: 8, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
              {secure ? (
                <Eye size={24} color='#7B7B7B' />
              ) : (
                <EyeOff size={24} color="#7B7B7B" />
              )}
            </Pressable>
          </Column>
        )}
        {search && (
          <Column style={{ width: INPUT_HEIGHT, height: INPUT_HEIGHT, zIndex: 99, justifyContent: "center", alignItems: "center" }}>
            <Pressable onPress={() => onSearch()} style={{ backgroundColor: focus ? theme.color.primary : '#f1f1f1', borderRadius: 8, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
              <Search size={24} color={focus ? '#fff' : '#7B7B7B'} />
            </Pressable>
          </Column>
        )}
        {loading && (
          <Column style={{ width: INPUT_HEIGHT, height: INPUT_HEIGHT, zIndex: 99, justifyContent: "center", alignItems: "center" }}>
            <Pressable style={{ backgroundColor: focus ? theme.color.primary : '#f1f1f1', borderRadius: 8, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size={24} color={focus ? '#fff' : '#7B7B7B'} />
            </Pressable>
          </Column>
        )}

      </Row>
      {errorMessage && (
        <Label color={theme.color.red} style={{ fontSize: 14 }}>
          {errorMessage}
        </Label>
      )}
      {successMessage && (
        <Label color={theme.color.green} style={{ fontSize: 14 }}>
          {successMessage}
        </Label>
      )}
    </Column>

  );
});

export default Input;

const getMaskFunction = (mask?: MaskType): MaskFunction => {
  switch (mask) {
    case "CPF":
      return { maskFunction: applyCpfMask, maxLength: 14 };
    case "PHONE":
      return { maskFunction: applyPhoneMask, maxLength: 16 };
    case "CEP":
      return { maskFunction: applyCepMask, maxLength: 9 };
    case "NASCIMENTO":
      return { maskFunction: applyBirthdateMask, maxLength: 10 };
    case "CNPJ":
      return { maskFunction: applyCnpjMask, maxLength: 18 };
    case "DATE":
      return { maskFunction: applyDateMask, maxLength: 10 };
    case "PRICE":
      return { maskFunction: applyPriceMask, maxLength: 20 };
    default:
      return { maskFunction: (text: string) => text, maxLength: undefined };
  }
};

const isValidEmail = (text: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

function applyCpfMask(value: string): string {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o sexto e o sétimo dígito
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o nono e o décimo dígito
}

function applyCepMask(value: string): string {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 9) // Limita a 8 dígitos
    .replace(/(\d{5})(\d)/, "$1-$2"); // Coloca um hífen entre o quinto e o sexto dígito
}

function applyPhoneMask(value: string): string {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, "$1-$2"); // Coloca um hífen entre o quinto e o sexto dígito
}

function applyBirthdateMask(value: string): string {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 8) // Limita a 8 dígitos (DDMMYYYY)
    .replace(/(\d{2})(\d)/, "$1/$2") // Coloca uma barra entre o dia e o mês
    .replace(/(\d{2})(\d)/, "$1/$2"); // Coloca uma barra entre o mês e o ano
}

function applyCnpjMask(value: string): string {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 14) // Limita a 14 dígitos
    .replace(/(\d{2})(\d)/, "$1.$2") // Coloca um ponto após os dois primeiros dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após os cinco primeiros dígitos
    .replace(/(\d{3})(\d)/, "$1/$2") // Coloca uma barra após os oito primeiros dígitos
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o 12º e o 13º dígito
}

function applyDateMask(value: string): string {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 8) // Limita a 8 dígitos (DDMMYYYY)
    .replace(/(\d{2})(\d)/, "$1/$2") // Coloca uma barra entre o dia e o mês
    .replace(/(\d{2})(\d)/, "$1/$2"); // Coloca uma barra entre o mês e o ano
}

function applyPriceMask(value: string): string {
  return "R$ " + value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .replace(/(\d+)(\d{2})$/, "$1,$2") // Adiciona uma vírgula antes dos últimos dois dígitos
    .replace(/(?=(\d{3})+(\D))\B/g, "."); // Adiciona pontos como separadores de milhar
}
