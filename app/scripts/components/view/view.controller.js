'use strict';

angular.module('ExpenseWatch')
  .controller('ViewController', function(StorageService) {

    var vm = this;

    vm.expenses = StorageService.getExpenses();

    function calculateMultiBarChartData(chartControl, expenses) {

      var multiBarChartData = [{
        key: 'cash',
        color: '#d62728',
        values: []
      }, {
        key: 'credit',
        color: '#1f77b4',
        values: []
      }];

      expenses.forEach(function(expense) {
        var pos = _.findIndex(multiBarChartData[0].values, {
          attr: chartControl === 'date' ? expense.formattedDate : expense.category
        });
        if (pos === -1) {
          multiBarChartData[0].values.push({
            attr: chartControl === 'date' ? expense.formattedDate : expense.category,
            amount: expense.type === multiBarChartData[0].key ? expense.amount : 0
          });
          multiBarChartData[1].values.push({
            attr: chartControl === 'date' ? expense.formattedDate : expense.category,
            amount: expense.type === multiBarChartData[1].key ? expense.amount : 0
          });
        } else {
          multiBarChartData[0].values[pos].amount += (expense.type === multiBarChartData[0].key ? expense.amount : 0);
          multiBarChartData[1].values[pos].amount += (expense.type === multiBarChartData[1].key ? expense.amount : 0);
        }
      });
      return multiBarChartData;
    }

    function getMultiBarChartHeight(chartControl, expenses) {
      var dateChartData = calculateMultiBarChartData('date', expenses);
      var categoryChartData = calculateMultiBarChartData('category', expenses);

      if (dateChartData[0].values.length > categoryChartData[0].values.length) {
        return dateChartData[0].values.length * 60;
      } else {
        return categoryChartData[0].values.length * 60;
      }
    }


    function getMultiBarChartOptions() {
      var multiBarChartOptions = {
        chart: {
          margin: {
            left: Math.floor(document.getElementById('chartContainer').clientWidth / 4)
          },
          type: 'multiBarHorizontalChart',
          height: getMultiBarChartHeight(vm.multiBarChartControl, vm.expenses),
          x: function(d) {
            return d.attr;
          },
          y: function(d) {
            return d.amount;
          },
          stacked: false,
          showControls: false,
          showValues: true,
          duration: 500,
          xAxis: {
            showMaxMin: false
          },
          yAxis: {
            axisLabel: 'Amount'
          }
        }
      };

      return multiBarChartOptions;
    }


    vm.multiBarChartControl = 'date';
    vm.multiBarChartData = calculateMultiBarChartData(vm.multiBarChartControl, vm.expenses);
    vm.multiBarChartOptions = getMultiBarChartOptions();

    vm.setMultibarChartControl = function(control) {
      vm.multiBarChartControl = control;
      vm.multiBarChartData = calculateMultiBarChartData(vm.multiBarChartControl,vm.expenses);
    };

  });
