import { createTransport } from "nodemailer"
import util from 'util';
import { ENV_VARIABLES } from "../config/server"

export const transporter = createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: ENV_VARIABLES.EMAIL_USER,
		pass: ENV_VARIABLES.EMAIL_PASSWORD,
	},
})

export const verifySMTPConnection = async () => {
	try {
		const result = await transporter.verify()
		if (result) {
			console.log(`Mail: SMTP connection is verified.`)
		} else {
			console.log(`Mail: SMTP connection could not established`)
		}
	} catch (error) {
		console.log(`Mail: SMTP connection could not established`)
	}
}

export interface EmailData {
	from?: string
	to: string
	subject: string
	message?: string
	html?: string
	text?: string
	attachments?: object[]
}

export const resetPasswordTemplate = (link: string) => `
<h1 style="color:#000000;font-size:32px;font-weight:600;line-height:32px;margin:48px 0;text-align:center">
   Reset password
</h1>
<div style="background-color:ghostwhite;border-radius:4px;padding:24px 48px;text-align:left;">
<p>
   A request to reset your password was made. You can set a new password by clicking the following link:
</p>
<p style="margin: 40px auto;">
    <a href="${link}" style="padding: 15px;background-color: #70E4EF;border-radius: 5px;color: black;text-decoration: none;">
    Set a new password
    </a>
</p>
<p>
   If this was not you, you can safely delete this email.
</p>
</div>`