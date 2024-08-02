import type { FastifyInstance } from "fastify"
import { ClientError } from "./erros/client-error";
import { ZodError } from "zod";


type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
            path: err.path,
            message: err.message
        }));
        return reply.status(400).send({
            message: "Validation error",
            errors: validationErrors
        });
    }

    if (error instanceof ClientError) {
        console.error(`ClientError: ${error.message}`);
        return reply.status(400).send({
            message: error.message,
        });
    }

    console.error(`Unhandled error: ${error.message}`);
    return reply.status(500).send({ message: "Internal Server Error" });
};
