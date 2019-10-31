/*
 *[2, 2, 2, 2] => [4, 4, 0 0]
 *[2, 0, 2, 2] => [4, 2, 0, 0]
 *[2, 4, 2, 2] => [2, 4, 4, 0]
 *[2, 4, 4, 2] => [2, 8, 2, 0]
 *[0, 2, 0, 2] => [4, 0, 0, 0]
 * 
 * 
 */

let count = 0
let div = Array.from(document.querySelectorAll('.grid_container .title'))
let scoreObj = document.querySelector('.score span')

//判断是否失败
function search() {
    for (var i = 0; i < div.length; i++) {
        if (i >= 0 && i < 3 || (i > 3 && i < 7 || (i > 7 && i < 11))) {
            if (div[i].dataset.val === div[i + 1].dataset.val || div[i].dataset.val === div[i + 4]
                .dataset.val) return
        }
        if (i > 11 && i < 15) {
            if (div[i].dataset.val === div[i + 1].dataset.val) return
        }
        if (i === 3 || i === 7 || i === 11) {
            if (div[i].dataset.val === div[i + 4].dataset.val) return
        }
    }
    alert('失败')
}

//产生随机方块
let getRandom = function () {
    let random = Math.floor(Math.random() * div.length)
    let flag = div.every(item => {
        return item.dataset.val !== '0'
    })
    flag && search() 
    if (!parseInt(div[random].dataset.val)) {
        div[random].innerHTML = 2
        div[random].dataset.val = 2
        return
    }
    getRandom()
}

//初始化 显示两个方块
getRandom()
getRandom()


//清除本地缓存
document.querySelector('.reset').onclick = function () {
    count = 0
    div.map(item => {
        item.dataset.val = '0'
        item.innerHTML = ''
    })
    scoreObj.innerHTML = 0
    getRandom()
    getRandom()
    window.localStorage.setItem('2048', '[]')
}

//获取 session
function getSession() {
    let sessionArr = JSON.parse(window.localStorage.getItem('2048')) || []
    if (!sessionArr.length) return
    div.forEach((item, i) => {
        item.dataset.index = sessionArr[i].index
        item.dataset.val = sessionArr[i].val
        item.innerHTML = sessionArr[i].content
    })
    let oldCount = parseInt(sessionArr[sessionArr.length - 1].score)
    scoreObj.innerHTML = oldCount
    count = oldCount / 10
}
getSession()
//设置 session
function setSession() {
    let sessionArr = div.map(item => {
        let index = item.dataset.index
        let val = item.dataset.val
        let content = item.innerHTML
        return {
            index,
            val,
            content
        }
    })
    sessionArr.push({
        score: count * 10
    })
    window.localStorage.setItem('2048', JSON.stringify(sessionArr))
}

//相加
function add(arr) {
    let newArr = []
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[j] != 0) break
        }
        if (arr[i] !== 0) {
            if (arr[i] !== arr[j]) {
                newArr.push(arr[i])
            } else {
                newArr.push(arr[i] + arr[j])
                i = j
            }
        }
    }
    let addZero = [0, 0, 0, 0].map((item, i) => item = newArr[i] ? newArr[i] : 0)
    let flag = arr.every((item, i) => item === addZero[i])

    return [addZero, flag]
}

// 渲染
function getArr(arr) {
    let newArr = arr.map(item => parseInt(div[item].dataset.val))
    let flagArr = add(newArr)
    let addArr = flagArr[0]
    arr.forEach((item, i) => {
        div[item].dataset.val = addArr[i]
        div[item].innerHTML = addArr[i] ? addArr[i] : ''
    })
    return flagArr[1]
}

//设置 session 加分
function direction (arr) {

    let newArr = arr.map(item => getArr(item))
    let flag = newArr.every(item => item === true)
    if (flag) {
        let flag2 = div.every(item => item.dataset.val !== '0')
  
        flag2 && search()
        return 
    }
    getRandom()
    count++
    setSession()
}


let bindSwipeEvent = function (el, topcallback, bottomback, leftcallback, rightcallback) {
    let start = 0
    let end = 0
    let ismove = false
    let startX = 0
    let endX = 0
    let ismoveX = false
    el.addEventListener('touchstart', function (e) {
        start = e.touches[0].clientY
        startX = e.touches[0].clientX
    })

    el.addEventListener('touchmove', function (e) {
        ismove = true
        end = e.touches[0].clientY
        ismoveX = true
        endX = e.touches[0].clientX
    })
    el.addEventListener('touchend', function (e) {
        let distanceY = start - end
        let distanceX = startX - endX
        if (ismoveX && Math.abs(distanceX) > 50 && ismove && Math.abs(distanceY) > 50) {
            if (Math.abs(distanceX) > Math.abs(distanceY)) {
                if (distanceX > 0) {
                    leftcallback && leftcallback.call(this, e)
                } else {
                    rightcallback && rightcallback.call(this, e)
                }
            } else if (Math.abs(distanceX) < Math.abs(distanceY)) {
                if (distanceY > 0) {
                    topcallback && topcallback.call(this, e)
                } else {
                    bottomback && bottomback.call(this, e)
                }
            }
            ismoveX = ismove = false
            endX = startX = end = start = 0
            return
        }

        if (ismove && Math.abs(distanceY) > 50) {
            if (distanceY > 0) {
                topcallback && topcallback.call(this, e)
            } else {
                bottomback && bottomback.call(this, e)
            }
            ismoveX = ismove = false
            endX = startX = end = start = 0
            return
        }
        if (ismoveX && Math.abs(distanceX) > 50) {
            if (distanceX > 0) {
                leftcallback && leftcallback.call(this, e)
            } else {
                rightcallback && rightcallback.call(this, e)
            }
            ismoveX = ismove = false
            endX = startX = end = start = 0
            return
        }
        ismoveX = ismove = false
        endX = startX = end = start = 0
    })
}
bindSwipeEvent(document, () => {
    direction([[0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]])
    getScore()
}, () => {
    direction([[12, 8, 4, 0], [13, 9, 5, 1], [14, 10, 6, 2], [15, 11, 7, 3]])
    getScore()
}, () => {
    direction([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11],[12, 13, 14, 15]])
    getScore()
}, () => {
    direction([[3, 2, 1, 0], [7, 6, 5, 4], [11, 10, 9, 8], [15, 14, 13, 12]])
    getScore()
})


function getScore() {
    scoreObj.innerHTML = count * 10
}


document.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
        case 37:
            direction([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11],[12, 13, 14, 15]])
            break
        case 38:
            direction([[0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]])
            break
        case 39:
            direction([[3, 2, 1, 0], [7, 6, 5, 4], [11, 10, 9, 8], [15, 14, 13, 12]])
            break
        case 40:
            direction([[12, 8, 4, 0], [13, 9, 5, 1], [14, 10, 6, 2], [15, 11, 7, 3]])
            break
    }
    getScore()
})



document.body.addEventListener('touchmove', function (e) {
    e.preventDefault()
}, {
    passive: false
})

document.body.onselectstart = document.body.ondrag = function () {
    return false;
}