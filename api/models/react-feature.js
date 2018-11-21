const mongoose = require('mongoose');

const reactFeatureSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, unique: true, required: true },
	isEnabled: { type: Boolean, required: true },
	ratio: { type: Number, required: true },
	specificEmails: [{ type: String }],
});

module.exports = mongoose.model('react-feature', reactFeatureSchema);
