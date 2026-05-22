import express from 'express';
import cors from 'cors';

import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerUi from 'swagger-ui-express';
const swaggerDoc = require("./swagger-output.json");



const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', "Content-Type"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.get('/', (req, res) => {
  res.send({ 'message': 'Hello API' });
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.get("/doc-json", (req, res) =>{
  res.json(swaggerDoc);
})
//routes
app.use("/api", router)

app.use(errorMiddleware);
const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);

  console.log(`swagger docs available at http://localhost:${port}/docs`)

})
server.on("error", (error) => {
  console.log("server error: ", error);


}
)


