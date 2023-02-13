import React from 'react';
declare class App extends React.Component<any, any> {
    constructor(props: any);
    resetGame: () => any;
    moveBoard: (playerBoard: any, isUp: any) => any;
    componentDidMount(): void;
    touchingEdge: (pos: any) => boolean;
    touchingPaddle: (pos: any) => boolean;
    isScore: (pos: any) => boolean;
    moveOpponent: () => void;
    touchingPaddleEdge: (pos: any) => boolean;
    bounceBall: () => void;
    keyInput: ({ keyCode }: {
        keyCode: any;
    }) => void;
    render(): any;
}
export default App;
