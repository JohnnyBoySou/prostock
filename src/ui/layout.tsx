import React from 'react';
import { View, ViewStyle, StyleSheet, ScrollView } from 'react-native';
import colors from './colors';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  mh?: number;
  mv?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  ph?: number;
  pv?: number;
  gv?: number; // Gap vertical
  gh?: number; // Gap horizontal
}

const Column: React.FC<LayoutProps> = ({
  children,
  style,
  justify = 'flex-start',
  align = 'stretch',
  mh = 0,
  mv = 0,
  ph = 0,
  pv = 0,
  mt = 0,
  mb = 0,
  ml = 0,
  mr = 0,
  pt = 0,
  pb = 0,
  pl = 0,
  pr = 0,
  gv = 0,
  gh = 0,
}) => {
  const marginStyle = mh || mv ? {
    marginHorizontal: mh,
    marginVertical: mv
  } : {
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr
  };

  const paddingStyle = ph || pv ? {
    paddingHorizontal: ph,
    paddingVertical: pv
  } : {
    paddingTop: pt,
    paddingBottom: pb,
    paddingLeft: pl,
    paddingRight: pr
  };

  const combinedStyle = {
    justifyContent: justify,
    alignItems: align,
    ...marginStyle,
    ...paddingStyle
  };
  const gapStyle = {
    rowGap: gv,
    columnGap: gh,
  };

  return (
    <View style={[styles.column, combinedStyle, gapStyle, style]}>
      {children}
    </View>
  );
};

const Row: React.FC<LayoutProps> = ({
  children,
  style,
  justify = 'flex-start',
  align = 'center',
  mh = 0,
  mv = 0,
  ph = 0,
  pv = 0,
  mt = 0,
  mb = 0,
  ml = 0,
  mr = 0,
  pt = 0,
  pb = 0,
  pl = 0,
  pr = 0,
  gv = 0,
  gh = 0,
}) => {
  const marginStyle = mh || mv ? {
    marginHorizontal: mh,
    marginVertical: mv
  } : {
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr
  };

  const paddingStyle = ph || pv ? {
    paddingHorizontal: ph,
    paddingVertical: pv
  } : {
    paddingTop: pt,
    paddingBottom: pb,
    paddingLeft: pl,
    paddingRight: pr
  };

  const combinedStyle = {
    justifyContent: justify,
    alignItems: align,
    ...marginStyle,
    ...paddingStyle
  };
  const gapStyle = {
    rowGap: gv,
    columnGap: gh,
  };


  return (
    <View style={[styles.row, combinedStyle, gapStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});

const Main = ({children, style,}) => {
  return (
    <View style={[{ flex: 1, backgroundColor: colors.color.background, }, style]}>
      {children}
    </View>
  )
}

const ScrollHorizontal = ({children, style, contentContainerStyle}) => {
  return (
    <ScrollView style={style} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  )
}
const ScrollVertical = ({children, style, contentContainerStyle, ...props }) => {
  return (
    <ScrollView style={style} showsVerticalScrollIndicator={false} contentContainerStyle={contentContainerStyle} {...props}>
      <View style={{ height: 26, }}/>
      {children}
      <View style={{ height: 100, }} />
    </ScrollView>
  )
}

export { Column, Row, Main, ScrollHorizontal, ScrollVertical };
