import BigNumber from "bignumber.js"
export const divide = (value: BigNumber.Value, divider:BigNumber.Value):string =>{
    return new BigNumber(value).dividedBy(divider).toString()
}
