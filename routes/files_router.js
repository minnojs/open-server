const express     = require('express');
const files        = require('../files');
const experiments        = require('../experiments');

const filesRouter = express.Router();

module.exports = filesRouter;

filesRouter
    .use(function is_logged_in(req, res, next){
        if (!req.session || !req.session.user) return res.status(403).json({message: 'ERROR: Permission denied!'});
        req.user_id = req.session.user.id;
        next();
    });

filesRouter.route('/:study_id').get(
    function(req, res){
        files.get_study_files(req.user_id, parseInt(req.params.study_id))
             .then(response => res.json(response))
             .catch(function(err){
                res.status(err.status || 500).json({message:err.message});
             });
    })
    .delete(
        function(req, res){
            files.delete_files(req.user_id, parseInt(req.params.study_id), req.body.files)
            .then(response => res.json(response))
            .catch(function(err){
                res.status(err.status || 500).json({message:err.message});
            });

        })
    .post(
        function(req, res){
            files.download_files(req.user_id, parseInt(req.params.study_id), req.body.files, res);
        });

filesRouter.route('/:study_id/upload/')
    .post(
        function(req, res){
            return files.upload(req.user_id, parseInt(req.params.study_id), req, res);
        });


filesRouter.route('/:study_id/upload/:folder_id')
    .post(
        function(req, res){
            return files.upload(req.user_id, parseInt(req.params.study_id), req, res);
        });

filesRouter.route('/:study_id/file/')
    .post(
        function(req, res){
            if(req.body.isDir)
                return files.create_folder(req.user_id, parseInt(req.params.study_id), req.body.name)
                    .then(tags_data=>res.json(tags_data))
                    .catch(err=>res.status(err.status || 500).json({message:err.message}));
            return files.update_file(req.user_id, parseInt(req.params.study_id), req.body.name, req.body.content)
                .then(tags_data=>res.json(tags_data))
                .catch(err=>res.status(err.status || 500).json({message:err.message}));

        });

filesRouter.route('/:study_id/file/:file_id')
    .get(
        function(req, res){
            return files.get_file_content(req.user_id, parseInt(req.params.study_id), req.params.file_id)
                .then(tags_data=>res.json(tags_data))
                .catch(err=>res.status(err.status || 500).json({message:err.message}));
        })
    .put(
        function(req, res){
            return files.update_file(req.user_id, parseInt(req.params.study_id), req.params.file_id, req.body.content)
                .then(tags_data=>res.json(tags_data))
                .catch(err=>res.status(err.status || 500).json({message:err.message}));

        });

filesRouter.route('/:study_id/file/:file_id/move')
    .put(
        function(req, res){
            return files.rename_file(req.user_id, parseInt(req.params.study_id), req.params.file_id, req.body.path)
                .then(tags_data=>res.json(tags_data))
                .catch(err=>res.status(err.status || 500).json({message:err.message}));

        });

filesRouter.route('/:study_id/file/:file_id/copy')
    .put(
        function(req, res){
            return files.copy_file(req.user_id, parseInt(req.params.study_id), req.params.file_id, parseInt(req.body.new_study_id))
                .then(tags_data=>res.json(tags_data))
                .catch(err=>res.status(err.status || 500).json({message:err.message}));
        });

filesRouter.route('/:study_id/file/:file_id/experiment')
    .post(
        function(req, res){
            return experiments.insert_new_experiment(req.user_id, parseInt(req.params.study_id), req.params.file_id, req.body.descriptive_id, res);
        })

    .delete(
        function(req, res){
            return experiments.delete_experiment(req.user_id, parseInt(req.params.study_id), req.params.file_id, res);
        })
    .put(
        function(req, res){
            return experiments.update_descriptive_id(req.user_id, parseInt(req.params.study_id), req.params.file_id, req.body.descriptive_id, res);
        });
