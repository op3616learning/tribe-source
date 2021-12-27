/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect } from 'react';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import { Spinner } from '../Spinner';
import { getMediaURL } from '../utils/getMedia';
import { bannerContext } from './BannerProvider';
import { BANNER_RATIO } from './constants';
import { EditableImage } from './EditableImage';
import { EditButton } from './EditButton';
import { BannerImage } from './Image';
export const Banner = ({ image: initialImage, onRemove, onSave, onEdit, }) => {
    const { image, setImage, isEditing, isLoading, setImageCrop, saveCallbackRef, resetImage, } = useContext(bannerContext);
    const imageId = initialImage === null || initialImage === void 0 ? void 0 : initialImage.id;
    useEffect(() => {
        setImage(getMediaURL(initialImage));
        if (initialImage) {
            const { cropX, cropY, cropWidth, cropHeight, height, width, } = initialImage;
            setImageCrop({ cropX, cropY, cropWidth, cropHeight, height, width });
        }
        // We need to refresh the context state only if
        // the image itself is completely different (id has changed).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageId, setImage, setImageCrop]);
    useEffect(() => {
        if (typeof onSave === 'function') {
            saveCallbackRef.current = onSave;
        }
    }, [saveCallbackRef, onSave]);
    const handleRemove = useCallback(() => {
        onRemove();
        resetImage();
    }, [onRemove, setImage, setImageCrop]);
    const showEditButton = typeof onRemove === 'function' && typeof onSave === 'function' && !isLoading;
    if (!image)
        return null;
    return (React.createElement(Flex, { position: "relative", align: "center", justify: "center", "data-testid": "cover-image-container" },
        React.createElement(AspectRatio, { w: "full", ratio: BANNER_RATIO },
            React.createElement(Box, { w: "full", h: "full" },
                isEditing ? React.createElement(EditableImage, { onEdit: onEdit }) : React.createElement(BannerImage, null),
                isLoading && (React.createElement(React.Fragment, null,
                    React.createElement(Box, { bgColor: "modalOverlay", w: "inherit", h: "inherit", position: "absolute" }),
                    React.createElement(Box, { pos: "absolute", right: 4, bottom: 4, px: 2, py: 1, bgColor: "modalOverlay", borderRadius: "base" },
                        React.createElement(Spinner, { color: "bg.base", size: "sm", thickness: "2px", mr: 0, emptyColor: "transparent" })))))),
        showEditButton && React.createElement(EditButton, { onRemove: handleRemove })));
};
//# sourceMappingURL=Banner.js.map