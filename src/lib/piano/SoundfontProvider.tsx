// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from "react";
import PropTypes from "prop-types";
import Soundfont from "soundfont-player";

class SoundfontProvider extends React.Component<any, any> {
    static propTypes = {
        instrumentName: PropTypes.string.isRequired,
        hostname: PropTypes.string.isRequired,
        format: PropTypes.oneOf(["mp3", "ogg"]),
        soundfont: PropTypes.oneOf(["MusyngKite", "FluidR3_GM"]),
        audioContext: PropTypes.instanceOf(window.AudioContext),
        render: PropTypes.func,
        data: PropTypes.array,
        setData: PropTypes.any,
        message: PropTypes.any,
    };

    static defaultProps = {
        format: "mp3",
        soundfont: "MusyngKite",
        instrumentName: "acoustic_grand_piano",
    };

    constructor(props) {
        super(props);
        this.state = {
            activeAudioNodes: {},
            instrument: null,
            activeNodes: [],
        };
    }

    componentDidMount() {
        this.loadInstrument(this.props.instrumentName);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.instrumentName !== this.props.instrumentName) {
            this.loadInstrument(this.props.instrumentName);
        }

        if (prevProps.message !== this.props.message) {
            const receivedData = this.props.message.data[1];

            switch (!!this.state.activeAudioNodes[receivedData]) {
                case true:
                    this.stopNote(receivedData);
                    break;

                case false:
                    this.playNote(receivedData);
                    break;
            }
        }
    }

    loadInstrument = (instrumentName) => {
        // Re-trigger loading state
        this.setState({
            instrument: null,
        });
        Soundfont.instrument(this.props.audioContext, instrumentName, {
            format: this.props.format,
            soundfont: this.props.soundfont,
            nameToUrl: (name, soundfont, format) => {
                return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
            },
        }).then((instrument) => {
            this.setState({
                instrument,
            });
        });
    };

    playNote = (midiNumber) => {
        if (!!this.state.activeAudioNodes[midiNumber]) {
            return;
        }
        this.props.audioContext.resume().then(() => {
            const audioNode = this.state.instrument.play(midiNumber);
            this.setState({
                activeAudioNodes: Object.assign(
                    {},
                    this.state.activeAudioNodes,
                    {
                        [midiNumber]: audioNode,
                    }
                ),
                activeNodes: [
                    ...this.state.activeNodes.filter((v) => v !== midiNumber),
                    midiNumber,
                ],
            });
            this.props.setData((prev) => [...prev, midiNumber]);
        });
    };

    stopNote = (midiNumber) => {
        this.props.audioContext.resume().then(() => {
            if (!this.state.activeAudioNodes[midiNumber]) {
                return;
            }
            const audioNode = this.state.activeAudioNodes[midiNumber];
            audioNode.stop();
            this.setState({
                activeAudioNodes: Object.assign(
                    {},
                    this.state.activeAudioNodes,
                    {
                        [midiNumber]: null,
                    }
                ),
                activeNodes: this.state.activeNodes.filter(
                    (v) => v !== midiNumber
                ),
            });
            this.props.setData((prev) => [...prev, midiNumber]);
        });
    };

    // Clear any residual notes that don't get called with stopNote
    stopAllNotes = () => {
        this.props.audioContext.resume().then(() => {
            const activeAudioNodes = Object.values(this.state.activeAudioNodes);
            activeAudioNodes.forEach((node) => {
                if (node) {
                    // @ts-ignore
                    node.stop();
                }
            });
            this.setState({
                activeAudioNodes: {},
            });
        });
    };

    render() {
        return this.props.render({
            isLoading: !this.state.instrument,
            playNote: this.playNote,
            stopNote: this.stopNote,
            stopAllNotes: this.stopAllNotes,
            activeNotes: this.state.activeNodes,
        });
    }
}

export default SoundfontProvider;
