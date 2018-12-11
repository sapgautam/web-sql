sp.controller('productCtl', function ($scope, $http, $window, $location, myService, $rootScope, fileReader, $uibModal) {
  $scope.userData = {
    p_name: '',
    p_hsn: '',
    p_price: '',
  }
  $scope.productArray = []
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  $scope.nginit = function () {

    console.log('in ngoninit')

    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTS (p_name,p_hsn,p_price)');
      tx.executeSql('SELECT * FROM PRODUCTS', [], function (tx, results) {
        console.log(results.rows)
        var len = results.rows.length
        // for (let index = 0; index < len; index++) {  
        //   console.log( results.rows['index'])
        // }

        $scope.productArray = [] = results.rows
        console.log('this is console', typeof ($scope.productArray))
      });
    });
  }



  $scope.edit = function (data) {
    console.log('edit')
    console.log(data)
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM PRODUCTS WHERE rowid = ?', [data + 1], function (tx, results) {
        console.log('select', results.rows)
        var userData = results.rows[0]
        console.log(userData)
        $uibModal.open({
          templateUrl: 'productModal.html',
          controller: function ($scope, $uibModalInstance) {
            $scope.userData = userData
            $scope.ok = function () {
              console.log('In edit')
              $scope.userData = {
                p_name: $scope.myForm.p_name.$viewValue,
                p_hsn: $scope.myForm.p_hsn.$viewValue,
                p_price: $scope.myForm.p_price.$viewValue,
              }
              $uibModalInstance.dismiss('cancel');

              db.transaction(function (tx) {
                //tx.executeSql('INSERT INTO PRODUCTS (product, hsn, price) VALUES ("tada","data","tada")');
                //tx.executeSql('INSERT INTO PRODUCTS (product,hsn,price) VALUES (?,?,?)', [$scope.userData.p_name, $scope.userData.p_hsn, $scope.userData.p_price]);
                tx.executeSql('UPDATE PRODUCTS SET p_name=? ,p_hsn=? ,p_price=? WHERE rowid=?', [$scope.userData.p_name, $scope.userData.p_hsn, $scope.userData.p_price, data + 1]);
                console.log("values inserted ");
              })
            }
            $scope.cancel = function () {
              console.log('working')
              $uibModalInstance.dismiss('cancel');
            };
          }
        })
      });

    })
  }

  $scope.delete = function (data) {
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM PRODUCTS WHERE rowid = ?', [data + 1]);
      console.log('deleted')
    });
  }

  $scope.openModal = function () {
    // console.log('working')
    $uibModal.open({
      templateUrl: 'productModal.html',
      controller: function ($scope, $uibModalInstance) {

        $scope.ok = function () {
          console.log('working')
          $scope.userData = {
            p_name: $scope.myForm.p_name.$viewValue,
            p_hsn: $scope.myForm.p_hsn.$viewValue,
            p_price: $scope.myForm.p_price.$viewValue,
          }
          $uibModalInstance.dismiss('cancel');

          db.transaction(function (tx) {
            //tx.executeSql('INSERT INTO PRODUCTS (product, hsn, price) VALUES ("tada","data","tada")');
            tx.executeSql('INSERT INTO PRODUCTS (p_name,p_hsn,p_price) VALUES (?,?,?)', [$scope.userData.p_name, $scope.userData.p_hsn, $scope.userData.p_price]);

            console.log("values inserted ");

          })
        }
        $scope.cancel = function () {
          console.log('working')
          $uibModalInstance.dismiss('cancel');
        };
      }
    })
  }

})
