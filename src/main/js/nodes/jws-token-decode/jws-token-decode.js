const jwt = require('jsonwebtoken');

module.exports = function(RED)
{
   // var testToken =
   // "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4bHA0WWl4OWo0bEotNFoyQThoaUdTSmt5MHhVbE5NekFnUGJkQmQteEJB" +
   // "In0.eyJqdGkiOiIxNTQ4N2E0MS1hN2VlLTRhZmUtODA1Ni00Yjg4NTVlNWZjMDUiLCJleHAiOjE1NDg4ODczNjgsIm5iZiI6MCwiaWF0Ijox" +
   // "NTQ4ODg3MDY4LCJpc3MiOiJodHRwczovLzE3Mi4yMi4zLjUwL2F1dGgvcmVhbG1zL2VsdmlyYSIsImF1ZCI6ImVsdmlyYS1hcGkiLCJzdWIi" +
   // "OiIyOGRmNmQ5NC04ZDJjLTQxYzEtODEwNS02MTNmYzE5MDJkYjQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJlbHZpcmEtYXBpIiwibm9uY2Ui" +
   // "OiIwMjk2MjUwZS1jNzVmLTQ3NTQtYWFjNS0zMmExZWRiYjhmM2EiLCJhdXRoX3RpbWUiOjE1NDg4ODcwNjcsInNlc3Npb25fc3RhdGUiOiIz" +
   // "NWVmZTA1Yy1kYzhiLTQxMzYtOTA5Yy1mY2NjZjQ3NWIxZDkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNz" +
   // "Ijp7InJvbGVzIjpbIm9wZXJhdGlvbnMiLCJvZmZsaW5lX2FjY2VzcyIsImFkbWluIiwicHJvdmlzaW9uaW5nIiwidW1hX2F1dGhvcml6YXRp" +
   // "b24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2Nv" +
   // "dW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVl" +
   // "LCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbmlzdHJhdGlvbiJ9.kkOIymvL2DCGO3tKHrn3Yqftm3Y8H8R_hr4oNBi3QDgmGg0hJpAGDft" +
   // "BmJtz_PMn4DgL5SlrhuqhzgPbU9QJ0b41i6MhHeU5TB5zrfw7CYSDvlBcM84hLZXsS0MW3mVsVBhpQPM-ZhPZF3cEetTLRriARvOINuixqPf" +
   // "dkjxy44bWWDarnM2v3QgBfsQ4hWZdFYEAVlm0PD5zxEr81uzSKxBdsmYenY1_pz-7BYwpjEi8Ff5mUdbVDSXlUhnYfxE5Lut4h9tjPYimY7M" +
   // "TiAtuTdMs0cENtjV7JDW778SuHHGDXmWys2q0oJVuL3B3b-n-rDbqap8d8YCXZGE5IkrdAQ";
   // var jwt = require('jsonwebtoken');
   // var obj = jwt.decode(token, {complete: true, json: true} );
   // console.log(JSON.stringify(obj, null, 3));

   function JwsTokenDecodeNode(config)
   {
      RED.nodes.createNode(this, config);
      const outer = this;
      outer.on('input', function(msg)
      {
         const token = msg.token;
         if (typeof token !== 'undefined' && token !== null && token !== '')
         {
            try
            {
               msg.decodedToken = jwt.decode(token, { 'complete': true, 'json': true });
            }
            catch (exc)
            {
               console.error('invalid token: ' + exc);
               delete msg.decodedToken;
               msg.error = exc;
            }
         }
         outer.send(msg);
      });
   }
   RED.nodes.registerType('jws-token-decode', JwsTokenDecodeNode);
};
