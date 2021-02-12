import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';
import './database'; // importando conexão database 

const app = express();
app.use(cors());
app.use(express.json()); // Utl.JSON
app.use('/file', express.static(uploadConfig.directory)); //exibir fotos localhost:
app.use(routes);// ordem linear 

//trativa de erro, captando todo erros, centralizando 
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    };

    //erro não esperado
    // console.log(err)
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});


app.listen(3333, () => {
    console.log('🚀Server started on port 3333! 🚀');
});