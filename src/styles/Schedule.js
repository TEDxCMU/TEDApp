import styled, { keyframes } from 'styled-components';
import posed from 'react-pose';

export const Item = posed.li({
    enter: {
        y: 0, x: 0, opacity: 1,
        transition: {
            x: { type: 'spring', stiffness: 300, damping: 15 },
            y: { type: 'spring', stiffness: 300, damping: 15 },
            default: { duration: 300 },
        },
    },
    exit: { y: 20, opacity: 0, transition: { duration: 150 } },
});

export const Sidebar = posed.ul({
    enter: {
        x: 0,
        delayChildren: 1100,
        staggerChildren: 50,
        transition: {
            x: { type: 'spring', stiffness: 100, damping: 15 },
            y: { type: 'spring', stiffness: 100, damping: 15 },
        },
    },
    exit: { x: '-100%', delay: 0, transition: { duration: 0 } },
});

export const Loader = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
`;

// Bullet Styles
export const nowPulseBefore = keyframes`
    0%, 35% {
        transform: scale(0);
        opacity: 1;
    }
    45% {
        transform: scale(1.2);
        opacity: 0.9;
    }
    100% {
        opacity: 0;
        transform: scale(3);
    }
`;

export const nowPulseAfter = keyframes`
    0%, 35% {
        transform: scale(0);
        opacity: 0;
    }
    47% {
        transform: scale(2);
        opacity: 0.5;
    }
    100% {
        opacity: 0;
        transform: scale(4);
    }
`;

export const Bullet = styled.span`
    content: '';
    position: absolute;
    top: calc(50% - 4px);
    left: calc(-2rem - 4px);
    height: 12px;
    width: 12px;
    background-color: ${props => props.theme.color.red};
    border-radius: 50%;
    z-index: 1;
`;

export const Bullet_Now = styled(Bullet)`
    &::before {
        top: 0;
        left: 0;
        animation: ${nowPulseBefore} 2.5s infinite;
    }

    &::after {
        top: 0;
        left: 0;
        animation: ${nowPulseAfter} 2.5s infinite;
    }
`;

export const Bullet_Past = styled(Bullet)`
    background-color: ${props => props.theme.color.grey500};
`;

export const Bullet_BG = styled.span`
    content: '';
    position: absolute;
    height: ${props => props.theme.system.space6};
    width: ${props => props.theme.system.space6};
    top: calc(50% - 11px);
    left: calc(-2rem - 12px);
    background-color: ${props => props.theme.color.colorPageBackground};
    border-radius: 50%;
    z-index: 0;
`;

// Event Card Styles
export const Event_Card = styled.div`
    padding: ${props => props.theme.system.space9} ${props => props.theme.system.space7};
    border-radius: ${props => props.theme.system.space11};
`;

export const Event_Card_Clickable = styled(Event_Card)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${props => props.theme.system.space5} 0;
    background: ${props => props.theme.color.white};
    border: 1px solid #F5F5F5;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.13);
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease-in-out;
    }
`;

export const Event_Card_Static = styled(Event_Card)`
    margin: ${props => props.theme.system.space8} 0 ${props => props.theme.system.space5};
    border-color: 1px solid ${props => props.theme.color.red};
    border-radius: 3px;
`;

export const Event_Card_Content = styled.div`
    margin-right: ${props => props.theme.system.space11};
`;

export const Event_Card_Img = styled.img`
    position: relative;
    float: left;
    vertical-align: middle;
    top: 5px;
    height: ${props => props.theme.system.space7};
    width: ${props => props.theme.system.space7};
    margin: 0;
    border-radius: 50%;    
`;

export const Event_Card_Arrow = styled.img`
    position: absolute;
    vertical-align: middle;
    right: 0;
    margin: 0;
    padding: 0 ${props => props.theme.system.space8} 0 ${props => props.theme.system.space9};
    color: ${props => props.theme.color.grey200};
`;

// Event Styles
export const Event = styled(Item)`
    position: relative;
`;

export const Event_Time = styled.p`
    margin-bottom: 0;
    font-size: 0.9rem;
    color: ${props => props.theme.color.red};
`;

export const Event_Title = styled.h4`
    margin: 0;
`;

export const Event_Desc = styled.p`
    float: left;
    position: relative;
    vertical-align: middle;
    top: ${props => props.theme.system.space11};
    margin-bottom: ${props => props.theme.system.space11};
    padding-left: ${props => props.theme.system.space11};
    font-size: 0.9rem;
`;

// Timeline Styles
export const Timeline_Container = styled.div`
    margin-top: 270px;
    padding: 10% 4% 10% calc(4% + 2rem + 4px);

    @media only screen and (min-width: 992px) {
        margin-top: 240px;
    }
`;

export const Timeline = styled(Sidebar)`
    position: relative;
    margin: ${props => props.theme.system.space7};
    list-style-type: none;
    transition: all 1s linear;

    &::before {
        content: "";
        display: block;
        position: absolute;
        left: -${props => props.theme.system.space5};
        height: 100%;
        width: 0;
        border: 1px solid ${props => props.theme.color.grey200};
    }
`;
