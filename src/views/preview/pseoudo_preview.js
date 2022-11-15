import { useState } from "react";
import PropTypes from 'prop-types';

const SETIINGS_DEFAULTS = {
    FPS: 24,

}
export const Preview = ({
    frames,
}) => {
    const [fps, setFps] = useState(SETIINGS_DEFAULTS.FPS);
    const [isPlaying, setIsPlaying] = useState(false);
    const [pausedFrame, setPausedFrame] = useState(0);

    //  state
    return (
        <Screen />
    )
}

Preview.propTypes = {
    frames: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
