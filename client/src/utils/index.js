export const generateRoomID = () => {
    let s = '', i = 2;
    while (i-- > 0) {
        s += Math.random().toString(36).slice(2).slice(0,3)
        s += '-'
    }
    s += Math.random().toString(36).slice(2).slice(0,3);
    return s;
}