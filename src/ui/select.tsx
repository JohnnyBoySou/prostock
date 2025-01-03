import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleProp, ViewStyle, Pressable, Text } from 'react-native';

function Select({
  values,
  setValue,
  value
}) {


  return (
    <View style={{ flexDirection: 'column', display: 'flex', flex: 1, gap: 16, }}>
      {values.map((item, index) => (
        <Pressable key={index} onPress={() => { setValue(item) }} style={{ backgroundColor: item.name === value.name? '#fff': '#202020', paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 16, }}>
          <Text style={{ fontFamily: 'Font_Medium', color: item.name === value.name? '#000': '#FFF', fontSize: 18, marginHorizontal: 12, textAlign: 'center' }}>{item?.name}</Text>
        </Pressable>))}
    </View>
  );
}

export default Select;
