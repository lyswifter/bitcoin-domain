import { InscriptionItem, InsType } from "../router/type";

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

export function shortenAddr(addr: string, subSLen: number) {
    return addr.substring(0, subSLen) + '...' + addr.substring(addr.length - subSLen, addr.length)
}

export const toXOnly = (pubKey: Buffer) =>
    pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export function classifiyImageWith(element: InscriptionItem) {
    if (element.domain) {
        element.type = InsType.DOMAIN; // MAINDOMAIN
    } else {
        switch (element.detail.content_type) {
            case 'image/png':
                element.type = InsType.IMAGE
                break;

            case 'image/jpg':
                element.type = InsType.IMAGE
                break;

            case 'image/jpeg':
                element.type = InsType.IMAGE
                break;

            case 'image/webp':
                element.type = InsType.IMAGE
                break;

            case 'image/svg+xml':
                element.type = InsType.IMAGE
                break;

            case 'image/gif':
                element.type = InsType.GIF
                break;

            case 'text/plain;charset=utf-8':
                element.type = InsType.TEXT;
                break;

            case 'application/json':
                element.type = InsType.TEXT;
                break;

            case 'mp3':
                element.type = InsType.AUDIO;
                break;

            case 'mp4':
                element.type = InsType.VIDEO;
                break;

            default:
                element.type = InsType.OTHER;
                break;
        }
    }
    return element
}

export function TimeFormat(input: number) {
    let d: string | number = parseInt(String(input / 60 / 60 / 24))
    d = d < 10 ? '0' + d : d

    let h: string | number = parseInt(String((input / 60 / 60) % 24))
    h = h < 10 ? '0' + h : h

    let m: string | number = parseInt(String((input / 60) % 60))
    m = m < 10 ? '0' + m : m

    let s: string | number = parseInt(String(input % 60))
    s = s < 10 ? '0' + s : s

    return m + ':' + s
}
