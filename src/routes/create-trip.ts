import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../erros/client-error";
import { env } from "../env";

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email()),
            })
        }
    }, async (request) => {
        const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body;
        
        if (dayjs(starts_at).isBefore(new Date())) {
            throw new ClientError('Invalid trip start date');
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new ClientError('Invalid trip end date.');
        }

     
        const trip = await prisma.trip.create({
            data: {
                destination, 
                starts_at, 
                ends_at,
                participants: {
                    createMany:{
                        data:[
                            {
                                name: owner_name,
                                email: owner_email,
                                is_owner : true,
                                is_confirmed: true,
                            },

                            ...emails_to_invite.map(email =>{
                                return {email}
                            })
                            
                        ],
                    }
                }
            }
        })

        
        

        const mail = await getMailClient();
        const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`
        const message = await mail.sendMail({
            from: {
                name: 'João Victor Crivoi Cesar Souza',
                address: 'joaocrivoi13@gmail.com'
            },
            to: {
                name: owner_name,
                address: owner_email
            },
            subject: `Trip Confirmation to ${destination}`,
            html: `
                        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Trip Created</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            h2 {
                color: #4CAF50;
            }
            p {
                margin-bottom: 10px;
            }
            table {
                width: 100%;
                margin-top: 15px;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }

             .btn {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 4px;
                margin-top: 15px;
            }
            .btn:hover {
                background-color: #45a049;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <h2>New Trip Created!</h2>
                <p>Dear ${owner_name},</p>
                <p>We are excited to inform you that a new trip has been created with the following details:</p>
                
                <table>
                    <tr>
                        <th>Destination</th>
                        <td>${destination}</td>
                    </tr>
                    <tr>
                        <th>Start Date</th>
                        <td>${starts_at}</td>
                    </tr>
                    <tr>
                        <th>End Date</th>
                        <td>${ends_at}</td>
                    </tr>
                </table>

                <p>Please click the button below to confirm your trip:</p>
                <a class="btn" href="${confirmationLink}">Confirm Trip</a>
                
                <p>Thank you for using our service. If you have any questions or need further assistance, please feel free to contact us.</p>
                
                <p>Best regards,<br>Your Trip Management Team</p>
            </div>
        </body>
        </html>

            `.trim()
        })

        console.log(nodemailer.getTestMessageUrl(message));

        return { tripId: trip.id };
    })
}
