const Comment=require('../models/comment');
const Post=require('../models/post')

module.exports.create=function(req,res)
{
    Post.findById(req.body.post,function(err,post)
    {
        if(err)
        {
            console.log('error in finding the post')
        }
        if(post)
        {
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            },function(err,comment)
            {
                if(err)
                {
                    console.log('error in creating comment')
                }
                //first we do updation so save it after every update
                post.comments.push(comment);
                post.save();
                res.redirect('/');
            })
        }

    })
}
module.exports.destroy=function(req,res)
{
    Comment.findById(req.params.id,function(err,comment)
    {
        if(err)
        {
            console.log('enable to find id');
        }
        if(comment)
        {
                let postId=comment.post;
                comment.remove();//before removing we have to remove comment in post otherwisw we have no trace of comments in post

                Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post)
                {
                    if(err)
                    {
                        console.log('error in finding comment')
                    }
                    res.redirect('back');
                });

            
        }
    })
}