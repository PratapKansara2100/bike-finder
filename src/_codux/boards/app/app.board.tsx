import { createBoard } from '@wixc3/react-board';
import App from '../../../App';

export default createBoard({
    name: 'App',
    Board: () => <App key={null} />,
    environmentProps: {
        windowWidth: 1540,
        windowHeight: 768,
        canvasWidth: 2834,
        canvasHeight: 1080,
    },
});
