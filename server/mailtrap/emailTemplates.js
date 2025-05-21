export const INSCRIPTION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Share Your Questionnaire with Clients • [Your Platform]</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
  <div style="max-width: 640px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: #2B5DE3; padding: 28px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
        Your Client Questionnaire Is Ready!
      </h1>
    </div>

    <!-- Content Container -->
    <div style="padding: 32px 28px;">
      <p style="margin: 0 0 20px 0;">Hello {companyName} Team,</p>
      
      <p style="margin: 0 0 16px 0;">Your personalized client questionnaire portal is now live. Share the unique link below with your clients to collect responses efficiently:</p>

      <!-- Dynamic Link Card -->
      <div style="background: #F8FAFF; border-radius: 6px; padding: 18px; margin: 24px 0; text-align: center;">
        <p style="margin: 0; font-weight: 500; color: #2B5DE3;">Your Custom Inscription Link:</p>
        <a href="localhost:5173/{companyId}/{questionnaireId}/inscription" 
           style="display: inline-block; margin: 12px 0; padding: 12px 24px; background: #2B5DE3; color: white; text-decoration: none; border-radius: 4px; font-weight: 600;">
          Access Questionnaire Portal
        </a>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">(Copy link: localhost:5173/{companyId}/{questionnaireId}/inscription)</p>
      </div>

      <!-- Instructions -->
      <div style="margin: 24px 0;">
        <p style="font-weight: 600; margin: 0 0 12px 0;">Next Steps:</p>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Share this link via email, SMS, or client portal</li>
          <li>Track responses in real-time via your dashboard</li>
          <li>Export data anytime as CSV/PDF</li>
        </ol>
      </div>

      <p style="margin: 20px 0 0 0;">Need help optimizing responses? <a href="#" style="color: #2B5DE3; text-decoration: none;">Explore our guide ↗</a></p>
    </div>

    <!-- Footer -->
    <div style="background: #F5F7FA; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
      <p style="margin: 4px 0; color: #666;">This is an automated message from [Your Platform Name]</p>
      <p style="margin: 4px 0; color: #666;">
        Questions? Contact <a href="mailto:support@yourplatform.com" style="color: #2B5DE3; text-decoration: none;">Customer Success Team</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
