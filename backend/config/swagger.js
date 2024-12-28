import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DIWD API Documentation",
            version: "1.0.0",
            description: "Documentation for DIWD project API",
        },
        servers: [
            {
                url: 'https://dev-diwd.onrender.com',
                description: 'Development server',
            },
        ],
    },
    apis: ["./routes/**/*.js"], // Pastikan ini menunjuk ke folder routes
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📃 API Documentation available at https://dev-diwd.onrender.com/api-docs`);
};

export default swaggerDocs;
