export function getTime(date: string, type: string) {
    let time = new Date(date);
    let Y = time.getFullYear();
    let Mon = time.getMonth() + 1;
    let Day = time.getDate();
    let H = time.getHours();
    let Min = time.getMinutes();
    let S = time.getSeconds();

    if (type === "Y") {
        return `${Y}-${Mon}-${Day}`
    } else if (type === "H") {
        return `${H}:${Min}:${S}`
    } else {
        return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
    }
}

function assemble2DimArr(inputArr: []) {
    let pin = 4
    let len = inputArr.length;
    let lineNum = len % pin === 0 ? len / pin : Math.floor((len / pin) + 1);
    let res = []
    for (let i = 0; i < lineNum; i++) {
        let temp = inputArr.slice(i * pin, i * pin + pin);
        res.push(temp);
    }
    return res
}