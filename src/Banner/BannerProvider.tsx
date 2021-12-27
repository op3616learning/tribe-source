import React, { useCallback, createContext, useState, useMemo, useRef, } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { useToggle } from '../hooks/useToggle';
import { BANNER_MAX_HEIGHT, BANNER_RATIO, BANNER_MIN_HEIGHT } from './constants';
import { preventNavigation } from './utils';
const SIDEBAR_WIDTH = '17rem';
const initialImageCrop = {
    cropX: 0,
    cropY: 0,
    cropWidth: 0,
    cropHeight: 0,
    width: 0,
    height: 0,
};
const initialCropScale = { x: 1, y: 1 };
const initialZoom = { x: 1, y: 1 };
export const bannerContext = createContext(undefined);
export const BannerProvider = ({ children }) => {
    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(initialZoom);
    const [cropScale, setCropScale] = useState(initialCropScale);
    const [imageCrop, setImageCrop] = useState(initialImageCrop);
    const saveCallbackRef = useRef(null);
    const [isEditing, toggleEditing] = useToggle(false);
    const [isLoading, , enableLoading, disableLoading] = useToggle(false);
    const { isMobile } = useResponsive();
    const [newImageFile, setNewImageFile] = useState(null);
    const windowWidth = typeof window !== 'undefined' && window.innerWidth;
    const cropSize = useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                width: 1000,
                height: BANNER_MAX_HEIGHT,
            };
        }
        let cropWidth = window.innerWidth;
        if (!isMobile) {
            cropWidth -=
                // It's in rems
                parseInt(SIDEBAR_WIDTH, 10) *
                    // Get 1rem in pixels
                    parseInt(window.getComputedStyle(document.body).fontSize, 10);
        }
        return {
            width: cropWidth || 0,
            height: Math.max(Math.floor(cropWidth / BANNER_RATIO), BANNER_MIN_HEIGHT) || 0,
        };
        // window.innerWidth dependency triggers the recalculation of width on resize
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, windowWidth]);
    const updateZoom = useCallback((mediaSize) => {
        // Get the actual image sizes
        setZoom({
            x: cropSize.width / mediaSize.width,
            y: cropSize.height / mediaSize.height,
        });
        setCropScale({
            y: imageCrop.cropHeight / mediaSize.height,
            x: imageCrop.cropWidth / mediaSize.width,
        });
    }, [
        cropSize.height,
        cropSize.width,
        imageCrop.cropHeight,
        imageCrop.cropWidth,
    ]);
    const startLoading = useCallback(() => {
        enableLoading();
        window.onbeforeunload = preventNavigation;
    }, [enableLoading]);
    const stopLoading = useCallback(() => {
        disableLoading();
        window.onbeforeunload = null;
    }, [disableLoading]);
    const onImageSelect = useCallback((event) => {
        const file = event.target.files[0];
        startLoading();
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                var _a;
                setNewImageFile(e.target.result);
                const payload = {
                    cropX: 0,
                    cropY: 0,
                    cropWidth: cropSize.width,
                    cropHeight: cropSize.height,
                    imageFile: file,
                };
                await ((_a = saveCallbackRef.current) === null || _a === void 0 ? void 0 : _a.call(saveCallbackRef, payload));
                stopLoading();
                setNewImageFile(null);
            };
            reader.readAsDataURL(file);
        }
        catch (e) {
            stopLoading();
        }
    }, [cropSize.height, cropSize.width, startLoading, stopLoading]);
    const resetImage = useCallback(() => {
        setImage(null);
        setImageCrop(initialImageCrop);
    }, []);
    return (React.createElement(bannerContext.Provider, { value: {
            image: newImageFile || image,
            setImage,
            isEditing,
            toggleEditing,
            imageCrop,
            setImageCrop,
            cropSize,
            zoom,
            setZoom,
            cropScale,
            updateZoom,
            onImageSelect,
            saveCallbackRef,
            isLoading,
            startLoading,
            stopLoading,
            resetImage,
        } }, children));
};
//# sourceMappingURL=BannerProvider.js.map