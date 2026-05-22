const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "QShop API",
    description: "API for QShop",
    version: "1.0.0"
  },
  host: "localhost:6001",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/auth.router.ts"];
swaggerAutogen(outputFile, endpointsFiles, doc);