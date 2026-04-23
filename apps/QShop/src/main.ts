import express from 'express';
import cors from 'cors';
import { error } from 'console';
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';



const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', "Content-Type"],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send({ 'message': 'Hello API' });
});
app.use(errorMiddleware);
const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);
})
server.on("error", (error) => {
  console.log("server error: ", error);


}
)


