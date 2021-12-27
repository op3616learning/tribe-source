import React from 'react';
import { useCheckbox, } from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import { chakra, forwardRef, omitThemingProps, } from '@chakra-ui/system';
import { dataAttr } from '@chakra-ui/utils';
const [ButtonSwitchProvider, useButtonSwitchContext] = createContext({
    strict: true,
    name: 'ButtonSwitchContext',
});
export const ButtonSwitch = forwardRef((props, ref) => {
    const { children, ...ownProps } = omitThemingProps(props);
    const checkboxContext = useCheckbox(ownProps);
    const itemStyles = {
        padding: 1,
        borderRadius: 'base',
        bgColor: 'bg.secondary',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 120ms',
    };
    return (React.createElement(ButtonSwitchProvider, { value: checkboxContext },
        React.createElement("input", Object.assign({}, checkboxContext.getInputProps({}, ref))),
        React.createElement(chakra.button, Object.assign({ type: "button", role: "switch" }, checkboxContext.getRootProps(), { __css: itemStyles }), children)));
});
const innerButtonStyles = {
    lineHeight: 10,
    h: 10,
    minW: 10,
    px: 4,
    fontWeight: 'medium',
    fontSize: 'md',
    textAlign: 'center',
    borderRadius: 'base',
    pointerEvents: 'none',
    color: 'label.primary',
    flexGrow: 1,
    transition: 'transform 250ms',
    userSelect: 'none',
};
export const ButtonSwitchOn = ({ children }) => {
    const { state } = useButtonSwitchContext();
    const itemStyles = {
        ...innerButtonStyles,
        bg: 'bg.secondary',
        _active: {
            bg: 'bg.base',
        },
    };
    return (React.createElement(chakra.div, { __css: itemStyles, "data-active": dataAttr(state.isChecked) }, children));
};
export const ButtonSwitchOff = ({ children }) => {
    const { state } = useButtonSwitchContext();
    const itemStyles = {
        ...innerButtonStyles,
        bg: 'bg.secondary',
        _active: {
            bg: 'bg.base',
        },
    };
    return (React.createElement(chakra.div, { __css: itemStyles, "data-active": dataAttr(!state.isChecked) }, children));
};
//# sourceMappingURL=ButtonSwitch.js.map