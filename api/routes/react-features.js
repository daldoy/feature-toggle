const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const ReactFeature = require('../models/react-feature');
const User = require('../models/user');

router.post('/add-feature/', checkAuth, (req, res, next) => {
	ReactFeature.find({ name: req.body.name })
		.exec()
		.then(name => {
			if (name.length >= 1) {
				return res.status(409).json({
					message: 'Feature name already exists',
				});
			} else {
				let enabled = false;
				if (req.body.isEnabled === 'enabled') {
					enabled = true;
				}
				const newFeature = new ReactFeature({
					_id: new mongoose.Types.ObjectId(),
					name: req.body.name,
					isEnabled: enabled,
					ratio: req.body.ratio,
					specificEmails: req.body.specificEmails,
				});
				newFeature
					.save()
					.then(result => {
						console.log('result');
						console.log(result);

						if (enabled) {
							User.find({})
								.exec()
								.then(usersQ => {
									// shuffle the users to avoid that the first users always get the new features
									const users = shuffle(usersQ);
									let numUsers = Math.floor((req.body.ratio / 100) * users.length);
									for (let user of users) {
										numUsers--;
										if (numUsers >= 0) {
											user.features.push(req.body.name);
											user.save();
										} else {
											if (req.body.specificEmails.includes(user.email)) {
												user.features.push(req.body.name);
												user.save();
											}
										}
									}

									res.status(201).json({
										message: 'Feature created',
									});
								})
								.catch(err => {
									console.log('err users.find()');
									console.log(err);
									res.status(500).json({
										error: err,
									});
								});
						} else {
							res.status(201).json({
								message: 'Feature created',
							});
						}
					})
					.catch(err => {
						console.log('err newFeature.save()');
						console.log(err);
						res.status(500).json({
							error: err,
						});
					});
			}
		});
});

router.patch('/update-feature/', checkAuth, (req, res, next) => {
	ReactFeature.findById(req.body.id)
		.exec()
		.then(feature => {
			if (!feature) {
				return res.status(409).json({
					message: 'Feature does not exist',
				});
			} else {
				let enabled = false;
				if (req.body.isEnabled === 'enabled') {
					enabled = true;
				}
				feature.isEnabled = enabled;
				feature.ratio = req.body.ratio;
				feature.specificEmails = req.body.specificEmails;

				if (feature.name === 'admin') {
					enabled = true;
					feature.ratio = 0;
					if (!feature.specificEmails.includes('admin@admin.com')) {
						feature.specificEmails.push('admin@admin.com');
					}
				}

				feature
					.save()
					.then(result => {
						console.log('result');
						console.log(result);

						if (enabled) {
							User.find({})
								.exec()
								.then(usersQ => {
									// shuffle the users to avoid that the first users always get the new features
									const users = shuffle(usersQ);
									let numUsers = Math.floor((req.body.ratio / 100) * users.length);
									for (let user of users) {
										numUsers--;
										if (numUsers >= 0) {
											if (!user.features.includes(req.body.name)) {
												user.features.push(req.body.name);
												user.save();
											}
										} else {
											const idx = user.features.indexOf(req.body.name);
											if (idx !== -1 && !req.body.specificEmails.includes(user.email)) {
												user.features.splice(idx, 1);
												user.save();
											} else if (idx === -1 && req.body.specificEmails.includes(user.email)) {
												user.features.push(req.body.name);
												user.save();
											}
										}
									}

									res.status(200).json({
										message: 'Product updated',
									});
								})
								.catch(err => {
									console.log('err users.find()');
									console.log(err);
									res.status(500).json({
										error: err,
									});
								});
						} else {
							User.find({})
								.exec()
								.then(users => {
									for (let user of users) {
										const idx = user.features.indexOf(req.body.name);
										if (idx !== -1) {
											user.features.splice(idx, 1);
											user.save();
										}
									}
									res.status(200).json({
										message: 'Product updated',
									});
								})
								.catch(err => {
									console.log('err users.find()');
									console.log(err);
									res.status(500).json({
										error: err,
									});
								});
						}
					})
					.catch(err => {
						console.log('err updateFeature.save()');
						console.log(err);
						res.status(500).json({
							error: err,
						});
					});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.delete('/delete-feature/', checkAuth, (req, res, next) => {
	ReactFeature.findById(req.body.id)
		.exec()
		.then(feature => {
			if (!feature) {
				return res.status(409).json({
					message: 'Feature does not exist',
				});
			} else {
				const name = feature.name;
				User.find({})
					.exec()
					.then(users => {
						for (let user of users) {
							const idx = user.features.indexOf(name);
							if (idx !== -1) {
								user.features.splice(idx, 1);
								user.save();
							}
						}
					})
					.catch(err => {
						console.log('err users.find()');
						console.log(err);
						res.status(500).send(err);
					});

				feature
					.remove()
					.then(result => {
						console.log('result deleted');
						console.log(result);
						res.status(200).json({
							message: 'Feature deleted',
						});
					})
					.catch(err => {
						console.log('err feature.remove()');
						console.log(err);
						res.status(500).json({
							error: err,
						});
					});
			}
		})
		.catch(err => {
			console.log('err feature.remove()');
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/get-user-features/', (req, res, next) => {
	User.find({ email: req.query.email })
		.exec()
		.then(users => {
			const user = users[0];
			console.log('user');
			console.log(user);
			res.status(200).json(user.features);
		})
		.catch(err => {
			console.log('err Users.find()');
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/get-my-features/', checkAuth, (req, res, next) => {
	User.find({ email: req.userData.email })
		.exec()
		.then(users => {
			const user = users[0];
			res.status(200).json(user.features);
		})
		.catch(err => {
			console.log('err Users.find()');
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/get-all-features/', checkAuth, (req, res, next) => {
	ReactFeature.find({})
		.exec()
		.then(features => {
			res.status(200).json(features);
		})
		.catch(err => {
			console.log('err');
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

function shuffle(arra1) {
	let ctr = arra1.length;
	let temp;
	let index;

	while (ctr > 0) {
		index = Math.floor(Math.random() * ctr);
		ctr--;
		temp = arra1[ctr];
		arra1[ctr] = arra1[index];
		arra1[index] = temp;
	}
	return arra1;
}

module.exports = router;
