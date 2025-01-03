import { Row } from '@theme/global';
import { MotiView, useAnimationState } from 'moti';
import { useContext, useEffect } from 'react';
import { ThemeContext } from 'styled-components/native';

const Check = ({status}) => {
    const { color } = useContext(ThemeContext);
    const animationState = useAnimationState({
        closed: {
          translateX: 0,
        },
        open: {
          translateX: 20,
        },
      })

      useEffect(() => {
        animationState.transitionTo(status ? 'open' : 'closed')
      }, [status])
     

    return(
            <Row style={{ backgroundColor: status ? color.primary+30 : "#d7d7d7", width: 50, borderRadius: 100, padding: 6, }}>
                <MotiView state={animationState} style={{ width: 18, height: 18, borderRadius: 100, backgroundColor: status ?  color.primary+90 : "#808080" }} />
            </Row>
)}
export default Check;