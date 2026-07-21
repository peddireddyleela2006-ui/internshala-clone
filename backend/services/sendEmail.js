const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


const sendEmail = async ({ to, subject, html }) => {
  try {

    const response = await resend.emails.send({
      from: "Internshala Clone <onboarding@resend.dev>",
      to,
      subject,
      html,
    });


    if (response.error) {
      console.error("Resend API Error:", response.error);
      throw new Error(response.error.message);
    }


    console.log("Resend Success:", response);

    return response;


  } catch (error) {

    console.error("Resend Error:", error.message);

    throw error;

  }
};


module.exports = sendEmail;