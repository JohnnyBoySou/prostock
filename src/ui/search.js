import { useState, useEffect, forwardRef } from "react";
import { Column, Label, Loader } from "@/ui";
import { Pressable, TextInput } from "react-native";
import { Search as Searc } from "lucide-react-native";

const Search = forwardRef(({ focused = false, defaultValue, loading = false, value, setValue, disabled, label, onSearch, select = false, mask, props, keyboard = "default", onSubmitEditing = () => { }, lock = false, placeholder }, ref) => {
  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = () => {
    if (!value?.length > 0) {
    } else {
      setFocus(false);
    }
  };

  const handleChangeText = (text) => {
    const { maskFunction, maxLength } = getMaskFunction(mask);
    let maskedText = maskFunction(text);

    if (maxLength && maskedText.length > maxLength) {
      maskedText = maskedText.slice(0, maxLength);
    }

    setValue(maskedText);
  };

  return (
    <Column>
      <Label color='#484848'>{label}</Label>
      <TextInput
        {...props}
        style={{
          fontSize: 18,
          fontFamily: 'Font_Book',
          color: disabled ? "#00000090" : "#000", height: 64,
          borderRadius: 8,
          borderBottomWidth: 2,
          backgroundColor: '#fff',
          paddingHorizontal: 22,
          borderWidth: 2,
          borderColor: disabled || lock || select ? "#D6D6D6" : focus ? "#1E1E1E" : "#FFFfff"
        }}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={focused}
        editable={!disabled && !lock && !select}
        onChangeText={handleChangeText}
        value={value}
        defaultValue={defaultValue}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboard}
        placeholder={placeholder}
        placeholderTextColor='#808080'
      />
      <Pressable onPress={onSearch} style={{ position: "absolute", zIndex: 9, backgroundColor: focus ? '#019866' : '#f7F7f7', borderRadius: 8, right: 4, bottom: 4, zIndex: 99, width: 60, height: 56, justifyContent: "center", alignItems: "center" }}>
        {loading ? <Loader size={24} color='#019866' /> : <Searc size={24} color={focus ? '#fff' : '#7B7B7B'} />}
      </Pressable>
    </Column>
  );
});

export default Search;

const getMaskFunction = (mask) => {
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
      return { maskFunction: (text) => text, maxLength: undefined };
  }
};

const isValidEmail = (text) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(text);
};

function applyCpfMask(value) {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o sexto e o sétimo dígito
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o nono e o décimo dígito
}

function applyCepMask(value) {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 9) // Limita a 8 dígitos
    .replace(/(\d{5})(\d)/, "$1-$2"); // Coloca um hífen entre o quinto e o sexto dígito
}

function applyPhoneMask(value) {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, "$1-$2"); // Coloca um hífen entre o quinto e o sexto dígito
}
function applyBirthdateMask(value) {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 8) // Limita a 8 dígitos (DDMMYYYY)
    .replace(/(\d{2})(\d)/, "$1/$2") // Coloca uma barra entre o dia e o mês
    .replace(/(\d{2})(\d)/, "$1/$2"); // Coloca uma barra entre o mês e o ano
}

function applyCnpjMask(value) {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 14) // Limita a 14 dígitos
    .replace(/(\d{2})(\d)/, "$1.$2") // Coloca um ponto após os dois primeiros dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após os cinco primeiros dígitos
    .replace(/(\d{3})(\d)/, "$1/$2") // Coloca uma barra após os oito primeiros dígitos
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2"); // Coloca um hífen entre o 12º e o 13º dígito
}
function applyDateMask(value) {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .slice(0, 8) // Limita a 8 dígitos (DDMMYYYY)
    .replace(/(\d{2})(\d)/, "$1/$2") // Coloca uma barra entre o dia e o mês
    .replace(/(\d{2})(\d)/, "$1/$2"); // Coloca uma barra entre o mês e o ano
}
function applyPriceMask(value) {
  return "R$ " + value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .replace(/(\d+)(\d{2})$/, "$1,$2") // Adiciona uma vírgula antes dos últimos dois dígitos
    .replace(/(?=(\d{3})+(\D))\B/g, "."); // Adiciona pontos como separadores de milhar
}
