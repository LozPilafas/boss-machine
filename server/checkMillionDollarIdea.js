const checkMillionDollarIdea = (req,res,next) => {

    const weeks=Number(req.body.numWeeks)
    const revenue=Number(req. body.weeklyRevenue)

    if(weeks*revenue>=1000000 
        && weeks 
        && revenue
        && typeof(weeks)==='number'
        && typeof(revenue==='number'))
    {
        next()
    }
    else
    {
        let err=new Error('not worth the money')
        err.status=400
        next(err)
    }


};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
