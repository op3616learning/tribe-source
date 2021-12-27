import React, { forwardRef, useCallback, useRef, useState, } from 'react';
import { Box, Portal, useMultiStyleConfig } from '@chakra-ui/react';
import { Trans, useTranslation } from 'tribe-translation';
import { DropdownItemIcon } from '../Dropdown/DropdownItem';
import { useSelectedItem } from '../hooks/useSelectedItem';
import { Input } from '../Input';
import { ListView, ListViewTrigger, ListViewContent, ListViewItem, } from '../ListView';
import { SelectTriggerBox } from '../Select/SelectTriggerBox';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
let searchTimeout = null;
const SearchBox = forwardRef(({ onChange }, ref) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = useCallback((event) => {
        clearTimeout(searchTimeout);
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        searchTimeout = setTimeout(() => onChange(newSearchTerm), 300);
    }, [onChange]);
    return (React.createElement(Input, { value: searchTerm, onChange: handleSearch, mb: 2, id: "searchable-select-search-box", ref: ref, placeholder: t('common:autocomplete.type_to_search', 'Type to search ...') }));
});
export const SearchableSelect = ({ listViewContentProps, onChange, options: initialOptions, searchHandler, value, ...props }) => {
    const [options, setOptions] = useState(initialOptions);
    const [isFetchingOptions, setIsFetchingOptions] = useState(false);
    const dropdownStyles = useMultiStyleConfig('Dropdown', {});
    const searchInputRef = useRef();
    const handleSearch = useCallback((searchTerm) => {
        if (typeof searchHandler === 'function') {
            setIsFetchingOptions(true);
            searchHandler(searchTerm).then(newOptions => {
                setOptions(newOptions);
                setIsFetchingOptions(false);
            });
        }
        else {
            const newOptions = initialOptions.filter(({ label }) => label.toLowerCase().includes(searchTerm.trim().toLowerCase()));
            setOptions(newOptions);
        }
    }, [initialOptions, searchHandler]);
    const { selectedItem, selectItem } = useSelectedItem({
        options,
        value,
        onChange,
    });
    return (React.createElement(ListView, { popoverProps: {
            placement: 'bottom-start',
            autoFocus: true,
            initialFocusRef: searchInputRef,
        } }, ({ isOpen, onClose }) => (React.createElement(React.Fragment, null,
        React.createElement(ListViewTrigger, { "data-testid": "searchable-select-trigger", px: 0, w: "full" },
            React.createElement(SelectTriggerBox, Object.assign({ selectedItem: selectedItem }, props))),
        React.createElement(Portal, null,
            React.createElement(Box, { sx: {
                    '.css-0': {
                        zIndex: isOpen ? 'popover' : 'hide',
                    },
                } },
                React.createElement(ListViewContent, Object.assign({ w: "xs", maxH: "xs", popoverContentProps: {
                        sx: {
                            zIndex: isOpen ? 'popover' : 'hide',
                        },
                    } }, listViewContentProps),
                    React.createElement(SearchBox, { ref: searchInputRef, onChange: handleSearch }),
                    isFetchingOptions ? (React.createElement(Spinner, { mx: "auto", my: 2, display: "block" })) : (React.createElement(React.Fragment, null, options.length ? (options.map(item => (React.createElement(ListViewItem, { onClick: () => {
                            selectItem(item);
                            onClose();
                        }, key: item.value.id, "data-testid": "searchable-list-item", sx: {
                            ...dropdownStyles.item,
                            display: 'flex',
                            px: 2,
                            h: 10,
                        } },
                        item.icon && React.createElement(DropdownItemIcon, { icon: item.icon }),
                        React.createElement(Text, { textStyle: "medium/medium" }, item.label))))) : (React.createElement(Text, { align: "center" },
                        React.createElement(Trans, { i18nKey: "common:autocomplete.noresult", defaults: "No results found" }))))))))))));
};
//# sourceMappingURL=SearchableSelect.js.map