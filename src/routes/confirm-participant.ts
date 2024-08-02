import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/client-error";
import { env } from "../env";



export async function confirmParticipants(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantID/confirm', {
        schema: {
            params: z.object({
                participantID: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const { participantID } = request.params;
        const participant = await prisma.participant.findUnique({
           where:{
            id: participantID,
           } 
        })

        if(!participant){
            throw new ClientError('Participant not found.')
        }

        if(participant.is_confirmed){
            return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
        }

        await prisma.participant.update({
            where:{id:participantID},
                data:{is_confirmed: true}
            
        })
       
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
       

    });
}
