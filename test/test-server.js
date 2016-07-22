var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                done();
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                done();
            });
    });

    it('should edit an item on put', function(done) {
        Item.findOne({name: 'Broad beans'}, function(err, item) {
            if (err) {
                return;
            }

        chai.request(app)
            .put('/items/'+item.id)
            .send({"name":"Taters"})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Taters');
                done();
            })

        })
    });

    it('should delete an item on delete', function(done) {
        Item.findOne({name:'Peppers'}, function(err, item) {
            if (err) {
                return;
            }

        chai.request(app)
            .delete('/items/'+item.id)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
        })
    });

    it('should return error if item is not present', function(done){
        chai.request(app)
        .delete('/items/000000000000000000000000000000000000000000')
        .end(function(err, res){
            res.should.have.status(400);
            done();
        })
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});
