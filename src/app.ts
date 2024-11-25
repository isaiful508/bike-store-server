import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { ProductRoutes } from './app/modules/product/product.route'
import { OrderRoutes } from './app/modules/order/order.route'
import errorMiddleware from './app/middlewares/errorMIddleware'

const app : Application = express()

//parser
app.use(express.json())
app.use(cors())

//application routes
app.use('/api', ProductRoutes);
app.use('/api', OrderRoutes);
app.use(errorMiddleware);


app.get('/', (req : Request, res: Response) => {
    res.send('Hello World!')
})

export default app;