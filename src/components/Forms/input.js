import { useRef, useState, useContext, useEffect } from 'react';
import { useAnimationState, MotiText } from 'moti';
import { Column, Label } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import { Pressable, TextInput } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const Input = ({ value, setValue, disabled, label, mask, props, onSubmitEditing = () => {}, pass = false }) => {
  const { font, color } = useContext(ThemeContext);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef();
  const [secure, setsecure] = useState(pass);
  const inputAnimation = useAnimationState({
    from: { translateY: 10, fontSize: 18, },
    to: { translateY: 0, fontSize: 14, },
  });

  useEffect(() => {
    if (value?.length > 0) {
      inputAnimation.transitionTo('to');
    } else {
      inputAnimation.transitionTo('from');
    }
  }, []);

  const handleFocus = () => {
    setFocus(true); inputAnimation.transitionTo('to');
  }
  const handleBlur = () => {
    if (!value?.length > 0) {
      inputAnimation.transitionTo('from'); setFocus(false);
    }
    else {
      setFocus(false)
    }
  }

  const handleChangeText = (text) => {
    const { maskFunction, maxLength } = getMaskFunction(mask);
    let maskedText = maskFunction(text);

    if (maxLength && maskedText.length > maxLength) {
      maskedText = maskedText.slice(0, maxLength);
    }

    setValue(maskedText);
  };


  return (
    <Pressable onPress={() => { inputRef.current.focus() }} >

      <Column style={{ borderColor: disabled ? '#f1f1f1' : focus ? color.label : 'transparent', backgroundColor: '#fff', flexGrow: 1, borderWidth: 2, paddingBottom: 8, paddingTop: 24, paddingHorizontal: 16, borderRadius: 12, }}>
        <MotiText
          state={inputAnimation}
          style={{ fontFamily: font.medium, color: color.label, letterSpacing: -0.6, position: 'absolute', top: 6, left: 16, zIndex: 1, }}
          transition={{ type: 'timing', duration: 200 }}
        >
          {label}
        </MotiText>

        <TextInput
          {...props}
          style={{ fontSize: 18, fontFamily: font.medium, color: disabled ? color.title + 60 : color.title, }}
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          onChangeText={handleChangeText}
          value={value}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secure}
        />

        {pass && <Pressable onPress={() => {setsecure(!secure)}} style={{ position: 'absolute', right: 16, top: 18 }}>
          {secure ? <Eye
            size={24}
            color={color.title}
          /> : <EyeOff 
            size={24}
            color={color.label}
          />}
        </Pressable>}
      </Column>
    </Pressable>
  );
};

export default Input;

const getMaskFunction = (mask) => {
  switch (mask) {
    case 'CPF':
      return { maskFunction: applyCpfMask, maxLength: 14 };
    case 'PHONE':
      return { maskFunction: applyPhoneMask, maxLength: 16 };
    case 'CEP':
      return { maskFunction: applyCepMask, maxLength: 9 };
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
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígito
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um hífen entre o nono e o décimo dígito
}

function applyCepMask(value) {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .slice(0, 9) // Limita a 8 dígitos
    .replace(/(\d{5})(\d)/, '$1-$2'); // Coloca um hífen entre o quinto e o sexto dígito
}

function applyPhoneMask(value) {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, '$1-$2'); // Coloca um hífen entre o quinto e o sexto dígito
}