//BudgetControlller______________________________________________________________________________________________________________________________
var budgetController = (function(){

     var Expense = function(id, description,value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome){
      if (totalIncome > 0)
      {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }else{
      this.percentage = -1;
    }
  };



  Expense.prototype.getPercentage = function(){
    return this.percentage;
  }

    var Income = function(id, description,value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var calculateTotal = function(type){
      var sum = 0;
      data.allItems[type].forEach(function(cur){
        sum =sum + cur.value;
      });
      data.totals[type] = sum;
    };

    var data = {
       allItems:{
        exp: [],
        inc: []
      },
      totals:{
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
    };

    return {
      addItem: function(type, des, val){
        var newItem,ID;
        if (data.allItems[type].length>0){
      ID = data.allItems[type][data.allItems[type].length-1].id+1;
    }
    else
    {
      ID=0;
    }
      //Create new item based on 'inc'or 'exp' type
        if (type ==='exp'){
          newItem = new Expense(ID, des, val);
        }else if(type === 'inc'){
          newItem = new Income(ID, des, val);
        }
        //push into our data structure
        data.allItems[type].push(newItem);

        //return the new element
        return newItem;

      },



      deleteItem: function(type, id){
        //id = 3
        //data.allItems[type][id];
        var ids = data.allItems[type].map(del);
        function del(current)
        {
          return current.id;
        }
        var index = ids.indexOf(id);
        if(index !== -1)
        {
          data.allItems[type].splice(index, 1);
        }
      },



        calculateBudget: function(){

        // calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        //Calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        //calculate the percentage of income that we spent
        if(data.totals.inc>0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
      }else {
        data.percentage = -1;
      }



    },

    calculatePercentage: function(){

    // a=20
    // b=10
    // c=40
    // income = 100
    // a=20/100=20%
    // b=40/100=10%
    // c=40/100=40%

    data.allItems.exp.forEach(function (cur)  {

      cur.calcPercentage(data.totals.inc);


  });


  },


  getPercentages: function(){
    var allperc = data.allItems.exp.map(function(cur){
      return cur.getPercentage();
    });
    return allperc;
  },



        getBudget: function(){
        return{
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        };
      },

        testing: function(){
        console.log(data);
      }

    };

; })();



//UIController_______________________________________________________________________________________________________________________________________________________________

var UIController = (function(){

var DOMstrings={
  inputType:'.add__type',
  inputDescription:'.add__description',
  inputValue:'.add__value',
  inputBTN: '.add__btn',
  incomeCountainer:'.income__list',
  expenseCountainer:'.expenses__list',
  budgetLabel:'.budget__value',
  incomeLabel:'.budget__income--value',
  expenseLabel:'.budget__expenses--value',
  percentage:'.budget__expenses--percentage',
  container:'.container',
  expensePercLabel:'.item__percentage',
  dateLabel:'.budget__title--month'
}

var formatNumber=function(num, type){
  var numSplit, int, dec;
/*
 + or - before number
  exactly 2 decimal points
  comma seperating the thousands

  2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
  */

  num = Math.abs(num);
  num = num.toFixed(2);

  numSplit = num.split('.');

  int = numSplit[0];
  if(int.length > 3){
    int = int.substr(0,int.length - 3)+','+int.substr(int.length - 3,int.length);//input 2310, output 2,310
  }

  var nodesListForEach = function(list, callback){
    for (var i = 0 ;i<list.length;i++){
      callback(list[i],i);
    }
  };


  dec = numSplit[1];

return (type === 'exp'?  '-': '+')+''+int +'.'+ dec;

};


return {
     getInput: function(){
     return{
     type : document.querySelector(DOMstrings.inputType).value,
     description : document.querySelector(DOMstrings.inputDescription).value,
     value : parseFloat(document.querySelector(DOMstrings.inputValue).value)

};
},

addListItem: function(obj, type){
var html, newHtml,element;
// Create HTML strings with placeholder text

if(type === 'inc'){

element = DOMstrings.incomeCountainer;
html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}else if(type === 'exp'){

element = DOMstrings.expenseCountainer;
html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
}

//Replace the placeholder text with some actual data
newHtml = html.replace('%id%', obj.id);
newHtml = newHtml.replace('%description%' , obj.description);
newHtml = newHtml.replace('%value%' , formatNumber(obj.value,type));

//Insert the HTML into the DOM
(document.querySelector(element)).insertAdjacentHTML("beforeend",newHtml);
},

deleteListItem: function(selectorID)
 {
  var el = document.getElementById(selectorID);
  el.parentNode.removeChild(el);
},

      clearFields: function(){
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array){
      current.value = "";
    });

    fieldsArr[0].focus();
    },

    displayBudget: function(obj){

      document.querySelector(DOMstrings.budgetLabel).textContent =obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent =obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =obj.totalExp;



      if (obj.percentage > 0){
          document.querySelector(DOMstrings.percentage).textContent =obj.percentage + '%';
      }
      else
      {
          document.querySelector(DOMstrings.percentage).textContent ='---';
      }
    },



    displayPercentages: function(percentages){

        var fields = document.querySelectorAll(DOMstrings.expensePercLabel);

        var nodesListForEach = function(list, callback){
          for (var i = 0 ;i<list.length;i++){
            callback(list[i],i);
          }
        };

        nodesListForEach(fields, function(current, index){
          if(percentages[index] > 0)
          {
         current.textContent = percentages[index] + '%';
       }else {
         current.textContent = '---';
       };
        });

    },

    displayMonth: function(){
      var now,month,months, year;

      now = new Date();
      // var christmas = new date(2016,11,25);
      months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent=months[month+1] +' '+year;
    },

    changedType: function(){
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ','+
        DOMstrings.inputDescription + ','+
        DOMstrings.inputValue
      );

      var nodesListForEach = function(list, callback){
        for (var i = 0 ;i<list.length;i++){
          callback(list[i],i);
        }
      };

      nodesListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');

        document.querySelector(DOMstrings.inputBTN).classList.toggle('red');
      });

    },


    getDOMstrings: function(){
      return DOMstrings;
    }
};
})();

//GlOBAL APP CONTROLLER________________________________________________________________________
var controller = (function(budgetCtrl , UICtrl){

var setupEventListeners = function(){

var DOM = UICtrl.getDOMstrings();

      document.querySelector(DOM.inputBTN).addEventListener('click',ctrlAddItem);



      document.addEventListener('keypress',function(event){
        if(event.keyCode===13||event.which===13){
          ctrlAddItem();
        }
      });

document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
};

var updateBudget = function() {

  //1. Calculate the budget
budgetCtrl.calculateBudget();

  //2.return the budget
var budget = budgetCtrl.getBudget();

  //3. Display the budget on the UI
UICtrl.displayBudget(budget);

};

var updatePercentages = function(){


  // 1. Calculate percentage
budgetCtrl.calculatePercentage();

  // 2. Read percentage from the budget budgetController
var percentages = budgetCtrl.getPercentages();

  // 3. Update the UI with the new percentage
UICtrl.displayPercentages(percentages);

}

var ctrlAddItem =function(){

// 1. Get the field input data
var input = UICtrl.getInput();



if(input.description!== ""&& !isNaN(input.value)&& input.value>0){
//2. Add the item to the budget budgetController
var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

//3. Add the item to the UI
UICtrl.addListItem(newItem , input.type);

//4.clear fields from the screen
UICtrl.clearFields();

//5. Calculate and update budget
  updateBudget();

//6. Calculate and update the updatePercentages
updatePercentages();
}



};


var ctrlDeleteItem = function(event){
  var itemID, splitID, type, ID;

itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);

if(itemID)
{
splitID = itemID.split('-');
type = splitID[0];
ID = parseInt(splitID[1]);



// 1.delete the item from data structure
budgetCtrl.deleteItem(type, ID);

//2. Delete the item from the UI
UICtrl.deleteListItem(itemID);

//3. Update and show the new budget
updateBudget();

//4. Calculate and update the updatePercentages
updatePercentages();

}


};

return{
  init:function(){
    console.log('Application has started.');
    UICtrl.displayMonth();
    UICtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percectage: -1
    });
    setupEventListeners();
  }
  };


})(budgetController,UIController);





 controller.init();
