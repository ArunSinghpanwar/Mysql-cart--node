import express from 'express';
import router from './route/route';
import cookieParser from 'cookie-parser';
import { connection } from './Db_conncetion/db';

const port = 6000;
const app = express();
app.use(cookieParser())

async function loadConfigration() {
    try {
        app.use(express.json());
        app.use('/api/cartV3', router)
        app.listen(port, () => console.log(`Server is runnig on port : ${port}`))
    } catch (error) {
        console.log(error);

    }
}

loadConfigration();