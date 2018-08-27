const createDicNodes = {
	createSelectOption: ( {list=[], disabled=false} ) => {
		return list.map((item) => <option disabled={disabled} value={item.code} key={item.code}>{item.name}</option>)
	},
}

export default createDicNodes 