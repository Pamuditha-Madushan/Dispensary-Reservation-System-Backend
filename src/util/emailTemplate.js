const passwordResetEmailTemplate = (email, displayName, link, appName) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset="UTF-8">
  <title>Reset password for ${appName}</title>
</head>
  <p>Hello ${displayName},</p>
  <p>Follow this link to reset your ${appName} password for your ${email} account:</p>
  <p><a href="${link}">${link}</a></p>
  <p>If you didn’t ask to reset your password, you can ignore this email.</p>
  <p>Thanks,</p>
  <p>${appName} support team</p>
   <style>
          body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
}
p {
    color: #333;
    line-height: 1.5;
}
a {
    color: #007BFF; /* Bootstrap primary color */
    text-decoration: none; /* Remove underline */
}
a:hover {
    text-decoration: underline; /* Underline on hover */
}
.container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
   </style>
</body>
</html>
    `;
};

const verificationEmailTemplate = (displayName, link, appName) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset="UTF-8">
  <title>Verify your email for ${appName}</title>
</head>
<body>
  <p>Hello ${displayName},</p>
  <p>Follow this link to verify your email address:</p>
  <p><a href="${link}">${link}</a></p>
  <p>If you didn’t ask to verify this address, you can ignore this email.</p>
  <p>Thanks,</p>
  <p>${appName} support team</p>
   <style>
    body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
}
p {
    color: #333;
    line-height: 1.5;
}
a {
    color: #007BFF; /* Bootstrap primary color */
    text-decoration: none; /* Remove underline */
}
a:hover {
    text-decoration: underline; 
}
.container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
   </style>
</body>
</html>
    `;
};

export { passwordResetEmailTemplate, verificationEmailTemplate };
