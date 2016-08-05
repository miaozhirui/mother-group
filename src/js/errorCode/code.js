
module.exports = {

	20015: {

		callback(data, utils) {
			utils.tipInfo({

				content: data.message,
				
				callback() {

					if(utils.isWeiXin()){
						
						location.href = "/we.php";
					}
				}
			})
			
		}
	}
}