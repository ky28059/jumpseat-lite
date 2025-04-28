export const templatePersonal = 
`<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <title>Jumpseat Alert</title>
</head>
<body style="font-family: sans-serif">
   <div
      style="
      border: 1px solid black;
      border-radius: 15px;
      width: 600px;
      margin: 0 auto;
      "
      >
      <div
         style="
         background-color: #007bff;
         color: white;
         text-align: center;
         padding: 10px 0;
         border-radius: 13px 13px 0 0;
         border-bottom: 1px solid black;
         "
         >
         <h2 style="margin: 0; color: white;">Jumpseat</h2>
      </div>
      <div style="padding: 20px">
         <p style="text-align: left; margin: 15px 0 10px 0">Hi,</p>
         <div
            style="
            border: 1px solid rgba(0, 207, 7, 0.5);
            border-radius: 10px;
            padding: 10px;
            margin: 10px 0;
            "
            >
            <p style="font-family: monospace; text-align: left">
               Click the button below to confirm your personal email.
            </p>
         </div>

         <div
            style="
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 10px;
            align-items: center;
            "
            >
            <a
               href="{{ verification_link }}"
               style="
               background-color: #007bff;
               color: white;
               text-align: center;
               border: none;
               border-radius: 5px;
               padding: 20px;
               width: 48%;
               font-weight: bold;
               text-decoration: none;
               "
               >
               Confirm email
            </a>
            <a
               href="https://google.com"
               style="
               text-decoration: underline;
               color: black;
               text-align: center;
               padding: 10px;
               width: 48%;
               display: block;
               line-height: 40px;
               "
               >Sign up for Autopilot!</a
               >
         </div>
      </div>
   </div>
   <div
      style="
      width: 600px;
      text-align: center;
      margin: 0 auto;
      "
      >
      <div style="line-height: 0.5">
         <h2 style="color: #3b82f6">Jumpseat</h2>
         <p>Campus Ventures, LLC</p>
      </div>
      <p>
         You received this email because you added a personal email to Jumpseat.
      </p>
      <p>
         <a href="https://google.com" style="text-decoration: none; color: #3b82f6"
            >Jumpseat site</a
            >
         |
         <a href="https://google.com" style="text-decoration: none; color: #3b82f6"
            >Unsubscribe</a
            >
      </p>
   </div>
</body>
</html>`;

