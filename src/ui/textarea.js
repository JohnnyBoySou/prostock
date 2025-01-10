import { useState, forwardRef } from "react";
import { Column, Label } from "@/ui";
import { TextInput } from "react-native";

const TextArea = forwardRef(
    (
        {
            focused = false,
            value,
            setValue,
            disabled,
            label,
            placeholder,
            onSubmitEditing = () => { },
            props,
        },
        ref
    ) => {
        const [focus, setFocus] = useState(false);

        const handleFocus = () => {
            setFocus(true);
        };

        const handleBlur = () => {
            setFocus(false);
        };

        return (
            <Column>
                {label && <Label color="#484848">{label}</Label>}
                <TextInput
                    {...props}
                    ref={ref}
                    multiline={true} // Define como área de texto
                    numberOfLines={4} // Define o tamanho inicial do campo
                    style={{
                        fontSize: 16,
                        fontFamily: "Font_Book",
                        color: disabled ? "#00000090" : "#000",
                        height: 120,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        padding: 16,
                        marginTop: 8,
                        borderWidth: 2,
                        borderColor: focus ? "#1E1E1E" : "#D6D6D6",
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={!disabled}
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    placeholderTextColor="#808080"
                    autoFocus={focused}
                    onSubmitEditing={onSubmitEditing}
                    textAlignVertical="top"
                />
            </Column>
        );
    }
);

export default TextArea;
