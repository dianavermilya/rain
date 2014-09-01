'use strict';

var PriorityQueue = require('priorityqueuejs');
var math = require('mathjs');
var _ = require('underscore');

module.exports = function(System, app, auth, database) {

  app.route('/api/rain')
    .get(function(req, res) {
      var rows = 10;
      var cols = 8;

      var grid = math.zeros(rows, cols);

      var random;
      grid.forEach(function (value, index, matrix) {
        random = Math.floor(Math.random()*10);
        matrix.set(index, random);
      });
      var oldGrid = math.matrix(grid);

      var q = new PriorityQueue(function(a, b) {
        return b.el - a.el;
      });

      var qed = math.zeros(rows, cols);
      qed.forEach(function (value, index, matrix) {
        if (index[0] === 0 || index[0] === rows-1 || index[1] === 0 || index[1] === cols-1) {
          matrix.set(index, 1);
          q.enq({
            el : grid.get(index),
            index : JSON.parse(JSON.stringify(index))
          });
        }
      });

      var water = 0;
      var smallest;

      var step = function (smallest) {
        var el = smallest.el;
        var l = smallest.index;

        var neighbors = [[l[0],l[1]-1], [l[0],l[1]+1], [l[0]-1,l[1]], [l[0]+1,l[1]]];
        neighbors = neighbors.filter(function(n) {
          return n[0] < rows && n[0] >=0 && n[1] < cols && n[1] >= 0;
        });
        neighbors = neighbors.filter(function(n) {
          return !qed.get(n);
        });

        _.forEach(neighbors, function(n) {
          if (grid.get(n) < el) {
            water+= (el-grid.get(n));
            grid.set(n, el);
          }
          q.enq({
            el : grid.get(n),
            index : JSON.parse(JSON.stringify(n))
          });
          qed.set(n,1); 
        });
      };

      while (!q.isEmpty()) {
        smallest = q.deq();
        step(smallest, grid, q, qed);
      }

      var i;
      var j;

      var gridJSON = {};
      for (i=0; i<rows; i+=1) {
        gridJSON[i] = {};
        for (j=0;j<cols;j+=1){
          gridJSON[i][j] = {
            oldElv: oldGrid.get([i,j]),
            newElv: grid.get([i,j]),
            water: (oldGrid.get([i,j]) === grid.get([i,j])) ? '':'water'
          };
        }
      }
   
      var items = [{
        grid: gridJSON,
        water: water
      }];

      res.json(items);
    });
};
