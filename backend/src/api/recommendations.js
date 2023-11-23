const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/getRecommendations', (req, res) => {
    axios.post('http://127.0.0.1:5000/recommend', {
        user_id: req.body.user_id
    })
    .then(function (response) {
        res.send(response.data);
    })
    .catch(function (error) {
        console.error(error);
        res.status(500).send(error);
    });
});


router.post('/getCollaborative', (req, res) => {
    axios.post('http://127.0.0.1:5000/collaborativeRecommend', {
        user_id: req.body.user_id
    })
    .then(function (response) {
        res.send(response.data);
    })
    .catch(function (error) {
        console.error(error);
        res.status(500).send(error);
    });
});

router.post('/getClusterings', (req, res) => {
    axios.post('http://127.0.0.1:5000/clusteringRecommendation', {
        user_id: req.body.user_id
    })
    .then(function (response) {
        res.send(response.data);
    })
    .catch(function (error) {
        console.error(error);
        res.status(500).send(error);
    });
});


module.exports = router;
