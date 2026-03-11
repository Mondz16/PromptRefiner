import nodemailer from "nodemailer";
import mailgen from "mailgen";
import {Resend} from "resend";

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: "Prompt Refiner",
      link: "https://promptrefiner.com",
    },
  });

  const contentTextual = mailGenerator.generatePlaintext(options.content);
  const contentHTML = mailGenerator.generate(options.content);

  let transporter;

  if (smtpHost && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    transporter = {
      sendMail: async (options) => {
        console.log("Email sending is not configured. Email content:");
        console.log(options);
      },
    };
  }

  const fromAddress = process.env.EMAIL_FROM || "no-reply@promptrefiner.local";

  const mail = {
    from: fromAddress,
    to: options.to,
    subject: options.subject,
    html: contentHTML
  };

  try {
    const { data, error }  = await resend.emails.send(mail);
  
    if (error) {
      return console.error({ error });
    }
  
    console.log({ data });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

const emailVerificationContent = ({ username, url }) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we are excited to have you on board.",
      action: {
        instructions: "To verify your email please click on the following button",
        button: {
          color: "#1aae5aff",
          text: "Verify your email",
          link: url
        },
      },
      outro: "Need help, or have question? Just reply to this email, we would love to help."
    }
  }
}

export { sendEmail, emailVerificationContent };