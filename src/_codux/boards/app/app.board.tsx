import { createBoard } from '@wixc3/react-board';
import App from '../../../App';

export default createBoard({
    name: 'App',
    Board: () => <App key={null} />,
    environmentProps: {
        windowWidth: 2078,
        windowHeight: 740,
        canvasWidth: 2834,
        canvasHeight: 1080,
    },
});
