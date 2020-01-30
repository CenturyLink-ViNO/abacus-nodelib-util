const jwt = require('jsonwebtoken');

module.exports = function(RED)
{
   function UserHasRoleNode(config)
   {
      RED.nodes.createNode(this, config);
      const outer = this;
      outer.on('input', function(msg)
      {
         let ret = [msg, null];
         const token = msg.token;
         if (typeof token !== 'undefined' && token !== null && token !== '')
         {
            const requestedRoles = msg.requestedRoles;
            if (typeof requestedRoles !== 'undefined' && requestedRoles !== null && Array.isArray(requestedRoles))
            {
               try
               {
                  msg.decodedToken = jwt.decode(token, { 'complete': true, 'json': true });
                  msg.roles = msg.decodedToken.payload.realm_access.roles;
                  if (requestedRoles.some((role) =>
                  {
                     const hasRole = msg.roles.indexOf(role) >= 0;
                     return hasRole;
                  }))
                  {
                     ret = [null, msg];
                  }
               }
               catch (exc)
               {
                  console.error('invalid token: ' + exc);
                  delete msg.decodedToken;
                  msg.error = exc;
               }
            }
            else
            {
               msg.error = 'missing requestedRoles array';
            }
         }
         else
         {
            msg.error = 'missing token';
         }
         outer.send(ret);
      });
   }
   RED.nodes.registerType('user-has-role', UserHasRoleNode);
};
