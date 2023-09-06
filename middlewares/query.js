const select = (param, condition, join) => {
  let select = `*`, table = `tb_m_users`, orderBy = 'user_id', order = 'ASC'
  if (param.table) {
		table = param.table
	}
	if (param.select) {
		select = param.select
	}
	if (param.orderBy) {
		orderBy = param.orderBy
	}
	if (param.order) {
		order = param.order
	}

  let query = `SELECT `+select+` FROM `+table
  if (join.length > 0) {
		for (const i in join) {
			let objJoin = join[i]
			let table = objJoin.table
			let field = objJoin.field
			let reference = objJoin.reference
			let tableReference = reference.table
			let fieldReference = reference.field
			query += ` JOIN ${table} ON ${table}.${field} = ${tableReference}.${fieldReference}`
		}
	}
  if (condition) {
		let x = 1, y = 1;
		Object.keys(condition).forEach((item) => {
			if (y == 1){
				query += (typeof condition[item] == 'number') ?
        ` WHERE ${table}.${item} = ${condition[item]}` :
        (condition[item] == 'null') ? ` WHERE ${table}.${item} IS NULL` :
        ` WHERE LOWER(${table}.${item}) LIKE '%${condition[item].trim().toLowerCase()}%' `;
				x++;
			}
			else {
				query += (typeof condition[item] == 'number') ?
        ` AND ${table}.${item} = ${condition[item]}` :
        (condition[item] == 'null') ? ` AND ${table}.${item} IS NULL` :
        ` AND LOWER(${table}.${item}) LIKE '%${condition[item].trim().toLowerCase()}%' `;
				x++; 
			}
			y++;
			return true;
		})
	}
  if (param.groupBy) {
		let groupBy = param.groupBy
    query += ` GROUP BY ${groupBy}`
	}
	query += ` ORDER BY ${orderBy} ${order}`
	if (param.limit) {
		query += ` LIMIT ${param.limit}`
	}
	if (param.page) {
		query += ` OFFSET ${(param.page-1) * param.limit}`
	}
  return query
}

const insert = (table, datas, returning) => {
	let query = `INSERT INTO ${table} (`;
  let x = 0;

	Object.keys(datas[0]).map((key) => {
		if (x==0) {
			query += `${key}`;
		}
		else {
			query += `,${key}`;
		}
		x++;
		return true;
	});

	query += `) VALUES `;

	let y = 0;
	datas.map((data) => {
		if (y == 0){
			query += '(';

			let i = 0;
			Object.keys(data).map((key) => {
				if (i==0) {
					if(data[key] === null){
						query += `${data[key]}`
					}else{
						query += (typeof data[key] == 'number') ? `${data[key]}` : `'${data[key]}'`;
					}
				}
				else {
					if(data[key] === null){
						query += `,${data[key]}`
					}else {
						query += (typeof data[key] == 'number') ? `,${data[key]}` : `,'${data[key]}'`;
					}
				}
				i++;
				return true;
			})
			query += `)`;
		}
		else {
			query += ',(';

			let i = 0;
			Object.keys(data).map((key) => {
				if (i==0) {
					if(data[key] === null){
						query += `${data[key]}`
					}else{
						query += (typeof data[key] == 'number') ? `${data[key]}` : `'${data[key]}'`;
					}
				}
				else {
					if(data[key] === null){
						query += `,${data[key]}`
					}else{
						query += (typeof data[key] == 'number') ? `,${data[key]}` : `,'${data[key]}'`;
					}
				}
				i++;
				return true;
			});
			query += `)`;
		}
		y++;
	})

	query += ' RETURNING '+returning;
	
	return query
}

const update = (table, datas, where) => {
	let query = `UPDATE ${table} SET `;
	let x = 1;

	let z = 1;
	Object.keys(datas).forEach((item) => {
		if (datas[item] !== '') {
			if (z == 1){
				query += (typeof datas[item] == 'number') ? `${item} = ${datas[item]}` : `${item} = '${datas[item]}'`;
				x++;
			}
			else {
				query += (typeof datas[item] == 'number') ? `, ${item} = ${datas[item]}` : `, ${item} = '${datas[item]}'`;
				x++;
			}
		}
		z++;
		return true;
	})

	let y = 1;
	Object.keys(where).forEach((item) => {
		if (y == 1){
			query += (typeof where[item] == 'number') ? ` WHERE ${item} = ${where[item]}` : ` WHERE ${item} = '${where[item]}'`;
			x++;
		}
		else {
			query += (typeof where[item] == 'number') ? ` AND ${item} = ${where[item]}` : ` AND ${item} = '${where[item]}'`;
			x++;
		}
		y++;
		return true;
	})
	
	return query
}

const del = (table, where) => {
	let query = `DELETE FROM ${table}`;
	let x = 1;

	let y = 1;
	Object.keys(where).forEach((item) => {
		if (y == 1){
			query += (typeof where[item] == 'number') ? ` WHERE ${item} = ${where[item]}` : ` WHERE ${item} = '${where[item]}'`;
			x++;
		}
		else {
			query += (typeof where[item] == 'number') ? ` AND ${item} = ${where[item]}` : ` AND ${item} = '${where[item]}'`;
			x++;
		}
		y++;
		return true;
	})
	
	return query
}

module.exports = {
	select,
  insert,
  update,
  del
}