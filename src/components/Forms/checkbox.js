import { Button } from '@theme/global';
import { AnimatePresence, MotiView } from 'moti';
import { useContext} from 'react';
import { ThemeContext } from 'styled-components/native';
import { Check } from 'lucide-react-native';
import { Pressable } from 'react-native';

const CheckBox = ({status, setstatus, size = 28}) => {
    const { color } = useContext(ThemeContext);
    return(
         <Pressable onPress={() => {setstatus(!status)}}  style={{ paddingHorizontal: 0, borderRadius: 6, paddingVertical: 0, borderColor: status ? "#918C8B" : "#50505090", backgroundColor: status ? '#918C8B' : '#fff', width: size, justifyContent: 'center', alignItems: 'center',  borderWidth:2, height: size, }}>
           <AnimatePresence>
           {status && 
            <MotiView from={{opacity: 0, scale: 0, translateY: 20,}} animate={{scale: 1, opacity: 1,  translateY: 0,}} exit={{opacity: 0, scale: 0,  translateY: 20,}}>
            <Check size={18} color="#fff"/>
            </MotiView> 
            }
           </AnimatePresence>
          </Pressable>
)}
export default CheckBox;