import { createBoard } from '@wixc3/react-board';
import App from '../../../App';

export default createBoard({
    name: 'App',
    Board: () => <App key={null} />,
    environmentProps: {
        windowWidth: 2060,
        windowHeight: 1080,
        canvasWidth: 2047,
    },
});
