'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/*
// Data of Chapter11
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
*/

/////////////////////////////////////////////////
// Data of Chapter 12
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Aime Yan',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-09-15T17:01:17.194Z',
    '2024-09-20T10:36:17.929Z',
    '2024-09-21T10:51:36.790Z',
  ],
  currency: 'CNY',
  locale: 'zh-CN', // de-DE
};

const account2 = {
  owner: 'Amie Wang',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-09-15T14:43:26.374Z',
    '2024-09-19T18:49:59.371Z',
    '2024-09-20T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

///////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Function用国际标准计算时间显示方式
const formatMovmentsDate = function (date, locale) {
  const calDatesPassed = Math.round(
    Math.abs(new Date() - date) / (1000 * 60 * 60 * 24)
  ); //将时间从毫秒数字转化成天

  if (calDatesPassed === 0) return 'TODAY';
  if (calDatesPassed === 1) return 'YESTODAY';
  if (calDatesPassed <= 7) return `${calDatesPassed} DAYS AGO`;

  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${year}/${month}/${day}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Function用国际标准计算货币显示方式
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Creating DOM Elements: displayMovments
// 写一个函数，将一个数组中的元素呈现到HTML网页上，并给每一个元素生成一行
const displayMovments = function (account, sort = false) {
  // 先清空现有的html内容，类似于 .textCotent = 0
  containerMovements.innerHTML = '';
  //如果sort为true，就将movements复制一下并按照升序排序，如果是false（设置的默认），就按常规排序
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // 2024/09/21
    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovmentsDate(date, account.locale);
    const formatMov = formatCur(mov, account.locale, account.currency);
    const html = `
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatMov}¥</div>
        </div>
    `;
    // 将新的html按照最新的顺序插入到 containerMovements 中
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovments(account1.movements);

///////////////////////////
// displayBalance:reduce（）
const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};
// displayBalance(account1.movements);

///////////////////////////
// displaySummary: income && outcom && interest
const diplaySummary = function (account) {
  // income
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${income.toFixed(2)} ¥`;
  labelSumIn.textContent = formatCur(income, account.locale, account.currency);

  // outcome
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  // labelSumOut.textContent = `${outcome.toFixed(2)} ¥`;
  labelSumOut.textContent = formatCur(
    outcome,
    account.locale,
    account.currency
  );

  // interest
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposite => deposite * (account.interestRate / 100))
    .filter(inte => {
      // console.log(arr);
      return inte >= 1;
    })
    .reduce((acc, inte) => acc + inte, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)} ¥`;
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

// diplaySummary(account1);

/////////////////////////////////
// creatUsername
const creatUsername = function (accs) {
  accs.forEach(function (acc) {
    //循环遍历大的数组accs
    acc.username = acc.owner //给大数组中的的每一个object：acc里添加新的属性叫username
      .toLowerCase() //全小写
      .split(' ') //这里是用split将字符串拆开，然后生成了一个新的数组
      .map(user => user[0]) //上面的数组直接调用map函数，返回每一个元素的首字母并放进新的数组中
      .join(''); //将上面的数组结合成一个新的字符串
  });
};
creatUsername(accounts);
//////////////////////////////
// 更新界面显示
const updateUI = function (acc) {
  // display movments
  displayMovments(acc);
  // display balance
  displayBalance(acc);
  // display summary
  diplaySummary(acc);
};
///////////////////////////
// countDownTimer倒计时器
const countdownLogout = function () {
  let totalTime = 300;
  // 设置显示初始函数
  const tick = function () {
    // 先设置计时器显示
    const min = String(Math.trunc(totalTime / 60)).padStart(2, 0);
    const sec = String(totalTime % 60).padStart(2, 0);
    // 每一次刷新都将剩余时间打印在页面上
    labelTimer.textContent = `${min}:${sec}`;
    // 当时间为0时，退出登录
    if (totalTime === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    // 总时间减1秒
    totalTime--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////
//Login
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //阻止浏览器默认刷新页面
  // console.log('LOGIN');
  //用find来确认输入的用户名是否存在在accounts中，并找出对应的用户信息
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  // optional chaining ?.用来判断？前的对象存在时再取后面的属性，不存在时就默认undefined
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI
    containerApp.style.opacity = 100; //opacity的默认值是0
    // display welcome Message
    labelWelcome.textContent = `欢迎登录, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // start countDown
    if (timer) clearInterval(timer);
    timer = countdownLogout();

    // display date
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const date = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${year}/${month}/${date}/${hour}:${minutes}`;
    //clear 输入框
    inputLoginUsername.value = inputLoginPin.value = '';
    // 隐藏输入框焦点
    inputLoginPin.blur();

    updateUI(currentAccount);
    // countDownTimer
  }
});

////////////////////////
// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // 输入转账金额和对象账户
  const amount = Number(inputTransferAmount.value);
  const recieveAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, recieveAccount);
  //自动清空输入框
  inputTransferTo.value = inputTransferAmount.value = '';
  // 转账条件：金额大于0，对方账户存在，转账金额大于账户余额，只能转给除自己以外的人
  if (
    amount > 0 &&
    recieveAccount &&
    amount <= currentAccount.balance &&
    recieveAccount?.username !== currentAccount.username
  ) {
    // console.log('Transfer done!');
    // 自己账户中记录一条转出
    currentAccount.movements.push(-amount);
    // 对方账户中记录一条转入
    recieveAccount.movements.push(amount);
    // 更新一条日期信息
    currentAccount.movementsDates.push(new Date().toISOString());
    recieveAccount.movementsDates.push(new Date().toISOString());
    // 更新当前账户页面的记录、总计、余额
    updateUI(currentAccount);
    // 有操作之后就重置计时器
    clearInterval(timer);
    timer = countdownLogout();
  }
});

// closeAccount
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // console.log('delete');
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    // console.log(index);
    inputCloseUsername.value = inputClosePin.value = '';
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

// Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (currentAccount.movements.some(mov => mov > amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      // 有操作之后就重置计时器
      clearInterval(timer);
      timer = countdownLogout();
      inputLoanAmount.value = '';
    }, 2000);
  }
});

//btnSort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
// LECTURES
/*
console.log(+'23'); //23数字
console.log(Number.parseInt('2.5rmb')); //2//提取整数数字
console.log(Number.parseFloat('2.5rmb')); //2.5提取小数数字
console.log(Number.isNaN('20')); //false
console.log(Number.isNaN(+'20X')); //true
console.log(Number.isFinite(20)); //true检查是否为数字

// 在一个区间随机生成数字
// 0...1 -> 1...(max-min) ->min...max-min+min
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20)); //10...20

// 四舍五入
console.log(Math.round(11.3)); //11
console.log(Math.round(11.5)); //12

// 向上舍
console.log(Math.ceil(11.3)); //12
console.log(Math.ceil(11.5)); //12

// 向下舍
console.log(Math.floor(11.3)); //11
console.log(Math.floor(11.5)); //11
console.log(Math.floor(-11.3)); //-12

// 单纯取整
console.log(Math.trunc(-11.3)); //-11

// 设置小数点
console.log((23.125).toFixed(2)); //四舍五入到小数点后两位

// 余数 % ，可以用作判断偶数和奇数；也可以用在每几次循环一次事件时(比如每隔一行或者2行设置一个颜色等等)
// 判断偶数
const isEven = n => n % 2 === 0;
console.log(isEven(4)); //true
console.log(isEven(-12)); //true
console.log(isEven(25)); //false

// 每几行设置一个颜色
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0,2,4,6,8,,,行设置成粉色
    if (i % 2 === 0) {
      row.style.background = 'pink';
    }
    // 0,3,6,9,,行设置成蓝色
    if (i % 3 === 0) {
      row.style.background = '#ffb003';
    }
  });
});

//////////////////////////////////////////
// BigInt
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 - 1);
console.log(10000000n * 2000000n); //20000000000000n
console.log(11n / 3n); //3n
console.log(11 / 3); //3.6666666666666665

const huge = 2382489509401673n;
const num = 100;
console.log(huge * BigInt(num)); //238248950940167300n

console.log(20n > 19); //true
console.log(20n === 20); //false
console.log(20n == 20); //true
console.log(20n == '20'); //true
*/

////////////////////////////////////////
// Dates

/*
/////////////////////////////////////////////////
// Slice
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice()); //['a', 'b', 'c', 'd', 'e']
console.log([...arr]); //['a', 'b', 'c', 'd', 'e']

// Splice: Delete
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// Reverse：反转顺序
const brr = [1, 2, 3, 4, 5, 6];
// console.log(brr.reverse()); //[6,5,4,3,2,1]

// Concat
const crr = [7, 8, 9, 10];
console.log(brr.concat(crr)); //[1, 2, 3, 4, 5, 6,7, 8, 9, 10]
console.log([...brr, ...crr]); //same

// join
const str = brr.concat(crr).join('-');
console.log(str); //1-2-3-4-5-6-7-8-9-10

// At()
const arr = [23, 14, 64];

// Getting the last element
console.log(arr.slice(-1)); //[64]
console.log(arr.slice(-1)[0]); //64
console.log(arr[arr.length - 1]); //64

// ***************
console.log(arr.at(-1)); //64
// console.log(arr.splice(-1)); //[64]
// console.log(arr); //[23,14]
*/

///////////////////////////////
/*
// forEach(): Array
// 是一个callback函数，只有在被数组调用的时候才会执行，不同于for of循环的是，他会立刻遍历整个数组，没法用continue和break去干扰；function(1,2,3)中1必须是element，2是index，3是整个array
console.log('---- FOREACH ----');
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movment ${i}: You deposited ${mov}.`);
  } else {
    console.log(`Movment ${i}: You withdraw ${Math.abs(mov)}.`);
  }
});
// function(200,0,[200, 450, -400, 3000, -650, -130, 70, 1300])
// function(450,1,[200, 450, -400, 3000, -650, -130, 70, 1300])
// function(-400,2,[200, 450, -400, 3000, -650, -130, 70, 1300])
// ......
*/

/*
// forEach(): Map()
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// forEach(): Set()
const a = new Set(['USD', 'EUR', 'GBP', 'USD', 'GBP']);
// set只有value，没有key，所以key的位置会自动传递value的值
a.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`);
});
*/

/////////////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrect = dogsJulia.slice();
  dogsJuliaCorrect.splice(0, 1); //splice()从前往后删的时候，需要一个截止index，且删除元素后会直接影响原本的数组
  console.log(dogsJuliaCorrect); //[5,2,12,7]
  dogsJuliaCorrect.splice(-2);
  console.log(dogsJuliaCorrect); //[5,2]

  const dogs = dogsJuliaCorrect.concat(dogsKate);
  dogs.forEach(function (age, i) {
    if (age >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

/////////////////////////////////
/*
// The map Method
// 在map函数中对数组的元素挨个儿计算后，返回值会自动添加到一个新的数组中，省去了提前声明一个空数组的过程，可以直接将返回值赋值给一个变量。
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const rmbToJpy = 20;

// const movementsJpy = movements.map(function (mov) {
//   return Math.abs(mov * rmbToJpy);
// });
// console.log(movementsJpy);

// Arrow Funtion（简洁）
const movementsJpy = movements.map(mov => Math.abs(mov * rmbToJpy));
console.log(movementsJpy);

const movementsDescriptions = movements.map((mov, i) => {
  return `Movment ${i}: You ${mov > 0 ? 'deposited' : 'withdraw'} ${Math.abs(
    mov
  )}.`;
});
console.log(movementsDescriptions);

//////////////////////////////
/*
//filter()会创建一个新数组，包含所有使回调函数返回true的元素，所以这个函数的返回值应该是true，语句是条件。
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

/////////////////////////////
/*
// reduce()每次迭代都会返回一个accumulation，然后一直迭代到最后一个元素结束后返回最终值
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// accumulator ->雪球：每一次迭代，雪球就会变化成当前计算结果
const balance = movements.reduce((accmu, current, i, arr) => {
  console.log(`Accumulation ${i}: ${accmu}`);
  return accmu + current;
}, 0);
console.log(balance);

// 同样
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

//reduce()计算最大值
const max = movements.reduce(function (acc, mov) {
  if (acc > mov) {
    return acc;
  } else {
    return mov; //mov返回给下一轮开始的accumulation
  }
}, movements[0]);
console.log(`MAX: ${max}`);

//reduce()计算最小值
const min = movements.reduce(function (acc, mov) {
  if (acc < mov) {
    return acc;
  } else {
    return mov; //mov返回给下一轮开始的accumulation
  }
}, movements[0]);
console.log(`MIN: ${min}`);
*/

/////////////////////////////////////////////
// Coding Challenge #2
/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const age1 = [5, 2, 4, 1, 15, 8, 3];
const age2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(dogAge =>
    dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
  ); //map()
  const adult = humanAge.filter(age => age >= 18); //filter()
  const average = Math.trunc(
    adult.reduce(function (acc, age) {
      return acc + age;
    }, 0) / adult.length
  ); //reduce()

  // // 2,3的平均值，(2+3)/2 :2/2+3/2
  // const average = adult.reduce(function (acc, age, i, arr) {
  //   return acc + age / arr.length;
  // }, 0);
  return average;
};
console.log(calcAverageHumanAge(age1));
console.log(calcAverageHumanAge(age2));
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
const calcAverageHumanAge2 = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4)) //先将狗的年龄换算成人的年龄，放入一个新的数组
    .filter(age => age >= 18) //筛选18岁以上的狗
    .reduce((acc, adult, i, arr) => acc + adult / arr.length, 0); //将18岁以上的狗的年龄相加并计算出平均数
console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));
*/

/*
// find()
const account = accounts.find(acc => acc.owner === 'Sarah Smith');
console.log(account);
// // for of loop
// let account = {};
// for (const acc of accounts) {
//   if (acc.owner === 'Sarah Smith') {
//     account = acc;
//   }
// }
// console.log(account);

// include():等于判断
console.log(movements.includes(-130)); //true
// some()：包含判断
console.log(movements.some(mov => mov > 0)); //true
// every()：全对判断
console.log(account4.movements.every(mov => mov > 0)); //true

// flat()[[1,2,3],[4,5,6],7]]=>[1,2,3,4,5,6,7]
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
const arr = [
  [[1, 2], 3],
  [4, 5],
  [6, 7],
];
console.log(arr.flat(2)); //[1,2,3,4,5,6,7]，嵌套两层就可以指定层数从而拉平
// faltMap()
const overallBalance2 = accounts
  .flatMap(acc => acc.movements) //map & flat
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
*/

/*
// Array from()
const arr = Array.from({ length: 10 }, () => Math.trunc(Math.random() * 100));
console.log(arr);
const arr2 = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(arr2);

// Array.from()方法如何将DOM集合转换为数组
labelBalance.addEventListener('click', function () {
  const movementsFromUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('¥', '')
  );
  console.log(movementsFromUI); // ['1300', '70', '-130', '-650', '3000', '-400', '450', '200']
});
*/

/*
///////////////////////////
// Array Methods Practice

// 1.计算accounts里面所有元素中的movments的总和
const depositAll = accounts
  .flatMap(acc => acc.movements)
  .reduce((sum, cur) => sum + cur, 0);
console.log(depositAll);

// 2.
const numDeposite1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => (cur >= 1000 ? count +1 : count));
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposite1000);
console.log(accounts.flatMap(acc => acc.movements));

// const sum = { a: 1, b: 2 };
// console.log(sum['a']); //方括号指定法

//3.用reduce分别计算deposite和withdrawl的和
const { deposite, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur>0 ? sum.deposite += cur : sum.withdrawal +=cur
      sum[cur > 0 ? 'deposite' : 'withdrawal'] += cur;
      return sum;
    },
    {
      deposite: 0,
      withdrawal: 0,
    } //sum.deposite && sum.withdrawal
  );
console.log(deposite, withdrawal);

// 将标题中的词语首字母变成大写，除了连接词
// This is a nice practice => This Is a Nice Practice
const capitalTitleCase = function (title) {
  const exception = ['a', 'an', 'and', 'but', 'in', 'on', 'or', 'the', 'with'];

  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exception.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(capitalTitleCase('This is a nice practice'));
console.log(capitalTitleCase('and here is an another WORD'));
*/

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1.
console.log('----1----');

dogs.forEach(function (curEl, i, arr) {
  curEl.recFood = Math.trunc(curEl.weight ** 0.75 * 28);
});
// 2.
console.log('----2----');

dogs.find(function (curEl, i, arr) {
  if (curEl.owners.includes('Sarah')) {
    let str1 = "Sarah's dog eats";
    const str2 =
      curEl.curFood < curEl.recFood
        ? 'too little!'
        : curEl.curFood > curEl.recFood
        ? 'too much!'
        : 'Okay!';
    console.log(`${str1} ${str2}`);
  }
});

// 3.
console.log('----3----');

const ownersEatTooLittle = dogs
  .filter(curEl => curEl.curFood < curEl.recFood)
  .flatMap(curEl => curEl.owners);
const ownersEatTooMuch = dogs
  .filter(curEl => curEl.curFood > curEl.recFood)
  .flatMap(curEl => curEl.owners);
console.log(ownersEatTooLittle, ownersEatTooMuch);

// 4.
console.log('----4----');
// let str = "'s dogs eat too";
// const eatStirng = function (arr) {
//   const str = arr.reduce((acc, cur, i) => {
//     if (i === 0) return cur;
//     return `${acc} and ${cur}`;
//   });
//   return str;
// };
// const owners1 = eatStirng(ownersEatTooLittle);
// const owners2 = eatStirng(ownersEatTooMuch);
// const strEatTooLittle = owners1 + str + ' Little!';
// const strEatTooMuch = owners2 + str + ' Much!';
// console.log(strEatTooLittle, strEatTooMuch);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
console.log('----5----');
const exactly = dogs.some(curEl => curEl.curFood === curEl.recFood);
console.log(`exactly: ${exactly}`);

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
console.log('----6----');
const checkOkay = curEl =>
  curEl.curFood > curEl.recFood * 0.9 && curEl.curFood < curEl.recFood * 1.1;

const Okay = dogs.some(checkOkay); //对dogs中的每一个元素都进行checkOkay
console.log(`OKAY: ${Okay}`);

// 7.
console.log('----7----');
const dogsOkay = dogs.filter(checkOkay);
console.log(dogsOkay);

// 8.
console.log('----8----');
const dogsCopySort = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsCopySort);
*/
