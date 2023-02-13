"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BALL = exports.PLAYER = exports.BACKGROUND = void 0;
const react_1 = require("react");
const BACKGROUND = 0;
exports.BACKGROUND = BACKGROUND;
const PLAYER = 1;
exports.PLAYER = PLAYER;
const BALL = 2;
exports.BALL = BALL;
const backgroundStyle = {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: "2px",
};
const playerStyle = {
    height: "35px",
    width: "35px",
    borderStyle: "solid",
    justifyContent: "center",
    backgroundColor: "blue",
    color: "white"
};
const ballStyle = {
    height: "35px",
    width: "35px",
    display: "block",
    backgroundColor: "yellow",
    justifyContent: "center",
    borderRadius: "100%",
    color: "white",
    zIndex: "10",
    position: 'relative'
};
const getStyle = (val) => {
    if (val === BACKGROUND) {
        return {};
    }
    if (val === PLAYER) {
        return playerStyle;
    }
    else {
        return ballStyle;
    }
};
const Box = (props) => <div style={backgroundStyle}> 
                        <div style={getStyle(props.name)}/> 
                    </div>;
exports.default = Box;
//# sourceMappingURL=canvas.js.map