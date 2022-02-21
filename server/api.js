const express = require('express');
const { tr } = require('faker/lib/locales');
const app = require('../server.js');
const apiRouter = express.Router();
const minionsRouter=express.Router()
const ideasRouter=express.Router()
const meetingsRouter=express.Router()
const workRouter=express.Router({mergeParams:true})
const morgan=require('morgan')
const {getAllFromDatabase,addToDatabase,getFromDatabaseById,updateInstanceInDatabase, deleteFromDatabasebyId,createMeeting,deleteAllFromDatabase} =require('./db.js')



//MINIONS MIDDLEWARE
minionsRouter.use(morgan('tiny'))

minionsRouter.param('minionId',(req,res,next,id)=>
{

    const selectedMinion=getFromDatabaseById('minions',id)
    
    if(selectedMinion!==undefined)
    {
        
      
        
        next()
        

    }
    else
    {
        let err=new Error('minion not found')
        err.status=404

    next(err)
    }
})

//IDEAS MIDDLEWARE
ideasRouter.param('ideaId',(req,res,next,id)=>
{
    const selectedIdea=getFromDatabaseById('ideas',id)
    
    if(selectedIdea!==undefined)
    {
        
      
        
        next()
        

    }
    else
    {
        let err=new Error('idea not found')
        err.status=404
    next(err)
    }

})


//universal data checked

const checkData=(req,res,next)=> 
{
    const base=req.baseUrl
    const newItem=req.body

    switch (base) {
    
       case  "/api/minions" :
           {
               
               if(
                   Object.getOwnPropertyNames(newItem).sort().join(",")===['id','name','title','salary','weaknesses'].sort().join(",") || Object.getOwnPropertyNames(newItem).sort().join(",")===['name','title','salary','weaknesses'].sort().join(",")
                    && typeof(newItem.id)==='string' || typeof(newItem.id)==='undefined'
                    && typeof(newItem.weaknesses)==='string'
                    && typeof(newItem.name)==='string'
                    && typeof(newItem.title)==='string'
                    && typeof(newItem.salary)==='string' || typeof(newItem.salary)==='number' 
                    && !isNaN(Number(newItem.salary))
                 
                )
               {
                 
                   req.body=newItem
                   next()
                    

               }
               else
               {
                   next(new Error('there was an issue with the data supplied. Make sure they match the schema'))
               }
               
               
           }

        case "/api/ideas":
            {
                
                
                if(
                    Object.getOwnPropertyNames(newItem).sort().join(",")===['name','description','numWeeks','weeklyRevenue'].sort().join(",") 
                     
                     && typeof(newItem.name)==='string'
                     && typeof(newItem.description)==='string'
                     && typeof(newItem.numWeeks)==='string' || typeof(newItem.numWeeks)==='number'
                     && !isNaN(Number(newItem.numWeeks))
                     && typeof(newItem.weeklyRevenue)==='string' || typeof(newItem.weeklyRevenue)==='number'
                     && !isNaN(Number(newItem.weeklyRevenue))
                     
                 )
                {
                    req.body=newItem
                    next()
                     
 
                }
                else
                {
                    next(new Error('there was an issue with the data supplied. Make sure they match the schema'))
                }

            }
           

    }
        

        
    
    next()
}



//MINIONS ROUTER


minionsRouter.get('/',(req,res,next)=>
{
    
    res.send(getAllFromDatabase('minions'))
})

minionsRouter.post('/',checkData,(req,res,next)=>
{
   
       res.status(201).send(addToDatabase('minions',req.body))
       
   
})

minionsRouter.get("/:minionId",(req,res,next)=>
{
    
    res.send(getFromDatabaseById('minions',req.params.minionId))
   

})

minionsRouter.put("/:minionId",checkData,(req,res,next)=>
{
  
    
   res.send(updateInstanceInDatabase("minions",req.body))
    
  

})

minionsRouter.delete('/:minionId',(req,res,next)=>
{
    if(deleteFromDatabasebyId('minions',req.params.minionId))
    {
        res.status(204).send('Minion deleted')
    }
    else{
        res.status(500).send('Minion could not be found - process aborted')
    }
})





//IDEAS ROUTER
ideasRouter.get('/',(req,res,next)=>
{
    res.send(getAllFromDatabase('ideas'))
})

ideasRouter.post('/',checkData,(req,res,next)=>
{
    
    

    
    res.status(201).send(addToDatabase('ideas',req.body))
    
        
    

})

ideasRouter.get('/:ideaId',(req,res,next)=>
{
    res.send(getFromDatabaseById('ideas',req.params.ideaId))
})

ideasRouter.put('/:ideaId',(req,res,nexr)=>
{
    res.send(updateInstanceInDatabase('ideas',req.body))
})

ideasRouter.delete('/:ideaId',(req,res,next)=>
{
    res.status(204).send(deleteFromDatabasebyId('ideas',req.params.ideaId))
})



//MEETINGS ROUTER
meetingsRouter.get('/',(req,res,next)=>
{
    res.send(getAllFromDatabase('meetings'))
})

meetingsRouter.post("/",(req,res,next)=>
{
    res.status(201).send(createMeeting())

})

meetingsRouter.delete("/",(req,res,next)=>
{
    res.status(204).send(deleteAllFromDatabase('meetings'))

})


//WORK ROUTERS

workRouter.get('/',(req,res,next)=>
{
    res.send([{
        id:1,
        title:"2323",
        description:"23123",
        hours:12,
        minionId:"1"
    }])

   
})

//ERROR HANDLING 

app.use((err,req,res,next)=>
{
    
    res.status(err.status).send("something went wrong" )
})


module.exports = {apiRouter,minionsRouter,ideasRouter,meetingsRouter,workRouter}

