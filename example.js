crudMethod =  {
  add: (form) => {},
  del: (id) => {},
  edit: (form) => {},
  get: (id) => { console.log('22')}
},
crudMethod.get()

crudDept = {
	add: (data) => {
		console.log('1')
	},
	del: (data) => {
		console.log('2')
	},
	edit: (data) => {
		console.log('3')
	}
},

crudMethod = { ...crudDept }
console.log(crudMethod)
