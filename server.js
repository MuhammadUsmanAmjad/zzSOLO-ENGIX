import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import router from './server/routes/router.js';

const app = express();
dotenv.config();

const PORT = 8080;

// Resolve directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// log requests
app.use(morgan('tiny'));

// mongodb connection
async function connectDB() {
    try {
        // mongodb connection string
        await mongoose.connect('mongodb+srv://HafizMannan:mannan1234@cluster0.8kwpzdr.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connected : ${mongoose.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

connectDB();

// parse request to body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// load assets
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

// load routers
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
