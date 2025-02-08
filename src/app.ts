import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { ProductRoutes } from './app/modules/product/product.route'
import { OrderRoutes } from './app/modules/order/order.route'
import error from './app/middlewares/error'
import { UserRoutes } from './app/modules/user/user.route'



const app : Application = express()

//parser
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials : true,
}))

//application routes
app.use('/api', ProductRoutes);
app.use('/api', OrderRoutes);
app.use('/api', UserRoutes);
app.use(error);


app.get('/', (req : Request, res: Response) => {
    res.send('Hello World!')
})

export default app;