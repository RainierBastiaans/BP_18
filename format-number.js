export function formatLargeNumber(number) {
    if (typeof number !== 'number') {
        return 'Input is not a valid number';
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


