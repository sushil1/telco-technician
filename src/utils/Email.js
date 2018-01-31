// const axios = require('axios')
//
//
// console.log(process)
//
// const MAILCHIMP_URL = `https://us17.api.mailchimp.com/3.0/lists/e3b1122177/members/`
//
// export function sendEmail(email, name){
//   console.log(email)
//   axios.post(MAILCHIMP_URL)
//     .set('Content-Type', 'application/json')
//     .set('Authorization', `Basic ${new Buffer( '1a4f6d07dafed9e274ea08d1968b8028-us17').toString('base64')}`)
//     .send({
//       'email_address' : email,
//       'status':'subscribed',
//       'FNAME': name
//     })
//
//     .end(function(err, response) {
//       if(err){
//         console.log(err)
//       }
//              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
//                res.send('Signed Up!');
//              } else {
//                res.send('Sign Up Failed :(');
//              }
//          });
// }
