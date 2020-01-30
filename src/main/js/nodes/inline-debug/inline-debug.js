const util = require('util');

module.exports = function(RED)
{
   // 'use strict';
   function InlineDebugNode(nodeParam)
   {
      this.formLogMessage = function(msg)
      {
         let toLogAsJson = {};
         if (this.complete === true)
         {
            toLogAsJson = Object.assign({}, msg);
         }
         else
         {
            if (this.payloadOnly === true)
            {
               toLogAsJson = { 'payload': msg.payload };
            }
            else
            {
               if (this.titleOnly === true)
               {
                  toLogAsJson = { 'nodeName': this.name };
               }
            }
         }
         if (this.logContext === true)
         {
            const tmp =
            {
               'msg': toLogAsJson,
               'context': this.context()
            };
            toLogAsJson = tmp;
         }
         if (typeof this.additionalText !== 'undefined' && this.additionalText !== '')
         {
            toLogAsJson.text = this.additionalText;
         }
         return toLogAsJson;
      };
      RED.nodes.createNode(this, nodeParam);
      this.name = nodeParam.name;
      this.level = nodeParam.level;
      this.console = typeof nodeParam.console !== 'undefined' && nodeParam.console !== 'false';
      this.tosidebar = typeof nodeParam.tosidebar !== 'undefined' && nodeParam.tosidebar !== 'false';
      this.complete = nodeParam.complete === 'message';
      this.payloadOnly = nodeParam.complete === 'payload';
      this.titleOnly = nodeParam.complete === 'title';
      this.logContext = nodeParam.logcontext !== 'false';
      this.additionalText = nodeParam.additionaltext;
      const outer = this;
      outer.on('input', function(incomingMessage)
      {
         const msg = JSON.parse(JSON.stringify(incomingMessage));
         if (outer.level !== 'none')
         {
            if (outer.console === true)
            {
               const tmp = outer.formLogMessage(msg);
               const toLog = util.inspect(tmp, { 'showHidden': false, 'depth': null }); // JSON.stringify(tmp, null, 3);
               switch (outer.level)
               {
               case 'error':
               {
                  outer.error(toLog);
                  break;
               }
               case 'warning':
               {
                  outer.warn(toLog);
                  break;
               }
               case 'info':
               {
                  outer.log(toLog);
                  break;
               }
               case 'debug':
               {
                  outer.debug(toLog);
                  break;
               }
               case 'trace':
               {
                  outer.trace(toLog);
                  break;
               }
               default:
               {
                  outer.error(toLog);
                  break;
               }
               }
            }
            if (outer.tosidebar === true)
            {
               const toLog = outer.formLogMessage(msg);
               RED.comms.publish(
                  'debug',
                  {
                     'id': outer.id,
                     'name': outer.name,
                     'topic': msg.topic,
                     'msg': toLog
                  }
               );
            }
         }
         outer.send(incomingMessage);
      });
   }
   RED.nodes.registerType('inline-debug', InlineDebugNode);
};
