import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, company, subject, message } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        // Create email content
        const emailContent = `
New Contact Form Submission

From: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'N/A'}
Company: ${company || 'N/A'}

Subject: ${subject}

Message:
${message}
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
                user: 'hello@eastmymedia.my',
                pass: 'Amrin123!!'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send notification to admin
        await adminTransporter.sendMail({
            from: '"Eastmy Media Website" <request-rate@eastmymedia.my>',
            to: 'hello@eastmymedia.my',
            replyTo: email,
            subject: `Contact Form: ${subject} - ${firstName} ${lastName}`,
            text: emailContent,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a1a; border-bottom: 2px solid #009b4d; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #009b4d; margin-top: 0;">Sender Details:</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                                <td style="padding: 8px 0;">${firstName} ${lastName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                                <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                                <td style="padding: 8px 0;">${phone || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold;">Company:</td>
                                <td style="padding: 8px 0;">${company || 'N/A'}</td>
                            </tr>
                        </table>

                        <h3 style="color: #009b4d; margin-top: 0;">Message:</h3>
                        <div style="background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd;">
                            <strong>Subject:</strong> ${subject}<br/><br/>
                            ${message.replace(/\n/g, '<br/>')}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        <strong>Received:</strong> ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
                    </p>
                </div>
            `
        });

        // Send auto-reply to client
        await autoReplyTransporter.sendMail({
            from: '"Eastmy Media" <hello@eastmymedia.my>',
            to: email,
            subject: `Thank you for contacting East My Media`,
            text: `Dear ${firstName} ${lastName},\n\nThank you for reaching out to us. We have received your message regarding "${subject}" and will get back to you as soon as possible.\n\nBest regards,\nEast My Media Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #009b4d;">Thank you for contacting us!</h2>
                    <p>Dear ${firstName} ${lastName},</p>
                    <p>Thank you for reaching out to East My Media.</p>
                    <p>We have received your message regarding <strong>"${subject}"</strong> and our team will get back to you as soon as possible.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>East My Media Team</strong></p>
                    <p style="color: #888; font-size: 12px; margin-top: 20px;">This is an automated message, please do not reply directly to this email.</p>
                </div>
            `
        });

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
        });
    } catch (error: any) {
        console.error('Error sending contact email:', error);
        return NextResponse.json(
            { error: `Failed to send message: ${error.message}` },
            { status: 500 }
        );
    }
}
