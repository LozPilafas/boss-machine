const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors=require('cors')
const path=require('path')
module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
app.use(cors())


// Add middware for parsing request bodies here:
app.use( bodyParser.json())
// Mount your existing apiRouter below at the '/api' path.
const {apiRouter,minionsRouter,ideasRouter,meetingsRouter, workRouter} = require('./server/api');



app.use('/api/',apiRouter)
apiRouter.use('/minions',minionsRouter)

minionsRouter.use('/:minionId/work',workRouter)
apiRouter.use('/ideas',ideasRouter)
apiRouter.use('/meetings',meetingsRouter)

app.use(express.static('public'));

app.use('/public', express.static(__dirname + '/public'));

app.get('/',(req,res,next)=>
{
  res.sendFile(path.join(__dirname+'/index.html'));
})


// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
  app.listen(PORT,()=>{console.log(`Listening at localhost @ port : ${PORT}`)})

}
