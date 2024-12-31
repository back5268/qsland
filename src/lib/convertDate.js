import moment from "moment"

export const databaseDate = (date, isFinal, type) => {
    if (isFinal) return moment(date.setHours(23, 59, 59)).format("YYYY-MM-DD HH:mm:ss");
    if (date === "0000-00-00 00:00:00") return undefined;
    if (!date || date === '0000-00-00') {
        if (type === 'date') return ""
        else return "0000-00-00 00:00:00"
    }
    else {
        if (type === 'date') return moment(date).format("YYYY-MM-DD");
        else return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
}