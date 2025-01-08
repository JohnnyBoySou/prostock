import React, { ReactNode } from 'react';
import { Text, TextStyle } from 'react-native';

// Definição de tipo para as propriedades de estilo
interface StyleProps {
  size?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
  mh?: number;  // marginHorizontal
  mv?: number;  // marginVertical
  mb?: number;  // marginBottom
  mt?: number;  // marginTop
  mr?: number;  // marginRight
  ml?: number;  // marginLeft
  fontFamily?: string;  // Novo campo para o fontFamily
  spacing?: number;  // Espaçamento entre as linhas
  style?: TextStyle;  // Adicionando estilo adicional
}

// Interface para os props dos componentes
interface TextComponentProps extends StyleProps {
  children: ReactNode;  // children é obrigatório, mas pode ser null ou undefined
}

// Função utilitária para gerenciar estilos
const getStyle = ({ size, align, color, mh, mv, mb, mt, mr, ml, fontFamily, spacing, style }: StyleProps & { style?: TextStyle }): TextStyle => {
  return {
    fontSize: size || 16,
    textAlign: align || 'left',
    color: color || '#000',
    marginHorizontal: mh || 0,
    marginVertical: mv || 0,
    marginBottom: mb || 0,
    marginTop: mt || 0,
    marginRight: mr || 0,
    marginLeft: ml || 0,
    lineHeight: size ? size * 1.04 : 24,
    letterSpacing: spacing || 0,
    fontFamily: fontFamily || 'Font_Book',  // Adicionando fontFamily com valor padrão
    ...style,  // Adicionando estilo adicional
  };
};

// Componente HeadTitle com fontFamily inline
export const HeadTitle = ({
  size = 32,
  align,
  color = '#202020',
  mh,
  mv,
  mb,
  mt,
  mr,
  ml,
  fontFamily = 'Font_Book',  // Recebendo fontFamily
  children,
  spacing,
  style,
}: TextComponentProps) => {
  const styleProps = { size, align, color, mh, mv, mb, mt, mr, ml, fontFamily, spacing, style };
  return (
    <Text
      style={getStyle(styleProps)}
      accessible={true}  // Sempre acessível
      accessibilityLabel={children ? children.toString() : ''}
      accessibilityRole={'header'}
    >
      {children}
    </Text>
  );
};

// Componente Title com fontFamily inline
export const Title = ({
  size = 28,
  align,
  color = "#202020",
  mh,
  mv,
  mb,
  mt,
  mr,
  ml,
  fontFamily = 'Font_Bold',  // Recebendo fontFamily
  children,
  spacing,
  style,
}: TextComponentProps) => {
  const styleProps = { size, align, color, mh, mv, mb, mt, mr, ml, fontFamily, spacing,style };
  return (
    <Text
      style={getStyle(styleProps)}
      accessible={true}  // Sempre acessível
      accessibilityLabel={children ? children.toString() : ''}
      accessibilityRole={'header'}
    >
      {children}
    </Text>
  );
};

// Componente Label com fontFamily inline
export const Label = ({
  size = 16,
  align,
  color = "#484848",
  mh,
  mv,
  mb,
  mt,
  mr,
  ml,
  fontFamily = 'Font_Book',  // Recebendo fontFamily
  children,
  spacing,
  style,
}: TextComponentProps) => {
  const styleProps = { size, align, color, mh, mv, mb, mt, mr, ml, fontFamily, spacing, 
    style, };
  return (
    <Text
      style={getStyle(styleProps)}
      accessible={true}  // Sempre acessível
      accessibilityLabel={children ? children.toString() : ''}
      accessibilityRole={'text'}
    >
      {children}
    </Text>
  );
};

// Componente SubLabel com fontFamily inline
export const SubLabel = ({
  size = 14,
  align,
  color = "#484848",
  mh,
  mv,
  mb,
  mt,
  mr,
  ml,
  fontFamily = 'Font_Book',  // Recebendo fontFamily
  children,
  spacing,
  style
}: TextComponentProps) => {
  const styleProps = { size, align, color, mh, mv, mb, mt, mr, ml, fontFamily, spacing , 
    style, };
  return (
    <Text
      style={getStyle(styleProps)}
      accessible={true}  // Sempre acessível
      accessibilityLabel={children ? children.toString() : ''}
      accessibilityRole={'text'}
    >
      {children}
    </Text>
  );
};

// Componente Description com fontFamily inline
export const Description = ({
  size = 14,
  align,
  color = "#606060",
  mh,
  mv,
  mb,
  mt,
  mr,
  ml,
  fontFamily = 'Font_Book',  // Recebendo fontFamily
  children,
  spacing,
  style,
}: TextComponentProps) => {
  const styleProps = { size, align, color, mh, mv, mb, mt, mr, ml, fontFamily, spacing, style };
  return (
    <Text
      style={getStyle(styleProps)}
      accessible={true}  // Sempre acessível
      accessibilityLabel={children ? children.toString() : ''}
      accessibilityRole={'text'}
    >
      {children}
    </Text>
  );
};

export const U = ({
  children
}) => {
  return (
    <Text
      style={{ textDecorationLine: 'underline', textDecorationStyle: 'solid' }}
    >{children}</Text>
  )
}