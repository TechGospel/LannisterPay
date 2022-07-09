export default compute = (req, res) => {
	//unpacking request object
	const { ID, Amount, SplitInfo } = req.body;

	//Initialize balance with transaction amount before computation
	let balance = Amount;
	//Initialize result object
	let result = {
		ID: ID,
		Balance: 0,
		SplitBreakdown: [],
	};

	/**Initialize splitEntities object with splitEntityId
	 * and 0 amount as key-value pair
	 * */
	let splitEntities = {};
	for (let i = 0; i < SplitInfo.length; i++) {
		splitEntities[getEntityID(SplitInfo[i])] = 0;
	}

	//Initialize and compute totalRatio
	let totalRatio = SplitInfo.filter(
		(splitEntity) => splitEntity.SplitType == "RATIO"
	).reduce((a, b) => a + b, 0);

	//Compute splits for FLAT splitType
	for (let i = 0; i < SplitInfo.length; i++) {
		if (SplitInfo[i].SplitType == "FLAT") {
			splitEntities[SplitInfo[i].SplitEntityId] +=
				SplitInfo[i].SplitValue;
			balance -= SplitInfo[i].SplitValue;
		}
	}

	//Compute splits for PERCENTAGE splitType
	for (let i = 0; i < SplitInfo.length; i++) {
		if (SplitInfo[i].SplitType == "PERCENTAGE") {
			splitEntities[SplitInfo[i].SplitEntityId] +=
				SplitInfo[i].SplitValue;
			balance = balance - balance * SplitInfo[i].SplitValue;
		}
	}

	//Compute splits for RATIO splitType
	for (let i = 0; i < SplitInfo.length; i++) {
		if (SplitInfo[i].SplitType == "RATIO") {
			splitEntities[SplitInfo[i].SplitEntityId] +=
				SplitInfo[i].SplitValue;
			balance = balance - balance * (SplitInfo.SplitValue / totalRatio);
		}
	}

	/**Update result object with balance and
	 * splitbreakdown after computation
	 * */
	result.Balance = balance;
	for (const entity in entities) {
		result.SplitBreakdown.push({
			SplitEntityId: entity,
			Amount: entities[entity],
		});
	}

	/**
     * for (let i = 0; i < SplitInfo.length; i++) {
		if (SplitInfo[i].SplitType == "FLAT") {
			balance = balance - SplitInfo[i].SplitValue;
		} else if (SplitInfo[i].SplitType == "PERCENTAGE") {
			balance = balance - balance * SplitInfo[i].SplitValue;
		} else if (SplitInfo[i].SplitType == "RATIO") {
			balance = balance - balance * (SplitInfo.SplitValue / totalRatio);
		} else {
			res.status(400).json({
				error: "Invalid SplitType in request body",
			});
		}
	}
    */

	res.status(200).json(result);
};

function getEntityID(splitInfo) {
	return splitInfo.SplitEntityId;
}

/**
 * function getRatio(SplitEntity) {
	if (SplitEntity.SplitType == "RATIO") {
		return SplitEntity.SplitValue;
	} else {
		return 0;
	}
}
*/
