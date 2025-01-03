import React from 'react';
import { Switch as NativeSwitch,  } from 'react-native';
import colors from './colors';

function Switch({
  ...props
}: React.ComponentPropsWithoutRef<typeof NativeSwitch>) {

  const trackColor = props.trackColor || {
    false: colors.color.false,
    true: colors.color.true,
  };
  const thumbColor = props.thumbColor ||  colors.color.false;
  const ios_backgroundColor =
    props.ios_backgroundColor ||  colors.color.false;

  return (
    <NativeSwitch
      trackColor={trackColor}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      {...props}
    />
  );
}

export default Switch;