const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){

                if(err){
                req.flash('error', err);
                return res.redirect("back");
                }


                post.comments.push(comment);
                post.save();

                req.flash('success','comment succesfull');
                return res.redirect('back');
            });
        }
    });
}

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        if(comment.user == req.user.id){

            let postId = comment.post;
            
            comment.remove();

            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err, post){
                req.flash('success',' comment deleted Succesfully');
                return res.redirect('back');
            })
        }
        else{
            req.flash('error',err);
            return res.redirect('back');
        }
    })
}