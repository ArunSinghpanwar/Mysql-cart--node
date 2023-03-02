import express from 'express';
import router from './route/route';

const port = 6000;
const app = express();

async function loadConfigration() {
    try {
        app.use(express.json());
        app.use('/api/cartV3', router)
        require('./Db_conncetion/db')
        app.listen(port, () => console.log(`Server is runnig on port : ${port}`))
    } catch (error) {
        console.log(error);

    }
}

loadConfigration();