import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params;

        try {
            const trip = await prisma.trip.findUnique({
                where: { id: tripId },
                include: {
                    participants: {
                        where: { is_owner: false }
                    }
                }
            });

            if (!trip) {
                throw new ClientError('Trip not found.');
            }

            if (trip.is_confirmed) {
                return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
            }

            await prisma.trip.update({
                where: { id: tripId },
                data: { is_confirmed: true },
            });

            const mail = await getMailClient();

            await Promise.all(
                trip.participants.map(async (participant) => {
                    try {
                        const confirmationLink = `${env.API_BASE_URL}/trips/participants/${participant.id}/confirm`;
                        const message = await mail.sendMail({
                            from: {
                                name: 'João Victor Crivoi Cesar Souza',
                                address: 'joaocrivoi13@gmail.com',
                            },
                            to: participant.email,
                            subject: `Confirm your participation on the Trip to ${trip.destination}`,
                            html: `
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>New Trip Created</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
                                        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; }
                                        h2 { color: #4CAF50; }
                                        p { margin-bottom: 10px; }
                                        table { width: 100%; margin-top: 15px; border-collapse: collapse; }
                                        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                                        th { background-color: #f2f2f2; }
                                        .btn { display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin-top: 15px; }
                                        .btn:hover { background-color: #45a049; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <h2>New Trip Created!</h2>
                                        <p>We are excited to inform you that a new trip has been created with the following details:</p>
                                        <table>
                                            <tr><th>Destination</th><td>${trip.destination}</td></tr>
                                            <tr><th>Start Date</th><td>${trip.starts_at}</td></tr>
                                            <tr><th>End Date</th><td>${trip.ends_at}</td></tr>
                                        </table>
                                        <p>Please click the button below to confirm your participation on the trip:</p>
                                        <a class="btn" href="${confirmationLink}">Confirm Trip</a>
                                        <p>Thank you for using our service. If you have any questions or need further assistance, please feel free to contact us.</p>
                                        <p>Best regards,<br>Your Trip Management Team</p>
                                    </div>
                                </body>
                                </html>
                            `.trim()
                        });

                        const testMessageUrl = nodemailer.getTestMessageUrl(message);
                        if (testMessageUrl) {
                            console.log(`Preview URL: ${testMessageUrl}`);
                        }
                    } catch (error) {
                        console.error(`Failed to send email to ${participant.email}`);
                    }
                })
            );

            return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
        } catch (error) {
            console.error(`Error confirming trip:`);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }

    });
}

