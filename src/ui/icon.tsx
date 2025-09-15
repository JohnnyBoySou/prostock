import React from 'react';
import * as LucideIcons from 'lucide-react-native';

export interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: any;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000', 
  strokeWidth = 1.5,
  style,
  ...props 
}) => {
  const LucideIcon = LucideIcons[name] as React.ComponentType<any>;
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide React Native`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      {...props}
    />
  );
};

export default Icon;
