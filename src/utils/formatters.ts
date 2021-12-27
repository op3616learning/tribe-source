const COUNT_ABBRS = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
export const formatCount = (count, withAbbr = true, decimals = 2) => {
    const absoluteCount = Math.abs(count);
    const i = absoluteCount <= 1
        ? 0
        : Math.floor(Math.log(absoluteCount) / Math.log(1000));
    let result = `${parseFloat((absoluteCount / 1000 ** i).toFixed(decimals))}`;
    if (withAbbr) {
        result += `${COUNT_ABBRS[i]}`;
    }
    if (count < 0) {
        result = `-${result}`;
    }
    return result;
};
export const formatNumberWithCommas = (value) => {
    const valueAsNumber = Number(value);
    return Number.isNaN(valueAsNumber)
        ? String(value)
        : valueAsNumber.toLocaleString('en-US');
};
//# sourceMappingURL=formatters.js.map