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