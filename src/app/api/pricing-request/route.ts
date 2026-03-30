import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, company, mediaId, mediaName } = body;

        // Validate required fields
        if (!name || !email || !phone || !company) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create email content
        const emailContent = `
New Rate Card Request Received

Media Details:
- Media Name: ${mediaName || 'N/A'}
- Media ID: ${mediaId || 'N/A'}
- Location: ${body.mediaDetails?.location || 'N/A'}
- Type: ${body.mediaDetails?.type || 'N/A'}
- Size: ${body.mediaDetails?.size || 'N/A'}
- Price: RM ${body.mediaDetails?.price?.toLocaleString() || 'N/A'}

Client Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Company: ${company || 'N/A'}

Request Date: ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}

Please review and contact the client regarding the rate card for this media.
        `.trim();

        // Create Nodemailer transporter for Admin Notifications (Incoming)
        const adminTransporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'request-rate@eastmymedia.my',
                pass: 'Amrin123!!'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Create Nodemailer transporter for Auto-Replies (Outgoing)
        const autoReplyTransporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'no.reply@eastmymedia.my',
                pass: 'Amrin123!!'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection configuration
        try {
            await adminTransporter.verify();
            await autoReplyTransporter.verify();
            console.log('SMTP Connections established');
        } catch (verifyError: any) {
            console.error('SMTP Connection failed:', verifyError);
            throw new Error(`SMTP Connection failed: ${verifyError.message}`);
        }

        // Send notification to admin
        await adminTransporter.sendMail({
            from: '"Eastmy Media" <request-rate@eastmymedia.my>',
            to: 'request-rate@eastmymedia.my',
            replyTo: email,
            subject: `Rate Card Request: ${mediaName} - ${company || name}`,
            text: emailContent,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a1a; border-bottom: 2px solid #009b4d; padding-bottom: 10px;">
                        New Rate Card Request
                    </h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #009b4d; margin-top: 0;">Media Details:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Media Name:</td>
                                <td style="padding: 8px 0;">${mediaName || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Media ID:</td>
                                <td style="padding: 8px 0;">${mediaId || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                                <td style="padding: 8px 0;">${body.mediaDetails?.location || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Type:</td>
                                <td style="padding: 8px 0;">${body.mediaDetails?.type || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Size:</td>
                                <td style="padding: 8px 0;">${body.mediaDetails?.size || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Price:</td>
                                <td style="padding: 8px 0;">RM ${body.mediaDetails?.price?.toLocaleString() || 'N/A'}</td>
                            </tr>
                        </table>

                        <h3 style="color: #009b4d; margin-top: 0;">Client Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                                <td style="padding: 8px 0;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                                <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                                <td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Company:</td>
                                <td style="padding: 8px 0;">${company || 'N/A'}</td>
                            </tr>
                        </table>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        <strong>Request Date:</strong> ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
                    </p>
                </div>
            `
        });

        // Send auto-reply to client
        await autoReplyTransporter.sendMail({
            from: '"Eastmy Media" <no.reply@eastmymedia.my>',
            to: email,
            subject: `We've received your inquiry for ${mediaName}`,
            text: `Dear ${name},\n\nThank you for your inquiry regarding ${mediaName}. We have received your request for the rate card and will get back to you as soon as possible.\n\nBest regards,\nEast My Media Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #009b4d;">Thank you for your inquiry!</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for your interest in <strong>${mediaName}</strong>.</p>
                    <p>We have received your request for the rate card and our team will get back to you as soon as possible with the details.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>East My Media Team</strong></p>
                    <p style="color: #888; font-size: 12px; margin-top: 20px;">This is an automated message, please do not reply directly to this email.</p>
                </div>
            `
        });

        return NextResponse.json({
            success: true,
            message: 'Pricing request submitted successfully',
        });
    } catch (error: any) {
        console.error('Error processing pricing request:', error);
        return NextResponse.json(
            { error: `Failed to process request: ${error.message}` },
            { status: 500 }
        );
    }
}
